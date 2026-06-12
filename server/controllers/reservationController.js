const pool = require('../config/db');

// Get next ID helper
const getNextId = async (table, prefix, idColumn) => {
  const [rows] = await pool.query(`SELECT ${idColumn} FROM ${table} ORDER BY ${idColumn} DESC LIMIT 1`);
  if (rows.length === 0) return `${prefix}001`;
  const lastNum = parseInt(rows[0][idColumn].replace(prefix, ''));
  return `${prefix}${String(lastNum + 1).padStart(3, '0')}`;
};

// Get available tables
exports.getAvailableTables = async (req, res, next) => {
  try {
    const { date, capacity } = req.query;

    let query = `SELECT rt.*, 
      (SELECT COUNT(*) FROM Reservation r WHERE r.table_id = rt.table_id AND r.date = ?) as bookings_today
      FROM Reservation_Table rt WHERE 1=1`;
    const params = [date || new Date().toISOString().split('T')[0]];

    if (capacity) {
      query += ' AND rt.seating_capacity >= ?';
      params.push(parseInt(capacity));
    }

    query += ' ORDER BY rt.seating_capacity ASC';

    const [tables] = await pool.query(query, params);

    // Get available time slots for each table on the given date
    for (let table of tables) {
      const [bookedSlots] = await pool.query(
        `SELECT ts.* FROM Reservation r
         JOIN TimeSlot ts ON r.slot_id = ts.slot_id
         WHERE r.table_id = ? AND r.date = ?`,
        [table.table_id, date || new Date().toISOString().split('T')[0]]
      );
      const [allSlots] = await pool.query('SELECT * FROM TimeSlot ORDER BY start_time');
      
      table.available_slots = allSlots.filter(
        slot => !bookedSlots.find(bs => bs.slot_id === slot.slot_id)
      );
      table.booked_slots = bookedSlots;
    }

    res.json({ success: true, data: tables });
  } catch (error) {
    next(error);
  }
};

// Get recommended tables
exports.getRecommendedTables = async (req, res, next) => {
  try {
    const [tables] = await pool.query(
      `SELECT rt.*, COUNT(r.reservation_id) as total_bookings
       FROM Reservation_Table rt
       LEFT JOIN Reservation r ON rt.table_id = r.table_id
       AND r.customer_id = ?
       GROUP BY rt.table_id
       ORDER BY total_bookings DESC
       LIMIT 3`,
      [req.user.customer_id]
    );

    res.json({ success: true, data: tables });
  } catch (error) {
    next(error);
  }
};

// Book a table
exports.bookTable = async (req, res, next) => {
  try {
    const { table_id, date, time, guests } = req.body;

    if (!table_id || !date || !time) {
      return res.status(400).json({ success: false, message: 'table_id, date, and time are required.' });
    }

    // Auto-resolve slot_id from time: find the TimeSlot whose window contains the requested time
    const [slots] = await pool.query('SELECT * FROM TimeSlot ORDER BY start_time');
    let resolvedSlotId = null;

    for (const slot of slots) {
      // Compare HH:MM strings — pick the slot whose start_time <= time < end_time
      if (slot.start_time <= time && time < slot.end_time) {
        resolvedSlotId = slot.slot_id;
        break;
      }
    }

    // Fallback: pick the closest slot by start_time if no exact match
    if (!resolvedSlotId && slots.length > 0) {
      resolvedSlotId = slots[slots.length - 1].slot_id;
      for (const slot of slots) {
        if (slot.start_time <= time) resolvedSlotId = slot.slot_id;
        else break;
      }
    }

    if (!resolvedSlotId) {
      return res.status(400).json({ success: false, message: 'No available time slot found for that time.' });
    }

    // Check if slot is already booked for this table/date
    const [existing] = await pool.query(
      'SELECT reservation_id FROM Reservation WHERE table_id = ? AND slot_id = ? AND date = ?',
      [table_id, resolvedSlotId, date]
    );

    if (existing.length > 0) {
      return res.status(409).json({ success: false, message: 'This time slot is already booked for that table.' });
    }

    const reservationId = await getNextId('Reservation', 'R', 'reservation_id');

    await pool.query(
      'INSERT INTO Reservation (reservation_id, customer_id, table_id, slot_id, date, time) VALUES (?, ?, ?, ?, ?, ?)',
      [reservationId, req.user.customer_id, table_id, resolvedSlotId, date, time]
    );

    // Create arrival log entry
    const arrivalId = await getNextId('Arrival_Log', 'A', 'arrival_id');
    await pool.query(
      'INSERT INTO Arrival_Log (arrival_id, reservation_id, actual_arrival_time) VALUES (?, ?, ?)',
      [arrivalId, reservationId, time]
    );

    // Get reservation details
    const [reservation] = await pool.query(
      `SELECT r.*, rt.seating_capacity, ts.start_time, ts.end_time
       FROM Reservation r
       JOIN Reservation_Table rt ON r.table_id = rt.table_id
       JOIN TimeSlot ts ON r.slot_id = ts.slot_id
       WHERE r.reservation_id = ?`,
      [reservationId]
    );

    res.status(201).json({
      success: true,
      message: 'Table reserved successfully.',
      data: reservation[0]
    });
  } catch (error) {
    next(error);
  }
};

// Get booking history
exports.getBookings = async (req, res, next) => {
  try {
    const [bookings] = await pool.query(
      `SELECT r.*, rt.seating_capacity, ts.start_time, ts.end_time,
              al.actual_arrival_time
       FROM Reservation r
       JOIN Reservation_Table rt ON r.table_id = rt.table_id
       JOIN TimeSlot ts ON r.slot_id = ts.slot_id
       LEFT JOIN Arrival_Log al ON r.reservation_id = al.reservation_id
       WHERE r.customer_id = ?
       ORDER BY r.date DESC, r.time DESC`,
      [req.user.customer_id]
    );

    res.json({ success: true, data: bookings });
  } catch (error) {
    next(error);
  }
};

// Get single booking
exports.getBooking = async (req, res, next) => {
  try {
    const { reservationId } = req.params;

    const [bookings] = await pool.query(
      `SELECT r.*, rt.seating_capacity, ts.start_time, ts.end_time,
              al.actual_arrival_time
       FROM Reservation r
       JOIN Reservation_Table rt ON r.table_id = rt.table_id
       JOIN TimeSlot ts ON r.slot_id = ts.slot_id
       LEFT JOIN Arrival_Log al ON r.reservation_id = al.reservation_id
       WHERE r.reservation_id = ? AND r.customer_id = ?`,
      [reservationId, req.user.customer_id]
    );

    if (bookings.length === 0) {
      return res.status(404).json({ success: false, message: 'Reservation not found.' });
    }

    res.json({ success: true, data: bookings[0] });
  } catch (error) {
    next(error);
  }
};

const pool = require('../config/db');

const getNextId = async (table, prefix, idColumn) => {
  const [rows] = await pool.query(`SELECT ${idColumn} FROM ${table} ORDER BY ${idColumn} DESC LIMIT 1`);
  if (rows.length === 0) return `${prefix}001`;
  const lastNum = parseInt(rows[0][idColumn].replace(prefix, ''));
  return `${prefix}${String(lastNum + 1).padStart(3, '0')}`;
};

// Submit feedback
exports.submitFeedback = async (req, res, next) => {
  try {
    const { order_id, rating, comment } = req.body;

    if (!rating) {
      return res.status(400).json({ success: false, message: 'Rating is required.' });
    }

    let resolvedOrderId = order_id;

    if (!resolvedOrderId) {
      // Find the latest order of this customer to link feedback
      const [latest] = await pool.query(
        'SELECT order_id FROM Orders WHERE customer_id = ? ORDER BY order_date DESC, order_time DESC LIMIT 1',
        [req.user.customer_id]
      );
      if (latest.length > 0) {
        resolvedOrderId = latest[0].order_id;
      } else {
        // Create a completed dummy order to avoid violating the foreign key constraint
        const getNextId = async (table, prefix, idColumn) => {
          const [rows] = await pool.query(`SELECT ${idColumn} FROM ${table} ORDER BY ${idColumn} DESC LIMIT 1`);
          if (rows.length === 0) return `${prefix}001`;
          const lastNum = parseInt(rows[0][idColumn].replace(prefix, ''));
          return `${prefix}${String(lastNum + 1).padStart(3, '0')}`;
        };
        
        const orderId = await getNextId('Orders', 'O', 'order_id');
        const now = new Date();
        const orderDate = now.toISOString().split('T')[0];
        const orderTime = now.toTimeString().split(' ')[0];

        await pool.query(
          `INSERT INTO Orders (order_id, customer_id, order_date, order_time, status, total_amount, tracking_status)
           VALUES (?, ?, ?, ?, 'Completed', 0.0, 'Delivered')`,
          [orderId, req.user.customer_id, orderDate, orderTime]
        );
        resolvedOrderId = orderId;
      }
    }

    // Check if feedback already exists for this order/customer
    const [existing] = await pool.query(
      'SELECT feedback_id FROM Feedback WHERE order_id = ? AND customer_id = ?',
      [resolvedOrderId, req.user.customer_id]
    );

    if (existing.length > 0) {
      // Update existing feedback instead of erroring, so user experience is smooth
      await pool.query(
        'UPDATE Feedback SET rating = ?, comment = ? WHERE feedback_id = ?',
        [rating, comment || null, existing[0].feedback_id]
      );
      return res.json({ success: true, message: 'Feedback updated successfully.' });
    }

    const feedbackId = await getNextId('Feedback', 'F', 'feedback_id');

    await pool.query(
      'INSERT INTO Feedback (feedback_id, customer_id, order_id, rating, comment) VALUES (?, ?, ?, ?, ?)',
      [feedbackId, req.user.customer_id, resolvedOrderId, rating, comment || null]
    );

    res.status(201).json({ success: true, message: 'Feedback submitted successfully.' });
  } catch (error) {
    next(error);
  }
};

// Get public feedback (for reviews page)
exports.getPublicFeedback = async (req, res, next) => {
  try {
    const [feedback] = await pool.query(
      `SELECT f.*, c.name as customer_name, c.profile_photo
       FROM Feedback f
       JOIN Customer c ON f.customer_id = c.customer_id
       ORDER BY f.feedback_id DESC`
    );

    const [stats] = await pool.query(
      `SELECT AVG(rating) as avg_rating, COUNT(*) as total_reviews FROM Feedback`
    );

    res.json({
      success: true,
      data: {
        reviews: feedback,
        stats: {
          avg_rating: stats[0].avg_rating ? parseFloat(stats[0].avg_rating).toFixed(1) : '0.0',
          total_reviews: stats[0].total_reviews
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

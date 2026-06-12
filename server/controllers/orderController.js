const pool = require('../config/db');

// Helper to generate next ID
const getNextId = async (table, prefix, idColumn, conn = pool) => {
  const [rows] = await conn.query(`SELECT ${idColumn} FROM ${table} ORDER BY ${idColumn} DESC LIMIT 1`);
  if (rows.length === 0) return `${prefix}001`;
  const lastNum = parseInt(rows[0][idColumn].replace(prefix, ''));
  return `${prefix}${String(lastNum + 1).padStart(3, '0')}`;
};

// Place order
exports.placeOrder = async (req, res, next) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const { payment_mode, scheduled_time, reservation_id } = req.body;
    const customer_id = req.user.customer_id;

    // Get cart items
    const [cartItems] = await connection.query(
      `SELECT c.*, mi.price as item_price, mi.name as item_name
       FROM Cart c JOIN MenuItem mi ON c.menuitem_id = mi.menuitem_id
       WHERE c.customer_id = ?`,
      [customer_id]
    );

    if (cartItems.length === 0) {
      await connection.rollback();
      return res.status(400).json({ success: false, message: 'Cart is empty.' });
    }

    // Calculate totals
    const totalAmount = cartItems.reduce((sum, item) => sum + (item.item_price * item.quantity), 0);
    const taxAmount = parseFloat((totalAmount * 0.1).toFixed(2));
    const discount = parseFloat((totalAmount * 0.05).toFixed(2));
    const finalPayable = parseFloat((totalAmount + taxAmount - discount).toFixed(2));

    // Create order
    const orderId = await getNextId('Orders', 'O', 'order_id', connection);
    const now = new Date();
    const orderDate = now.toLocaleDateString('en-CA');
    const orderTime = now.toTimeString().split(' ')[0];

    let dbScheduledTime = null;
    if (scheduled_time) {
      const timePart = scheduled_time.includes('T') ? scheduled_time.split('T')[1] : scheduled_time;
      dbScheduledTime = timePart.split(':').length === 2 ? `${timePart}:00` : timePart;
    }

    await connection.query(
      `INSERT INTO Orders (order_id, customer_id, reservation_id, order_date, order_time, status, total_amount, scheduled_time, tracking_status)
       VALUES (?, ?, ?, ?, ?, 'Pending', ?, ?, 'Received')`,
      [orderId, customer_id, reservation_id || null, orderDate, orderTime, totalAmount, dbScheduledTime]
    );

    // Create order details
    for (const item of cartItems) {
      const odId = await getNextId('Order_Details', 'OD', 'order_detail_id', connection);
      await connection.query(
        'INSERT INTO Order_Details (order_detail_id, order_id, menuitem_id, quantity, price) VALUES (?, ?, ?, ?, ?)',
        [odId, orderId, item.menuitem_id, item.quantity, item.item_price * item.quantity]
      );
    }

    // Create bill
    const billId = await getNextId('Bill', 'B', 'bill_id', connection);
    await connection.query(
      'INSERT INTO Bill (bill_id, order_id, total_amount, tax_amount, discount, final_payable) VALUES (?, ?, ?, ?, ?, ?)',
      [billId, orderId, totalAmount, taxAmount, discount, finalPayable]
    );

    // Create payment
    const paymentId = await getNextId('Payment', 'PAY', 'payment_id', connection);
    const paymentStatus = payment_mode === 'Cash' ? 'Pending' : 'Paid';
    await connection.query(
      'INSERT INTO Payment (payment_id, bill_id, payment_mode, payment_status, payment_time) VALUES (?, ?, ?, ?, ?)',
      [paymentId, billId, payment_mode, paymentStatus, orderTime]
    );

    // Create kitchen schedule
    const ksId = await getNextId('Kitchen_Schedule', 'KS', 'schedule_id', connection);
    const cookStart = new Date(now.getTime() + 5 * 60000);
    const cookEnd = new Date(now.getTime() + 25 * 60000);
    await connection.query(
      'INSERT INTO Kitchen_Schedule (schedule_id, order_id, cooking_start_time, expected_completion_time) VALUES (?, ?, ?, ?)',
      [ksId, orderId, cookStart.toTimeString().split(' ')[0], cookEnd.toTimeString().split(' ')[0]]
    );

    // Clear cart
    await connection.query('DELETE FROM Cart WHERE customer_id = ?', [customer_id]);

    await connection.commit();

    res.status(201).json({
      success: true,
      message: 'Order placed successfully.',
      data: {
        order_id: orderId,
        total_amount: totalAmount,
        tax_amount: taxAmount,
        discount,
        final_payable: finalPayable,
        payment_mode,
        payment_status: paymentStatus,
        tracking_status: 'Received',
        items: cartItems.map(i => ({ name: i.item_name, quantity: i.quantity, price: i.item_price }))
      }
    });
  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
};

// Helper to dynamically calculate and update order tracking status
const updateOrderTrackingStatus = async (order, conn = pool) => {
  if (!order || !order.order_date || !order.order_time) return;

  // Let's parse the order date and time
  let orderDateStr;
  if (order.order_date instanceof Date) {
    const y = order.order_date.getFullYear();
    const m = String(order.order_date.getMonth() + 1).padStart(2, '0');
    const d = String(order.order_date.getDate()).padStart(2, '0');
    orderDateStr = `${y}-${m}-${d}`;
  } else {
    orderDateStr = String(order.order_date).split('T')[0];
  }

  const orderTimeStr = order.order_time;
  
  // Combine date and time
  // e.g. "2026-05-19T21:55:00"
  const orderDateTime = new Date(`${orderDateStr}T${orderTimeStr}`);
  const now = new Date();
  
  // Difference in milliseconds
  const diffMs = now - orderDateTime;
  const diffMinutes = diffMs / 60000;

  let newTrackingStatus = order.tracking_status;
  let newStatus = order.status;

  // Progression logic (in minutes):
  // 0 - 0.5 mins (30s): Received
  // 0.5 - 1.5 mins (90s): Preparing
  // 1.5 - 3 mins (180s): Cooking
  // 3 - 4.5 mins (270s): Serving
  // > 4.5 mins: Delivered / Completed
  if (diffMinutes >= 4.5) {
    newTrackingStatus = 'Delivered';
    newStatus = 'Completed';
  } else if (diffMinutes >= 3.0) {
    newTrackingStatus = 'Serving';
    newStatus = 'Pending';
  } else if (diffMinutes >= 1.5) {
    newTrackingStatus = 'Cooking';
    newStatus = 'Pending';
  } else if (diffMinutes >= 0.5) {
    newTrackingStatus = 'Preparing';
    newStatus = 'Pending';
  } else {
    newTrackingStatus = 'Received';
    newStatus = 'Pending';
  }

  if (newTrackingStatus !== order.tracking_status || newStatus !== order.status) {
    await conn.query(
      'UPDATE Orders SET tracking_status = ?, status = ? WHERE order_id = ?',
      [newTrackingStatus, newStatus, order.order_id]
    );
    order.tracking_status = newTrackingStatus;
    order.status = newStatus;
  }
};

// Get order history
exports.getOrders = async (req, res, next) => {
  try {
    const [orders] = await pool.query(
      `SELECT o.*, b.total_amount as bill_total, b.tax_amount, b.discount, b.final_payable,
              p.payment_mode, p.payment_status,
              ks.cooking_start_time, ks.expected_completion_time
       FROM Orders o
       LEFT JOIN Bill b ON o.order_id = b.order_id
       LEFT JOIN Payment p ON b.bill_id = p.bill_id
       LEFT JOIN Kitchen_Schedule ks ON o.order_id = ks.order_id
       WHERE o.customer_id = ?
       ORDER BY o.order_date DESC, o.order_time DESC`,
      [req.user.customer_id]
    );

    // Get items and update statuses for each order
    for (let order of orders) {
      await updateOrderTrackingStatus(order, pool);
      const [items] = await pool.query(
        `SELECT od.*, mi.name, mi.image_url, mi.description
         FROM Order_Details od
         JOIN MenuItem mi ON od.menuitem_id = mi.menuitem_id
         WHERE od.order_id = ?`,
        [order.order_id]
      );
      order.items = items;
    }

    res.json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
};

// Get single order
exports.getOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;

    const [orders] = await pool.query(
      `SELECT o.*, b.total_amount as bill_total, b.tax_amount, b.discount, b.final_payable,
              p.payment_mode, p.payment_status,
              ks.cooking_start_time, ks.expected_completion_time
       FROM Orders o
       LEFT JOIN Bill b ON o.order_id = b.order_id
       LEFT JOIN Payment p ON b.bill_id = p.bill_id
       LEFT JOIN Kitchen_Schedule ks ON o.order_id = ks.order_id
       WHERE o.order_id = ? AND o.customer_id = ?`,
      [orderId, req.user.customer_id]
    );

    if (orders.length === 0) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    const order = orders[0];
    await updateOrderTrackingStatus(order, pool);

    const [items] = await pool.query(
      `SELECT od.*, mi.name, mi.image_url, mi.description
       FROM Order_Details od
       JOIN MenuItem mi ON od.menuitem_id = mi.menuitem_id
       WHERE od.order_id = ?`,
      [orderId]
    );

    order.items = items;

    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

// Get tracking status
exports.getTracking = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const [rows] = await pool.query(
      'SELECT order_id, status, tracking_status, order_date, order_time, scheduled_time FROM Orders WHERE order_id = ? AND customer_id = ?',
      [orderId, req.user.customer_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    const order = rows[0];
    await updateOrderTrackingStatus(order, pool);

    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};


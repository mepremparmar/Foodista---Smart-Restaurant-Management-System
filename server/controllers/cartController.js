const pool = require('../config/db');

// Get next cart ID
const getNextCartId = async () => {
  const [rows] = await pool.query('SELECT cart_id FROM Cart ORDER BY cart_id DESC LIMIT 1');
  if (rows.length === 0) return 'CART001';
  const lastNum = parseInt(rows[0].cart_id.replace('CART', ''));
  return `CART${String(lastNum + 1).padStart(3, '0')}`;
};

// Get cart items
exports.getCart = async (req, res, next) => {
  try {
    const [items] = await pool.query(
      `SELECT c.cart_id, c.quantity, mi.menuitem_id, mi.name, mi.price, mi.description,
              mi.image_url, mi.dietary_type, m.menu_name
       FROM Cart c
       JOIN MenuItem mi ON c.menuitem_id = mi.menuitem_id
       JOIN Menu m ON mi.menu_id = m.menu_id
       WHERE c.customer_id = ?`,
      [req.user.customer_id]
    );

    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    res.json({ success: true, data: { items, total } });
  } catch (error) {
    next(error);
  }
};

// Add to cart
exports.addToCart = async (req, res, next) => {
  try {
    const { menuitem_id, quantity = 1 } = req.body;

    // Check if item already in cart
    const [existing] = await pool.query(
      'SELECT cart_id, quantity FROM Cart WHERE customer_id = ? AND menuitem_id = ?',
      [req.user.customer_id, menuitem_id]
    );

    if (existing.length > 0) {
      await pool.query(
        'UPDATE Cart SET quantity = quantity + ? WHERE cart_id = ?',
        [quantity, existing[0].cart_id]
      );
    } else {
      const cartId = await getNextCartId();
      await pool.query(
        'INSERT INTO Cart (cart_id, customer_id, menuitem_id, quantity) VALUES (?, ?, ?, ?)',
        [cartId, req.user.customer_id, menuitem_id, quantity]
      );
    }

    res.json({ success: true, message: 'Item added to cart.' });
  } catch (error) {
    next(error);
  }
};

// Update cart quantity
exports.updateCart = async (req, res, next) => {
  try {
    const { cartId } = req.params;
    const { quantity } = req.body;

    if (quantity <= 0) {
      await pool.query('DELETE FROM Cart WHERE cart_id = ? AND customer_id = ?',
        [cartId, req.user.customer_id]);
    } else {
      await pool.query(
        'UPDATE Cart SET quantity = ? WHERE cart_id = ? AND customer_id = ?',
        [quantity, cartId, req.user.customer_id]
      );
    }

    res.json({ success: true, message: 'Cart updated.' });
  } catch (error) {
    next(error);
  }
};

// Remove from cart
exports.removeFromCart = async (req, res, next) => {
  try {
    const { cartId } = req.params;
    await pool.query('DELETE FROM Cart WHERE cart_id = ? AND customer_id = ?',
      [cartId, req.user.customer_id]);
    res.json({ success: true, message: 'Item removed from cart.' });
  } catch (error) {
    next(error);
  }
};

// Clear cart
exports.clearCart = async (req, res, next) => {
  try {
    await pool.query('DELETE FROM Cart WHERE customer_id = ?', [req.user.customer_id]);
    res.json({ success: true, message: 'Cart cleared.' });
  } catch (error) {
    next(error);
  }
};

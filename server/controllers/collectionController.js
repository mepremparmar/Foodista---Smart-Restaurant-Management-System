const pool = require('../config/db');

const getNextId = async () => {
  const [rows] = await pool.query('SELECT collection_id FROM Collection ORDER BY collection_id DESC LIMIT 1');
  if (rows.length === 0) return 'COL001';
  const lastNum = parseInt(rows[0].collection_id.replace('COL', ''));
  return `COL${String(lastNum + 1).padStart(3, '0')}`;
};

// Get user collections
exports.getCollections = async (req, res, next) => {
  try {
    const [items] = await pool.query(
      `SELECT col.collection_id, col.added_date, mi.*, m.menu_name
       FROM Collection col
       JOIN MenuItem mi ON col.menuitem_id = mi.menuitem_id
       JOIN Menu m ON mi.menu_id = m.menu_id
       WHERE col.customer_id = ?
       ORDER BY col.added_date DESC`,
      [req.user.customer_id]
    );

    res.json({ success: true, data: items });
  } catch (error) {
    next(error);
  }
};

// Add to collection
exports.addToCollection = async (req, res, next) => {
  try {
    const { menuitem_id } = req.body;

    const [existing] = await pool.query(
      'SELECT collection_id FROM Collection WHERE customer_id = ? AND menuitem_id = ?',
      [req.user.customer_id, menuitem_id]
    );

    if (existing.length > 0) {
      return res.status(409).json({ success: false, message: 'Item already in collection.' });
    }

    const colId = await getNextId();
    const today = new Date().toISOString().split('T')[0];

    await pool.query(
      'INSERT INTO Collection (collection_id, customer_id, menuitem_id, added_date) VALUES (?, ?, ?, ?)',
      [colId, req.user.customer_id, menuitem_id, today]
    );

    res.status(201).json({ success: true, message: 'Item added to collection.' });
  } catch (error) {
    next(error);
  }
};

// Remove from collection
exports.removeFromCollection = async (req, res, next) => {
  try {
    const { collectionId } = req.params;
    await pool.query(
      'DELETE FROM Collection WHERE (collection_id = ? OR menuitem_id = ?) AND customer_id = ?',
      [collectionId, collectionId, req.user.customer_id]
    );
    res.json({ success: true, message: 'Item removed from collection.' });
  } catch (error) {
    next(error);
  }
};

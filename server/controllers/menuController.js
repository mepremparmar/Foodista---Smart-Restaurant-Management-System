const pool = require('../config/db');

// Get all menus with items
exports.getAllMenus = async (req, res, next) => {
  try {
    const [menus] = await pool.query('SELECT * FROM Menu');
    const [items] = await pool.query('SELECT * FROM MenuItem');

    const menusWithItems = menus.map(menu => ({
      ...menu,
      items: items.filter(item => item.menu_id === menu.menu_id)
    }));

    res.json({ success: true, data: menusWithItems });
  } catch (error) {
    next(error);
  }
};

// Get menu items with filters
exports.getMenuItems = async (req, res, next) => {
  try {
    const { category, dietary, search } = req.query;
    let query = 'SELECT mi.*, m.menu_name FROM MenuItem mi JOIN Menu m ON mi.menu_id = m.menu_id WHERE 1=1';
    const params = [];

    if (category) {
      query += ' AND mi.category = ?';
      params.push(category);
    }
    if (dietary) {
      query += ' AND mi.dietary_type = ?';
      params.push(dietary);
    }
    if (search) {
      query += ' AND (mi.name LIKE ? OR mi.description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    const [items] = await pool.query(query, params);

    // Get average ratings for each item
    const itemsWithRatings = await Promise.all(
      items.map(async (item) => {
        const [ratings] = await pool.query(
          `SELECT AVG(f.rating) as avg_rating, COUNT(f.rating) as total_ratings
           FROM Feedback f
           JOIN Orders o ON f.order_id = o.order_id
           JOIN Order_Details od ON o.order_id = od.order_id
           WHERE od.menuitem_id = ?`,
          [item.menuitem_id]
        );
        return {
          ...item,
          avg_rating: ratings[0].avg_rating ? parseFloat(ratings[0].avg_rating).toFixed(1) : '0.0',
          total_ratings: ratings[0].total_ratings || 0
        };
      })
    );

    res.json({ success: true, data: itemsWithRatings });
  } catch (error) {
    next(error);
  }
};

// Get recommended items based on user preferences
exports.getRecommended = async (req, res, next) => {
  try {
    const [prefs] = await pool.query(
      'SELECT taste_preference, dietary_choice FROM Preference WHERE customer_id = ?',
      [req.user.customer_id]
    );

    let query = 'SELECT mi.*, m.menu_name FROM MenuItem mi JOIN Menu m ON mi.menu_id = m.menu_id';
    const params = [];

    if (prefs.length > 0 && prefs[0].dietary_choice) {
      query += ' WHERE mi.dietary_type = ?';
      params.push(prefs[0].dietary_choice);
    }

    query += ' ORDER BY mi.price DESC LIMIT 8';

    const [items] = await pool.query(query, params);

    // Also get most ordered items by this user
    const [mostOrdered] = await pool.query(
      `SELECT mi.*, COUNT(od.menuitem_id) as order_count, m.menu_name
       FROM Order_Details od
       JOIN Orders o ON od.order_id = o.order_id
       JOIN MenuItem mi ON od.menuitem_id = mi.menuitem_id
       JOIN Menu m ON mi.menu_id = m.menu_id
       WHERE o.customer_id = ?
       GROUP BY od.menuitem_id
       ORDER BY order_count DESC LIMIT 4`,
      [req.user.customer_id]
    );

    res.json({
      success: true,
      data: {
        recommended: items,
        mostOrdered
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get featured items (highest rated)
exports.getFeatured = async (req, res, next) => {
  try {
    const [items] = await pool.query(
      `SELECT mi.*, m.menu_name, AVG(f.rating) as avg_rating, COUNT(f.rating) as total_ratings
       FROM MenuItem mi
       JOIN Menu m ON mi.menu_id = m.menu_id
       LEFT JOIN Order_Details od ON mi.menuitem_id = od.menuitem_id
       LEFT JOIN Orders o ON od.order_id = o.order_id
       LEFT JOIN Feedback f ON o.order_id = f.order_id
       GROUP BY mi.menuitem_id
       ORDER BY avg_rating DESC, total_ratings DESC
       LIMIT 6`
    );

    res.json({ success: true, data: items });
  } catch (error) {
    next(error);
  }
};

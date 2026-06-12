const pool = require('../config/db');

// Get user profile
exports.getProfile = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT c.customer_id, c.name, c.email, c.phone, c.profile_photo, c.dob, c.gender, c.theme,
              p.taste_preference, p.dietary_choice
       FROM Customer c
       LEFT JOIN Preference p ON c.customer_id = p.customer_id
       WHERE c.customer_id = ?`,
      [req.user.customer_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    res.json({ success: true, data: rows[0] });
  } catch (error) {
    next(error);
  }
};

// Update profile
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, email, phone, dob, gender, profile_photo } = req.body;

    await pool.query(
      `UPDATE Customer SET name = COALESCE(?, name), email = COALESCE(?, email),
       phone = COALESCE(?, phone), dob = COALESCE(?, dob),
       gender = COALESCE(?, gender), profile_photo = COALESCE(?, profile_photo)
       WHERE customer_id = ?`,
      [name, email, phone, dob, gender, profile_photo, req.user.customer_id]
    );

    res.json({ success: true, message: 'Profile updated successfully.' });
  } catch (error) {
    next(error);
  }
};

// Update preferences
exports.updatePreferences = async (req, res, next) => {
  try {
    const { taste_preference, dietary_choice } = req.body;

    const [existing] = await pool.query(
      'SELECT preference_id FROM Preference WHERE customer_id = ?',
      [req.user.customer_id]
    );

    if (existing.length === 0) {
      const prefId = req.user.customer_id.replace('C', 'PREF');
      await pool.query(
        `INSERT INTO Preference (preference_id, customer_id, taste_preference, dietary_choice)
         VALUES (?, ?, ?, ?)`,
        [prefId, req.user.customer_id, taste_preference, dietary_choice]
      );
    } else {
      await pool.query(
        `UPDATE Preference SET taste_preference = COALESCE(?, taste_preference),
         dietary_choice = COALESCE(?, dietary_choice) WHERE customer_id = ?`,
        [taste_preference, dietary_choice, req.user.customer_id]
      );
    }

    res.json({ success: true, message: 'Preferences updated successfully.' });
  } catch (error) {
    next(error);
  }
};

// Update theme
exports.updateTheme = async (req, res, next) => {
  try {
    const { theme } = req.body;

    if (!['light', 'dark'].includes(theme)) {
      return res.status(400).json({ success: false, message: 'Theme must be light or dark.' });
    }

    await pool.query(
      'UPDATE Customer SET theme = ? WHERE customer_id = ?',
      [theme, req.user.customer_id]
    );

    res.json({ success: true, message: 'Theme updated successfully.' });
  } catch (error) {
    next(error);
  }
};

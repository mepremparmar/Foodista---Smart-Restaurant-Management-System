const pool = require('../config/db');

exports.submitContactNote = async (req, res, next) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email, and message are required.' });
    }

    await pool.query(
      'INSERT INTO email (name, email_id, message) VALUES (?, ?, ?)',
      [name, email, message]
    );

    res.status(201).json({ success: true, message: 'Message sent and stored successfully.' });
  } catch (error) {
    next(error);
  }
};

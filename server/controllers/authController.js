const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
require('dotenv').config();

// Generate next customer ID
const getNextCustomerId = async () => {
  const [rows] = await pool.query(
    'SELECT customer_id FROM Customer ORDER BY customer_id DESC LIMIT 1'
  );
  if (rows.length === 0) return 'C001';
  const lastNum = parseInt(rows[0].customer_id.replace('C', ''));
  return `C${String(lastNum + 1).padStart(3, '0')}`;
};

// Signup
exports.signup = async (req, res, next) => {
  try {
    const { name, email, phone, password, profile_photo } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, phone, and password are required.'
      });
    }

    // Check for existing email or phone
    const [existing] = await pool.query(
      'SELECT customer_id FROM Customer WHERE email = ? OR phone = ?',
      [email, phone]
    );
    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email or phone already exists.'
      });
    }

    const password_hash = await bcrypt.hash(password, 12);
    const customer_id = await getNextCustomerId();

    await pool.query(
      `INSERT INTO Customer (customer_id, name, email, phone, password_hash, profile_photo)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [customer_id, name, email, phone, password_hash, profile_photo || null]
    );

    // Create default preferences
    const prefId = customer_id.replace('C', 'PREF');
    await pool.query(
      `INSERT INTO Preference (preference_id, customer_id, taste_preference, dietary_choice)
       VALUES (?, ?, 'Medium', 'Vegetarian')`,
      [prefId, customer_id]
    );

    const token = jwt.sign(
      { customer_id, email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      token,
      data: { customer_id, name, email, phone, profile_photo }
    });
  } catch (error) {
    next(error);
  }
};

// Login
exports.login = async (req, res, next) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email/phone and password are required.'
      });
    }

    const [rows] = await pool.query(
      'SELECT * FROM Customer WHERE email = ? OR phone = ?',
      [identifier, identifier]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials.'
      });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials.'
      });
    }

    const token = jwt.sign(
      { customer_id: user.customer_id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      success: true,
      message: 'Login successful.',
      token,
      data: {
        customer_id: user.customer_id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        profile_photo: user.profile_photo,
        theme: user.theme
      }
    });
  } catch (error) {
    next(error);
  }
};

// Verify token
exports.verify = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT customer_id, name, email, phone, profile_photo, dob, gender, theme FROM Customer WHERE customer_id = ?',
      [req.user.customer_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    res.json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    next(error);
  }
};

// Logout
exports.logout = (req, res) => {
  res.clearCookie('token');
  res.json({
    success: true,
    message: 'Logged out successfully.'
  });
};

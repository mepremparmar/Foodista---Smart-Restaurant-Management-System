const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

// Public route to submit contact note/email
router.post('/', contactController.submitContactNote);

module.exports = router;

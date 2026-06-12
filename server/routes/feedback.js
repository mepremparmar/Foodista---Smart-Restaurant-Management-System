const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');
const authMiddleware = require('../middleware/auth');

// Public route for reviews page
router.get('/public', feedbackController.getPublicFeedback);

// Protected route
router.post('/', authMiddleware, feedbackController.submitFeedback);

module.exports = router;

const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const authMiddleware = require('../middleware/auth');

// Public route for featured items (home page)
router.get('/featured', menuController.getFeatured);

// Protected routes
router.get('/', authMiddleware, menuController.getAllMenus);
router.get('/items', authMiddleware, menuController.getMenuItems);
router.get('/recommended', authMiddleware, menuController.getRecommended);

module.exports = router;

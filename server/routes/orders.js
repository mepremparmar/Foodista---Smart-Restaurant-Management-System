const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.post('/place', orderController.placeOrder);
router.post('/', orderController.placeOrder);
router.get('/', orderController.getOrders);
router.get('/:orderId', orderController.getOrder);
router.get('/:orderId/track', orderController.getTracking);

module.exports = router;

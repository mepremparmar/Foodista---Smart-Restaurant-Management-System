const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.get('/', cartController.getCart);
router.post('/add', cartController.addToCart);
router.put('/update/:cartId', cartController.updateCart);
router.delete('/remove/:cartId', cartController.removeFromCart);
router.delete('/clear', cartController.clearCart);

module.exports = router;

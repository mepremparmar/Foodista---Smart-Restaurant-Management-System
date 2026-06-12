const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.get('/tables', reservationController.getAvailableTables);
router.get('/tables/recommended', reservationController.getRecommendedTables);
router.post('/book', reservationController.bookTable);
router.get('/', reservationController.getBookings);
router.get('/:reservationId', reservationController.getBooking);

module.exports = router;

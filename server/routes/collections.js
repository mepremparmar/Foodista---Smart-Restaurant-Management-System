const express = require('express');
const router = express.Router();
const collectionController = require('../controllers/collectionController');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.get('/', collectionController.getCollections);
router.post('/add', collectionController.addToCollection);
router.delete('/remove/:collectionId', collectionController.removeFromCollection);

module.exports = router;

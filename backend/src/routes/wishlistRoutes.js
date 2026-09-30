const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.get('/', authenticateToken, wishlistController.getWishlist);
router.post('/toggle', authenticateToken, wishlistController.toggleWishlist);
router.delete('/:productId', authenticateToken, wishlistController.removeFromWishlist);

module.exports = router;

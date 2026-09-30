const express = require('express');
const router = express.Router();
const recController = require('../controllers/recController');
const { optionalAuth } = require('../middleware/authMiddleware');

router.get('/top', optionalAuth, recController.getTopRecommendations);
router.get('/by-interests', optionalAuth, recController.getByInterests);
router.get('/similar-viewed', optionalAuth, recController.getSimilarToRecentlyViewed);
router.get('/similar-wishlist', optionalAuth, recController.getSimilarToWishlist);
router.get('/trending', recController.getTrendingProducts);
router.get('/content', optionalAuth, recController.getRecommendedContent);

module.exports = router;

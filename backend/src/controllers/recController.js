const recommendationService = require('../services/recommendationService');

/**
 * Top personalized product recommendations with score & rationale badges
 */
exports.getTopRecommendations = (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;
    const limit = Number(req.query.limit) || 12;
    const recommendations = recommendationService.getTopRecommendations(userId, limit);

    return res.json({
      success: true,
      count: recommendations.length,
      recommendations
    });
  } catch (error) {
    console.error('getTopRecommendations error:', error);
    return res.status(500).json({ success: false, message: 'Server error generating recommendations.' });
  }
};

/**
 * Products tailored to user's declared interest tags
 */
exports.getByInterests = (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;
    const limit = Number(req.query.limit) || 4;
    const items = recommendationService.getByInterests(userId, limit);

    return res.json({
      success: true,
      count: items.length,
      items
    });
  } catch (error) {
    console.error('getByInterests error:', error);
    return res.status(500).json({ success: false, message: 'Server error retrieving interest recommendations.' });
  }
};

/**
 * Products similar to items the user recently viewed
 */
exports.getSimilarToRecentlyViewed = (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;
    const limit = Number(req.query.limit) || 4;
    const items = recommendationService.getSimilarToRecentlyViewed(userId, limit);

    return res.json({
      success: true,
      count: items.length,
      items
    });
  } catch (error) {
    console.error('getSimilarToRecentlyViewed error:', error);
    return res.status(500).json({ success: false, message: 'Server error retrieving viewed recommendations.' });
  }
};

/**
 * Products similar to wishlist items
 */
exports.getSimilarToWishlist = (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;
    const limit = Number(req.query.limit) || 4;
    const items = recommendationService.getSimilarToWishlist(userId, limit);

    return res.json({
      success: true,
      count: items.length,
      items
    });
  } catch (error) {
    console.error('getSimilarToWishlist error:', error);
    return res.status(500).json({ success: false, message: 'Server error retrieving wishlist recommendations.' });
  }
};

/**
 * Trending products
 */
exports.getTrendingProducts = (req, res) => {
  try {
    const limit = Number(req.query.limit) || 4;
    const items = recommendationService.getTrendingProducts(limit);

    return res.json({
      success: true,
      count: items.length,
      items
    });
  } catch (error) {
    console.error('getTrendingProducts error:', error);
    return res.status(500).json({ success: false, message: 'Server error retrieving trending products.' });
  }
};

/**
 * Scored articles for content hub
 */
exports.getRecommendedContent = (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;
    const limit = Number(req.query.limit) || 6;
    const recommendations = recommendationService.getRecommendedContent(userId, limit);

    return res.json({
      success: true,
      count: recommendations.length,
      recommendations
    });
  } catch (error) {
    console.error('getRecommendedContent error:', error);
    return res.status(500).json({ success: false, message: 'Server error generating content recommendations.' });
  }
};

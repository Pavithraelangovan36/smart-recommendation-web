const { db } = require('../db/db');

function formatProduct(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    brand: row.brand,
    category: row.category,
    price: row.price,
    originalPrice: row.original_price,
    discount: row.discount,
    rating: row.rating,
    reviewsCount: row.reviews_count,
    isTrending: Boolean(row.is_trending),
    isFeatured: Boolean(row.is_featured),
    image: row.image,
    gallery: JSON.parse(row.gallery || '[]'),
    description: row.description,
    features: JSON.parse(row.features || '[]'),
    inStock: Boolean(row.in_stock),
    dateAdded: row.date_added
  };
}

/**
 * Track user browsing activity (product view or article read)
 */
exports.trackActivity = (req, res) => {
  try {
    const { targetType, targetId, category } = req.body;
    if (!targetType || !targetId) {
      return res.status(400).json({ success: false, message: 'targetType and targetId are required.' });
    }

    const userId = req.user ? req.user.id : null;

    db.prepare(`
      INSERT INTO activities (user_id, target_type, target_id, category)
      VALUES (?, ?, ?, ?)
    `).run(userId, targetType, targetId, category || null);

    return res.json({ success: true });
  } catch (error) {
    console.error('trackActivity error:', error);
    return res.status(500).json({ success: false, message: 'Server error recording activity.' });
  }
};

/**
 * Get recently viewed products for the current user/session
 */
exports.getRecentlyViewed = (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;
    let products = [];

    if (userId) {
      const rows = db.prepare(`
        SELECT p.*, MAX(a.timestamp) as latest_view
        FROM activities a
        JOIN products p ON a.target_id = p.id
        WHERE a.user_id = ? AND a.target_type = 'product'
        GROUP BY p.id
        ORDER BY latest_view DESC
        LIMIT 10
      `).all(userId);
      products = rows.map(formatProduct);
    }

    if (products.length === 0) {
      // Fallback to top rated/trending products
      const rows = db.prepare('SELECT * FROM products WHERE is_trending = 1 LIMIT 6').all();
      products = rows.map(formatProduct);
    }

    return res.json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    console.error('getRecentlyViewed error:', error);
    return res.status(500).json({ success: false, message: 'Server error retrieving recent views.' });
  }
};

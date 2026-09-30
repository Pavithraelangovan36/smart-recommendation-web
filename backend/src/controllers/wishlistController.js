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
 * Get user wishlist
 */
exports.getWishlist = (req, res) => {
  try {
    const rows = db.prepare(`
      SELECT p.* 
      FROM wishlists w
      JOIN products p ON w.product_id = p.id
      WHERE w.user_id = ?
      ORDER BY w.created_at DESC
    `).all(req.user.id);

    const items = rows.map(formatProduct);
    const ids = items.map(i => i.id);

    return res.json({
      success: true,
      count: items.length,
      wishlistIds: ids,
      products: items
    });
  } catch (error) {
    console.error('getWishlist error:', error);
    return res.status(500).json({ success: false, message: 'Server error retrieving wishlist.' });
  }
};

/**
 * Toggle product in wishlist
 */
exports.toggleWishlist = (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({ success: false, message: 'Product ID is required.' });
    }

    const existing = db.prepare('SELECT id FROM wishlists WHERE user_id = ? AND product_id = ?').get(req.user.id, productId);

    let isWishlisted = false;
    if (existing) {
      db.prepare('DELETE FROM wishlists WHERE id = ?').run(existing.id);
      isWishlisted = false;
    } else {
      db.prepare('INSERT INTO wishlists (user_id, product_id) VALUES (?, ?)').run(req.user.id, productId);
      isWishlisted = true;
    }

    const count = db.prepare('SELECT COUNT(*) as count FROM wishlists WHERE user_id = ?').get(req.user.id)?.count || 0;

    return res.json({
      success: true,
      isWishlisted,
      count,
      message: isWishlisted ? 'Added to your wishlist!' : 'Removed from your wishlist.'
    });
  } catch (error) {
    console.error('toggleWishlist error:', error);
    return res.status(500).json({ success: false, message: 'Server error updating wishlist.' });
  }
};

/**
 * Remove product from wishlist
 */
exports.removeFromWishlist = (req, res) => {
  try {
    const { productId } = req.params;
    db.prepare('DELETE FROM wishlists WHERE user_id = ? AND product_id = ?').run(req.user.id, productId);
    const count = db.prepare('SELECT COUNT(*) as count FROM wishlists WHERE user_id = ?').get(req.user.id)?.count || 0;

    return res.json({
      success: true,
      count,
      message: 'Item removed from wishlist.'
    });
  } catch (error) {
    console.error('removeFromWishlist error:', error);
    return res.status(500).json({ success: false, message: 'Server error removing wishlist item.' });
  }
};

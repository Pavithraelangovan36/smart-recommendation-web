const { db } = require('../db/db');

class RecommendationService {
  /**
   * Get active weights from database or return default linear scoring weights
   */
  getWeights() {
    try {
      const row = db.prepare('SELECT * FROM algorithm_settings WHERE id = 1').get();
      if (row) {
        return {
          interestMatch: row.interest_match,
          categoryMatch: row.category_match,
          wishlistAffinity: row.wishlist_affinity,
          viewedAffinity: row.viewed_affinity,
          highRating: row.high_rating,
          trending: row.trending
        };
      }
    } catch (e) {
      console.error('Error fetching algorithm weights:', e);
    }
    return {
      interestMatch: 5,
      categoryMatch: 4,
      wishlistAffinity: 3,
      viewedAffinity: 3,
      highRating: 2,
      trending: 1
    };
  }

  /**
   * Get user context for recommendation scoring
   */
  getUserContext(userId) {
    let interests = ['Technology', 'Travel', 'Books'];

    if (userId) {
      const user = db.prepare('SELECT interests FROM users WHERE id = ?').get(userId);
      if (user && user.interests) {
        try {
          const parsed = JSON.parse(user.interests);
          if (Array.isArray(parsed) && parsed.length > 0) {
            interests = parsed;
          }
        } catch (e) {}
      }
    }

    // Viewed categories
    let viewedCats = [];
    let viewedIds = [];
    if (userId) {
      const activities = db.prepare(`
        SELECT DISTINCT target_id, category 
        FROM activities 
        WHERE user_id = ? AND target_type = 'product'
        ORDER BY timestamp DESC LIMIT 20
      `).all(userId);
      viewedCats = activities.map(a => a.category).filter(Boolean);
      viewedIds = activities.map(a => a.target_id);
    }

    // Wishlist categories
    let wishlistCats = [];
    let wishlistIds = [];
    if (userId) {
      const wishlistRows = db.prepare(`
        SELECT w.product_id, p.category 
        FROM wishlists w
        JOIN products p ON w.product_id = p.id
        WHERE w.user_id = ?
      `).all(userId);
      wishlistCats = wishlistRows.map(w => w.category).filter(Boolean);
      wishlistIds = wishlistRows.map(w => w.product_id);
    }

    return { interests, viewedCats, viewedIds, wishlistCats, wishlistIds };
  }

  /**
   * Score an individual product based on active weights and user signals
   */
  scoreProduct(product, context, weights) {
    const { interests, viewedCats, wishlistCats } = context;
    let score = 0;
    let explanation = "Popular product";

    // 1. Direct interest match
    const matchesInterest = interests.some(i => i.toLowerCase() === product.category.toLowerCase());
    if (matchesInterest) {
      score += weights.interestMatch;
      explanation = `Recommended because you like ${product.category}`;
    }

    // 2. Wishlist similarity
    const matchesWishlist = wishlistCats.some(c => c.toLowerCase() === product.category.toLowerCase());
    if (matchesWishlist) {
      score += weights.wishlistAffinity;
      if (!matchesInterest) {
        explanation = `Matches your wishlist in ${product.category}`;
      }
    }

    // 3. Recently viewed similarity
    const matchesViewed = viewedCats.some(c => c.toLowerCase() === product.category.toLowerCase());
    if (matchesViewed) {
      score += weights.viewedAffinity;
      if (!matchesInterest && !matchesWishlist) {
        explanation = `Similar to products you viewed`;
      }
    }

    // 4. Category alignment bonus (matches interest AND viewed)
    if (matchesInterest && matchesViewed) {
      score += weights.categoryMatch;
      explanation = `Highly aligned with your ${product.category} activity`;
    }

    // 5. High rating bonus (rating >= 4.5)
    if (product.rating >= 4.5) {
      score += weights.highRating;
      if (score <= weights.highRating) {
        explanation = `Top-rated choice (${product.rating}★)`;
      }
    }

    // 6. Trending flag
    if (product.is_trending || product.isTrending) {
      score += weights.trending;
      if (score <= weights.trending + weights.highRating) {
        explanation = `Trending in ${product.category}`;
      }
    }

    return { product, score, explanation };
  }

  formatProduct(row) {
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

  getAllProducts() {
    const rows = db.prepare('SELECT * FROM products').all();
    return rows.map(r => this.formatProduct(r));
  }

  /**
   * Get top scored personalized product recommendations
   */
  getTopRecommendations(userId, limit = 12) {
    const products = this.getAllProducts();
    const context = this.getUserContext(userId);
    const weights = this.getWeights();

    const scored = products.map(p => this.scoreProduct(p, context, weights));
    scored.sort((a, b) => b.score - a.score || b.product.rating - a.product.rating);
    return scored.slice(0, limit);
  }

  /**
   * Products matching user's declared interest tags
   */
  getByInterests(userId, limit = 4) {
    const products = this.getAllProducts();
    const { interests } = this.getUserContext(userId);

    const matched = products.filter(p =>
      interests.some(i => i.toLowerCase() === p.category.toLowerCase())
    );

    matched.sort((a, b) => b.rating - a.rating);
    return matched.slice(0, limit).map(p => ({
      product: p,
      explanation: `Matches your interest in ${p.category}`
    }));
  }

  /**
   * Products similar to items the user recently viewed
   */
  getSimilarToRecentlyViewed(userId, limit = 4) {
    const products = this.getAllProducts();
    const { viewedCats, viewedIds } = this.getUserContext(userId);

    if (viewedIds.length === 0) {
      return this.getTrendingProducts(limit);
    }

    const similar = products.filter(p =>
      !viewedIds.includes(p.id) && viewedCats.some(c => c.toLowerCase() === p.category.toLowerCase())
    );

    if (similar.length === 0) {
      return this.getTrendingProducts(limit);
    }

    similar.sort((a, b) => b.rating - a.rating);
    return similar.slice(0, limit).map(p => ({
      product: p,
      explanation: `Similar to products you recently browsed`
    }));
  }

  /**
   * Products complementary to items saved in wishlist
   */
  getSimilarToWishlist(userId, limit = 4) {
    const products = this.getAllProducts();
    const { wishlistCats, wishlistIds } = this.getUserContext(userId);

    if (wishlistIds.length === 0) {
      return this.getByInterests(userId, limit);
    }

    const similar = products.filter(p =>
      !wishlistIds.includes(p.id) && wishlistCats.some(c => c.toLowerCase() === p.category.toLowerCase())
    );

    if (similar.length === 0) {
      return this.getTopRecommendations(userId, limit);
    }

    similar.sort((a, b) => b.rating - a.rating);
    return similar.slice(0, limit).map(p => ({
      product: p,
      explanation: `Complements items in your wishlist`
    }));
  }

  /**
   * Trending products
   */
  getTrendingProducts(limit = 4) {
    const products = this.getAllProducts();
    const trending = products.filter(p => p.isTrending);
    const source = trending.length >= limit ? trending : products;

    return source.slice(0, limit).map(p => ({
      product: p,
      explanation: `Trending Now in ${p.category}`
    }));
  }

  /**
   * Related items for product details page
   */
  getRelatedProducts(category, excludeId, limit = 4) {
    const products = this.getAllProducts();
    const related = products.filter(p => p.category.toLowerCase() === category.toLowerCase() && p.id !== excludeId);
    if (related.length < limit) {
      const others = products.filter(p => p.id !== excludeId && !related.some(r => r.id === p.id));
      return [...related, ...others].slice(0, limit);
    }
    return related.slice(0, limit);
  }

  /**
   * Scored content recommendations
   */
  getRecommendedContent(userId, limit = 6) {
    const rows = db.prepare('SELECT * FROM contents').all();
    const { interests } = this.getUserContext(userId);

    let readIds = [];
    if (userId) {
      const reads = db.prepare(`
        SELECT target_id FROM activities 
        WHERE user_id = ? AND target_type = 'content'
      `).all(userId);
      readIds = reads.map(r => r.target_id);
    }

    const scored = rows.map(art => {
      let score = 0;
      let reason = "Popular Article";

      if (interests.some(i => i.toLowerCase() === art.category.toLowerCase())) {
        score += 5;
        reason = `Matches your interest in ${art.category}`;
      }
      if (readIds.includes(art.id)) {
        score += 1;
      }
      if (art.views > 3500) {
        score += 2;
        if (score <= 2) reason = "Trending Reader Favorite";
      }

      return {
        article: {
          id: art.id,
          title: art.title,
          category: art.category,
          author: art.author,
          date: art.date,
          readingTime: art.reading_time,
          views: art.views,
          rating: art.rating,
          image: art.image,
          summary: art.summary,
          body: art.body
        },
        score,
        reason
      };
    });

    scored.sort((a, b) => b.score - a.score || b.article.views - a.article.views);
    return scored.slice(0, limit);
  }
}

module.exports = new RecommendationService();

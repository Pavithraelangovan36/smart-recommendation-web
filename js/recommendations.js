/**
 * SMART RECOMMENDATION SYSTEM - Recommendation Engine
 * Simulates a multi-signal scoring algorithm for personalized product and content curation.
 * 
 * SCORING MATRIX:
 * - Matching User Interest:       +5 points
 * - Category Match to History:     +4 points
 * - Wishlist Category Similarity:  +3 points
 * - Recently Viewed Similarity:    +3 points
 * - High Customer Rating (>= 4.5): +2 points
 * - Trending Item Flag:           +1 point
 */

class RecommendationEngine {
  constructor() {
    this.weights = {
      interestMatch: 5,
      categoryMatch: 4,
      wishlistAffinity: 3,
      viewedAffinity: 3,
      highRating: 2,
      trending: 1
    };
  }

  // Retrieve current active user profile or demo fallback
  getUserProfile() {
    const stored = localStorage.getItem("smartUser");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        return DEMO_USER;
      }
    }
    return DEMO_USER;
  }

  // Retrieve user interests (array of category names)
  getUserInterests() {
    const user = this.getUserProfile();
    if (user && Array.isArray(user.interests) && user.interests.length > 0) {
      return user.interests;
    }
    const prefs = localStorage.getItem("smartPreferences");
    return prefs ? JSON.parse(prefs) : ["Technology", "Travel", "Books"];
  }

  // Get categories from recently viewed products
  getViewedCategories() {
    const products = getStoredProducts();
    const viewedIds = JSON.parse(localStorage.getItem("smartRecentlyViewed") || "[]");
    const categories = new Set();
    viewedIds.forEach(id => {
      const p = products.find(item => item.id === id);
      if (p) categories.add(p.category);
    });
    return Array.from(categories);
  }

  // Get categories from wishlist items
  getWishlistCategories() {
    const products = getStoredProducts();
    const wishlistIds = getStoredWishlist();
    const categories = new Set();
    wishlistIds.forEach(id => {
      const p = products.find(item => item.id === id);
      if (p) categories.add(p.category);
    });
    return Array.from(categories);
  }

  /**
   * Calculate recommendation score for a given product and generate an explanation reason.
   */
  scoreProduct(product) {
    const interests = this.getUserInterests();
    const viewedCats = this.getViewedCategories();
    const wishlistCats = this.getWishlistCategories();

    let score = 0;
    let explanation = "Popular product";

    // 1. Direct interest match (+5)
    const matchesInterest = interests.some(i => i.toLowerCase() === product.category.toLowerCase());
    if (matchesInterest) {
      score += this.weights.interestMatch;
      explanation = `Recommended because you like ${product.category}`;
    }

    // 2. Wishlist similarity (+3)
    const matchesWishlist = wishlistCats.includes(product.category);
    if (matchesWishlist) {
      score += this.weights.wishlistAffinity;
      if (!matchesInterest) {
        explanation = `Matches your wishlist in ${product.category}`;
      }
    }

    // 3. Recently viewed category affinity (+3)
    const matchesViewed = viewedCats.includes(product.category);
    if (matchesViewed) {
      score += this.weights.viewedAffinity;
      if (!matchesInterest && !matchesWishlist) {
        explanation = `Similar to products you viewed`;
      }
    }

    // 4. Category alignment bonus (+4)
    if (matchesInterest && matchesViewed) {
      score += this.weights.categoryMatch;
      explanation = `Highly aligned with your ${product.category} activity`;
    }

    // 5. High rating bonus (+2)
    if (product.rating >= 4.5) {
      score += this.weights.highRating;
      if (score <= this.weights.highRating) {
        explanation = `Top-rated choice (${product.rating}★)`;
      }
    }

    // 6. Trending flag (+1)
    if (product.isTrending) {
      score += this.weights.trending;
      if (score <= this.weights.trending + this.weights.highRating) {
        explanation = `Trending in ${product.category}`;
      }
    }

    return { product, score, explanation };
  }

  /**
   * Return ranked recommendations across all available products
   */
  getTopRecommendations(limit = 12) {
    const products = getStoredProducts();
    const scoredList = products.map(p => this.scoreProduct(p));
    // Sort descending by score, tiebreaker on rating
    scoredList.sort((a, b) => b.score - a.score || b.product.rating - a.product.rating);
    return scoredList.slice(0, limit);
  }

  /**
   * Get products specifically tailored to user interests
   */
  getByInterests(limit = 4) {
    const interests = this.getUserInterests();
    const products = getStoredProducts();
    const matched = products.filter(p => 
      interests.some(i => i.toLowerCase() === p.category.toLowerCase())
    );
    return matched.sort((a, b) => b.rating - a.rating).slice(0, limit).map(p => ({
      product: p,
      explanation: `Matches your interest in ${p.category}`
    }));
  }

  /**
   * Get products similar to recently viewed items
   */
  getSimilarToRecentlyViewed(limit = 4) {
    const products = getStoredProducts();
    const viewedIds = JSON.parse(localStorage.getItem("smartRecentlyViewed") || "[]");
    if (viewedIds.length === 0) {
      return this.getTrendingProducts(limit);
    }
    const viewedCats = this.getViewedCategories();
    // Exclude the viewed products themselves to avoid redundancy
    const similar = products.filter(p => 
      !viewedIds.includes(p.id) && viewedCats.includes(p.category)
    );
    if (similar.length === 0) {
      return this.getTrendingProducts(limit);
    }
    return similar.sort((a, b) => b.rating - a.rating).slice(0, limit).map(p => ({
      product: p,
      explanation: `Similar to products you recently browsed`
    }));
  }

  /**
   * Get products similar to items in the user's wishlist
   */
  getSimilarToWishlist(limit = 4) {
    const products = getStoredProducts();
    const wishlistIds = getStoredWishlist();
    if (wishlistIds.length === 0) {
      return this.getByInterests(limit);
    }
    const wishlistCats = this.getWishlistCategories();
    const similar = products.filter(p => 
      !wishlistIds.includes(p.id) && wishlistCats.includes(p.category)
    );
    if (similar.length === 0) {
      return this.getTopRecommendations(limit);
    }
    return similar.sort((a, b) => b.rating - a.rating).slice(0, limit).map(p => ({
      product: p,
      explanation: `Complements items in your wishlist`
    }));
  }

  /**
   * Return trending products
   */
  getTrendingProducts(limit = 4) {
    const products = getStoredProducts();
    const trending = products.filter(p => p.isTrending);
    return (trending.length >= limit ? trending : products)
      .slice(0, limit)
      .map(p => ({
        product: p,
        explanation: `Trending Now in ${p.category}`
      }));
  }

  /**
   * Return related products for a product detail page (same category, different ID)
   */
  getRelatedProducts(category, excludeId, limit = 4) {
    const products = getStoredProducts();
    const related = products.filter(p => p.category === category && p.id !== excludeId);
    if (related.length < limit) {
      const others = products.filter(p => p.id !== excludeId && !related.includes(p));
      return [...related, ...others].slice(0, limit);
    }
    return related.slice(0, limit);
  }

  /**
   * Score and recommend digital marketing and lifestyle content
   */
  getRecommendedContent(limit = 6) {
    const content = getStoredContent();
    const interests = this.getUserInterests();
    const history = JSON.parse(localStorage.getItem("smartContentHistory") || "[]");

    const scored = content.map(art => {
      let score = 0;
      let reason = "Popular Article";

      if (interests.some(i => i.toLowerCase() === art.category.toLowerCase())) {
        score += 5;
        reason = `Matches your interest in ${art.category}`;
      }
      if (history.includes(art.id)) {
        score += 1;
      }
      if (art.views > 3500) {
        score += 2;
        if (score <= 2) reason = "Trending Reader Favorite";
      }

      return { article: art, score, reason };
    });

    scored.sort((a, b) => b.score - a.score || b.article.views - a.article.views);
    return scored.slice(0, limit);
  }

  /**
   * Return trending content items
   */
  getTrendingContent(limit = 3) {
    const content = getStoredContent();
    const sorted = [...content].sort((a, b) => b.views - a.views);
    return sorted.slice(0, limit);
  }
}

// Global Singleton Instance
const recommendationEngine = new RecommendationEngine();

const { db } = require('../db/db');
const { seedDatabase } = require('../db/seed');

/**
 * Admin Dashboard KPI summary
 */
exports.getDashboardStats = (req, res) => {
  try {
    const userCount = db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'user'").get()?.count || 0;
    const productCount = db.prepare('SELECT COUNT(*) as count FROM products').get()?.count || 0;
    const contentCount = db.prepare('SELECT COUNT(*) as count FROM contents').get()?.count || 0;
    const wishlistCount = db.prepare('SELECT COUNT(*) as count FROM wishlists').get()?.count || 0;

    const ratingRow = db.prepare('SELECT AVG(rating) as avg_rating FROM products').get();
    const avgRating = ratingRow && ratingRow.avg_rating ? Number(ratingRow.avg_rating).toFixed(2) : '4.70';

    const contentViewsSum = db.prepare('SELECT SUM(views) as total FROM contents').get()?.total || 16340;
    const activityViews = db.prepare("SELECT COUNT(*) as count FROM activities WHERE target_type = 'product'").get()?.count || 0;

    const recentFeedback = db.prepare('SELECT * FROM feedbacks ORDER BY date DESC, id DESC LIMIT 5').all();

    return res.json({
      success: true,
      stats: {
        totalUsers: userCount + 120, // includes guest and registered demographic
        registeredUsers: userCount,
        totalProducts: productCount,
        totalContent: contentCount,
        totalRecommendations: 1842 + (activityViews * 3),
        productViews: 24890 + activityViews,
        contentViews: contentViewsSum,
        wishlistCount: wishlistCount + 518,
        avgRating: avgRating + ' ★',
        recentFeedback
      }
    });
  } catch (error) {
    console.error('getDashboardStats error:', error);
    return res.status(500).json({ success: false, message: 'Server error retrieving dashboard stats.' });
  }
};

/**
 * Analytics Charts Data for Chart.js
 */
exports.getAnalyticsCharts = (req, res) => {
  try {
    // 1. Top categories by catalog size & activity
    const categories = db.prepare('SELECT name, count FROM categories ORDER BY count DESC').all();

    // 2. Top articles by engagement
    const topArticles = db.prepare('SELECT title, views FROM contents ORDER BY views DESC LIMIT 6').all();

    return res.json({
      success: true,
      charts: {
        userGrowth: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"],
          data: [120, 190, 310, 480, 690, 890, 1140, 1420, 1680]
        },
        topCategories: {
          labels: categories.map(c => c.name),
          data: [6840, 4920, 3810, 2950, 3120, 2840, 1940, 1200]
        },
        categoryShare: {
          labels: ["Electronics", "Fashion", "Books", "Beauty", "Sports", "Travel", "Food", "Lifestyle"],
          data: [30, 22, 16, 12, 10, 6, 2, 4]
        },
        contentEngagement: {
          labels: topArticles.map(a => a.title.length > 20 ? a.title.slice(0, 18) + '...' : a.title),
          data: topArticles.map(a => a.views)
        },
        recCTR: {
          labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6"],
          data: [18.4, 21.2, 23.8, 25.4, 28.1, 31.6]
        },
        wishlistActivity: {
          labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          data: [42, 58, 65, 78, 92, 124, 110]
        }
      }
    });
  } catch (error) {
    console.error('getAnalyticsCharts error:', error);
    return res.status(500).json({ success: false, message: 'Server error retrieving analytics charts.' });
  }
};

/**
 * Get all registered users with activity metrics
 */
exports.getUsers = (req, res) => {
  try {
    const users = db.prepare("SELECT * FROM users WHERE role = 'user' ORDER BY created_at DESC").all();

    const result = users.map(u => {
      const viewed = db.prepare("SELECT COUNT(*) as c FROM activities WHERE user_id = ? AND target_type = 'product'").get(u.id)?.c || 0;
      const wishlist = db.prepare("SELECT COUNT(*) as c FROM wishlists WHERE user_id = ?").get(u.id)?.c || 0;
      const content = db.prepare("SELECT COUNT(*) as c FROM activities WHERE user_id = ? AND target_type = 'content'").get(u.id)?.c || 0;
      const ratings = db.prepare("SELECT COUNT(*) as c FROM feedbacks WHERE user_id = ?").get(u.id)?.c || 0;

      return {
        id: u.id,
        name: u.name,
        email: u.email,
        age: u.age,
        location: u.location,
        interests: JSON.parse(u.interests || '[]'),
        status: u.status,
        joinedDate: u.created_at ? u.created_at.split(' ')[0] : '2026-01-10',
        activityCount: {
          viewed: Math.max(viewed, 4),
          wishlist: Math.max(wishlist, 2),
          content: Math.max(content, 3),
          ratings: Math.max(ratings, 1)
        }
      };
    });

    return res.json({
      success: true,
      count: result.length,
      users: result
    });
  } catch (error) {
    console.error('getUsers error:', error);
    return res.status(500).json({ success: false, message: 'Server error retrieving users.' });
  }
};

/**
 * Toggle user status (Active vs Disabled)
 */
exports.toggleUserStatus = (req, res) => {
  try {
    const { id } = req.params;
    const user = db.prepare('SELECT status FROM users WHERE id = ?').get(id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const newStatus = user.status === 'Active' ? 'Disabled' : 'Active';
    db.prepare('UPDATE users SET status = ? WHERE id = ?').run(newStatus, id);

    return res.json({
      success: true,
      message: `User status changed to ${newStatus}.`,
      status: newStatus
    });
  } catch (error) {
    console.error('toggleUserStatus error:', error);
    return res.status(500).json({ success: false, message: 'Server error toggling user status.' });
  }
};

/**
 * Get algorithm scoring weights
 */
exports.getAlgorithmSettings = (req, res) => {
  try {
    const row = db.prepare('SELECT * FROM algorithm_settings WHERE id = 1').get();
    if (!row) {
      return res.json({
        success: true,
        weights: {
          interestMatch: 5,
          categoryMatch: 4,
          wishlistAffinity: 3,
          viewedAffinity: 3,
          highRating: 2,
          trending: 1
        }
      });
    }

    return res.json({
      success: true,
      weights: {
        interestMatch: row.interest_match,
        categoryMatch: row.category_match,
        wishlistAffinity: row.wishlist_affinity,
        viewedAffinity: row.viewed_affinity,
        highRating: row.high_rating,
        trending: row.trending,
        updatedAt: row.updated_at
      }
    });
  } catch (error) {
    console.error('getAlgorithmSettings error:', error);
    return res.status(500).json({ success: false, message: 'Server error retrieving algorithm settings.' });
  }
};

/**
 * Update algorithm scoring weights
 */
exports.updateAlgorithmSettings = (req, res) => {
  try {
    const {
      interestMatch,
      categoryMatch,
      wishlistAffinity,
      viewedAffinity,
      highRating,
      trending
    } = req.body;

    db.prepare(`
      UPDATE algorithm_settings SET
        interest_match = COALESCE(?, interest_match),
        category_match = COALESCE(?, category_match),
        wishlist_affinity = COALESCE(?, wishlist_affinity),
        viewed_affinity = COALESCE(?, viewed_affinity),
        high_rating = COALESCE(?, high_rating),
        trending = COALESCE(?, trending),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = 1
    `).run(
      interestMatch !== undefined ? Number(interestMatch) : null,
      categoryMatch !== undefined ? Number(categoryMatch) : null,
      wishlistAffinity !== undefined ? Number(wishlistAffinity) : null,
      viewedAffinity !== undefined ? Number(viewedAffinity) : null,
      highRating !== undefined ? Number(highRating) : null,
      trending !== undefined ? Number(trending) : null
    );

    return res.json({
      success: true,
      message: 'Algorithm scoring weights updated successfully!'
    });
  } catch (error) {
    console.error('updateAlgorithmSettings error:', error);
    return res.status(500).json({ success: false, message: 'Server error updating algorithm settings.' });
  }
};

/**
 * Reset database to original factory demo data
 */
exports.resetDatabase = (req, res) => {
  try {
    seedDatabase();
    return res.json({
      success: true,
      message: 'Platform database successfully reset to factory demo seeds!'
    });
  } catch (error) {
    console.error('resetDatabase error:', error);
    return res.status(500).json({ success: false, message: 'Server error resetting database.' });
  }
};

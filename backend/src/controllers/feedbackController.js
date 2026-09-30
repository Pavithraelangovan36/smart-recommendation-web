const { db } = require('../db/db');

/**
 * Submit rating and review feedback
 */
exports.submitFeedback = (req, res) => {
  try {
    const { targetType, targetId, targetName, rating, comment } = req.body;

    if (!targetType || !rating) {
      return res.status(400).json({ success: false, message: 'targetType and rating are required.' });
    }

    const id = 'fb-' + Date.now();
    const date = new Date().toISOString().split('T')[0];
    const userId = req.user ? req.user.id : 'guest';
    const userName = req.user ? req.user.name : (req.body.userName || 'Anonymous Shopper');
    const userEmail = req.user ? req.user.email : (req.body.userEmail || 'guest@smartrecommend.com');

    db.prepare(`
      INSERT INTO feedbacks (id, user_id, user_name, user_email, target_type, target_id, target_name, rating, comment, date, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'New')
    `).run(
      id,
      userId,
      userName,
      userEmail,
      targetType,
      targetId || '',
      targetName || (targetType === 'product' ? 'Product Review' : 'Article Review'),
      Number(rating),
      comment || '',
      date
    );

    // If target is a product, recalculate its average rating and increment review count
    if (targetType === 'product' && targetId) {
      const stats = db.prepare(`
        SELECT AVG(rating) as avg_rating, COUNT(*) as cnt 
        FROM feedbacks 
        WHERE target_id = ?
      `).get(targetId);

      if (stats && stats.cnt > 0) {
        db.prepare(`
          UPDATE products 
          SET rating = ROUND(?, 1), reviews_count = reviews_count + 1
          WHERE id = ?
        `).run(stats.avg_rating, targetId);
      }
    }

    // If target is content, recalculate article rating
    if (targetType === 'content' && targetId) {
      const stats = db.prepare(`
        SELECT AVG(rating) as avg_rating 
        FROM feedbacks 
        WHERE target_id = ?
      `).get(targetId);

      if (stats && stats.avg_rating) {
        db.prepare('UPDATE contents SET rating = ROUND(?, 1) WHERE id = ?').run(stats.avg_rating, targetId);
      }
    }

    const created = db.prepare('SELECT * FROM feedbacks WHERE id = ?').get(id);

    return res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully! Thank you for reviewing.',
      feedback: created
    });
  } catch (error) {
    console.error('submitFeedback error:', error);
    return res.status(500).json({ success: false, message: 'Server error submitting feedback.' });
  }
};

/**
 * Get feedback list
 */
exports.getFeedbackList = (req, res) => {
  try {
    const { targetId, targetType, status, limit = 20 } = req.query;

    let query = 'SELECT * FROM feedbacks WHERE 1=1';
    const params = [];

    if (targetId) {
      query += ' AND target_id = ?';
      params.push(targetId);
    }

    if (targetType) {
      query += ' AND target_type = ?';
      params.push(targetType);
    }

    if (status && status !== 'All') {
      query += ' AND status = ?';
      params.push(status);
    }

    query += ' ORDER BY date DESC, id DESC LIMIT ?';
    params.push(Number(limit));

    const rows = db.prepare(query).all(...params);
    return res.json({
      success: true,
      count: rows.length,
      feedback: rows
    });
  } catch (error) {
    console.error('getFeedbackList error:', error);
    return res.status(500).json({ success: false, message: 'Server error retrieving feedback.' });
  }
};

/**
 * Admin: Update feedback status
 */
exports.updateStatus = (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['New', 'Reviewed', 'Resolved'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Status must be New, Reviewed, or Resolved.' });
    }

    db.prepare('UPDATE feedbacks SET status = ? WHERE id = ?').run(status, id);
    const updated = db.prepare('SELECT * FROM feedbacks WHERE id = ?').get(id);

    return res.json({
      success: true,
      message: `Feedback status updated to ${status}.`,
      feedback: updated
    });
  } catch (error) {
    console.error('updateStatus error:', error);
    return res.status(500).json({ success: false, message: 'Server error updating feedback status.' });
  }
};

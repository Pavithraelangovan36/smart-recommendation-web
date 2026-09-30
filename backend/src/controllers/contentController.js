const { db } = require('../db/db');

function formatContent(row) {
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    author: row.author,
    date: row.date,
    readingTime: row.reading_time,
    views: row.views,
    rating: row.rating,
    image: row.image,
    summary: row.summary,
    body: row.body
  };
}

/**
 * Get content articles list with search & category filter
 */
exports.getContentList = (req, res) => {
  try {
    const { category, search, page = 1, limit = 9 } = req.query;

    let query = 'SELECT * FROM contents WHERE 1=1';
    const params = [];

    if (category && category !== 'All' && category !== 'all') {
      query += ' AND LOWER(category) = LOWER(?)';
      params.push(category);
    }

    if (search && search.trim()) {
      const term = `%${search.trim().toLowerCase()}%`;
      query += ' AND (LOWER(title) LIKE ? OR LOWER(summary) LIKE ? OR LOWER(category) LIKE ? OR LOWER(author) LIKE ?)';
      params.push(term, term, term, term);
    }

    query += ' ORDER BY views DESC, date DESC';

    const allRows = db.prepare(query).all(...params);
    const total = allRows.length;
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Number(limit));
    const totalPages = Math.ceil(total / limitNum) || 1;

    const startIndex = (pageNum - 1) * limitNum;
    const paginated = allRows.slice(startIndex, startIndex + limitNum).map(formatContent);

    return res.json({
      success: true,
      total,
      page: pageNum,
      totalPages,
      limit: limitNum,
      articles: paginated
    });
  } catch (error) {
    console.error('getContentList error:', error);
    return res.status(500).json({ success: false, message: 'Server error retrieving articles.' });
  }
};

/**
 * Get single article by ID and increment view count
 */
exports.getContentById = (req, res) => {
  try {
    const { id } = req.params;

    // Increment views
    db.prepare('UPDATE contents SET views = views + 1 WHERE id = ?').run(id);

    const row = db.prepare('SELECT * FROM contents WHERE id = ?').get(id);
    if (!row) {
      return res.status(404).json({ success: false, message: 'Article not found.' });
    }

    const article = formatContent(row);

    // Track activity if logged in
    if (req.user && req.user.id) {
      try {
        db.prepare(`
          INSERT INTO activities (user_id, target_type, target_id, category)
          VALUES (?, 'content', ?, ?)
        `).run(req.user.id, article.id, article.category);
      } catch (e) {}
    }

    return res.json({
      success: true,
      article
    });
  } catch (error) {
    console.error('getContentById error:', error);
    return res.status(500).json({ success: false, message: 'Server error retrieving article.' });
  }
};

/**
 * Admin: Create article
 */
exports.createContent = (req, res) => {
  try {
    const { title, category, author, readingTime, image, summary, body } = req.body;

    if (!title || !category || !author) {
      return res.status(400).json({ success: false, message: 'Title, category, and author are required.' });
    }

    const id = 'art-' + Date.now();
    const date = new Date().toISOString().split('T')[0];

    db.prepare(`
      INSERT INTO contents (id, title, category, author, date, reading_time, views, rating, image, summary, body)
      VALUES (?, ?, ?, ?, ?, ?, 0, 5.0, ?, ?, ?)
    `).run(
      id,
      title.trim(),
      category.trim(),
      author.trim(),
      date,
      readingTime || '5 min read',
      image || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
      summary || '',
      body || ''
    );

    const created = db.prepare('SELECT * FROM contents WHERE id = ?').get(id);
    return res.status(201).json({
      success: true,
      message: 'Article published successfully!',
      article: formatContent(created)
    });
  } catch (error) {
    console.error('createContent error:', error);
    return res.status(500).json({ success: false, message: 'Server error creating article.' });
  }
};

/**
 * Admin: Update article
 */
exports.updateContent = (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.prepare('SELECT * FROM contents WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Article not found.' });
    }

    const { title, category, author, readingTime, image, summary, body } = req.body;

    db.prepare(`
      UPDATE contents SET
        title = COALESCE(?, title),
        category = COALESCE(?, category),
        author = COALESCE(?, author),
        reading_time = COALESCE(?, reading_time),
        image = COALESCE(?, image),
        summary = COALESCE(?, summary),
        body = COALESCE(?, body)
      WHERE id = ?
    `).run(
      title ? title.trim() : null,
      category ? category.trim() : null,
      author ? author.trim() : null,
      readingTime || null,
      image || null,
      summary !== undefined ? summary : null,
      body !== undefined ? body : null,
      id
    );

    const updated = db.prepare('SELECT * FROM contents WHERE id = ?').get(id);
    return res.json({
      success: true,
      message: 'Article updated successfully!',
      article: formatContent(updated)
    });
  } catch (error) {
    console.error('updateContent error:', error);
    return res.status(500).json({ success: false, message: 'Server error updating article.' });
  }
};

/**
 * Admin: Delete article
 */
exports.deleteContent = (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.prepare('SELECT * FROM contents WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Article not found.' });
    }

    db.prepare('DELETE FROM contents WHERE id = ?').run(id);
    return res.json({
      success: true,
      message: 'Article deleted successfully.'
    });
  } catch (error) {
    console.error('deleteContent error:', error);
    return res.status(500).json({ success: false, message: 'Server error deleting article.' });
  }
};

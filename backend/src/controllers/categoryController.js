const { db } = require('../db/db');

/**
 * Get all categories with updated product counts
 */
exports.getCategories = (req, res) => {
  try {
    const categories = db.prepare('SELECT * FROM categories ORDER BY name ASC').all();

    // Calculate live product count for each category
    const countMap = {};
    const counts = db.prepare(`
      SELECT category, COUNT(*) as count 
      FROM products 
      GROUP BY category
    `).all();

    counts.forEach(row => {
      countMap[row.category.toLowerCase()] = row.count;
    });

    const result = categories.map(cat => ({
      id: cat.id,
      name: cat.name,
      icon: cat.icon,
      description: cat.description,
      count: countMap[cat.name.toLowerCase()] || 0
    }));

    return res.json({
      success: true,
      categories: result
    });
  } catch (error) {
    console.error('getCategories error:', error);
    return res.status(500).json({ success: false, message: 'Server error retrieving categories.' });
  }
};

/**
 * Admin: Create category
 */
exports.createCategory = (req, res) => {
  try {
    const { name, icon, description } = req.body;
    if (!name || !icon) {
      return res.status(400).json({ success: false, message: 'Name and icon class are required.' });
    }

    const cleanName = name.trim();
    const existing = db.prepare('SELECT id FROM categories WHERE LOWER(name) = LOWER(?)').get(cleanName);
    if (existing) {
      return res.status(409).json({ success: false, message: 'Category with this name already exists.' });
    }

    const id = 'cat-' + Date.now();
    db.prepare(`
      INSERT INTO categories (id, name, icon, description, count)
      VALUES (?, ?, ?, ?, 0)
    `).run(id, cleanName, icon.trim(), description || '');

    const created = db.prepare('SELECT * FROM categories WHERE id = ?').get(id);
    return res.status(201).json({
      success: true,
      message: 'Category created successfully!',
      category: created
    });
  } catch (error) {
    console.error('createCategory error:', error);
    return res.status(500).json({ success: false, message: 'Server error creating category.' });
  }
};

/**
 * Admin: Update category
 */
exports.updateCategory = (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.prepare('SELECT * FROM categories WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }

    const { name, icon, description } = req.body;
    db.prepare(`
      UPDATE categories SET
        name = COALESCE(?, name),
        icon = COALESCE(?, icon),
        description = COALESCE(?, description)
      WHERE id = ?
    `).run(name ? name.trim() : null, icon ? icon.trim() : null, description !== undefined ? description : null, id);

    const updated = db.prepare('SELECT * FROM categories WHERE id = ?').get(id);
    return res.json({
      success: true,
      message: 'Category updated successfully!',
      category: updated
    });
  } catch (error) {
    console.error('updateCategory error:', error);
    return res.status(500).json({ success: false, message: 'Server error updating category.' });
  }
};

/**
 * Admin: Delete category
 */
exports.deleteCategory = (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.prepare('SELECT * FROM categories WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }

    db.prepare('DELETE FROM categories WHERE id = ?').run(id);
    return res.json({
      success: true,
      message: 'Category deleted successfully.'
    });
  } catch (error) {
    console.error('deleteCategory error:', error);
    return res.status(500).json({ success: false, message: 'Server error deleting category.' });
  }
};

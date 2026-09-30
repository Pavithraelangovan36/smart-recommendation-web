const { db } = require('../db/db');
const recommendationService = require('../services/recommendationService');

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
 * Get products catalog with faceted filters, search, sorting and pagination
 */
exports.getProducts = (req, res) => {
  try {
    const {
      category,
      minPrice,
      maxPrice,
      minRating,
      search,
      sort,
      isTrending,
      isFeatured,
      page = 1,
      limit = 12
    } = req.query;

    let query = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    if (category && category !== 'All' && category !== 'all') {
      query += ' AND LOWER(category) = LOWER(?)';
      params.push(category);
    }

    if (minPrice) {
      query += ' AND price >= ?';
      params.push(Number(minPrice));
    }

    if (maxPrice) {
      query += ' AND price <= ?';
      params.push(Number(maxPrice));
    }

    if (minRating) {
      query += ' AND rating >= ?';
      params.push(Number(minRating));
    }

    if (isTrending === 'true' || isTrending === '1') {
      query += ' AND is_trending = 1';
    }

    if (isFeatured === 'true' || isFeatured === '1') {
      query += ' AND is_featured = 1';
    }

    if (search && search.trim()) {
      const term = `%${search.trim().toLowerCase()}%`;
      query += ' AND (LOWER(name) LIKE ? OR LOWER(brand) LIKE ? OR LOWER(description) LIKE ? OR LOWER(category) LIKE ?)';
      params.push(term, term, term, term);
    }

    // Sorting
    switch (sort) {
      case 'price_asc':
        query += ' ORDER BY price ASC';
        break;
      case 'price_desc':
        query += ' ORDER BY price DESC';
        break;
      case 'rating':
        query += ' ORDER BY rating DESC, reviews_count DESC';
        break;
      case 'newest':
        query += ' ORDER BY date_added DESC, id DESC';
        break;
      case 'popular':
        query += ' ORDER BY reviews_count DESC, rating DESC';
        break;
      default:
        query += ' ORDER BY is_featured DESC, rating DESC';
    }

    const allRows = db.prepare(query).all(...params);
    const total = allRows.length;
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Number(limit));
    const totalPages = Math.ceil(total / limitNum) || 1;

    const startIndex = (pageNum - 1) * limitNum;
    const paginated = allRows.slice(startIndex, startIndex + limitNum).map(formatProduct);

    return res.json({
      success: true,
      total,
      page: pageNum,
      totalPages,
      limit: limitNum,
      products: paginated
    });
  } catch (error) {
    console.error('getProducts error:', error);
    return res.status(500).json({ success: false, message: 'Server error retrieving products.' });
  }
};

/**
 * Get product by ID
 */
exports.getProductById = (req, res) => {
  try {
    const { id } = req.params;
    const row = db.prepare('SELECT * FROM products WHERE id = ?').get(id);

    if (!row) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    const product = formatProduct(row);

    // Auto log browsing activity if user is authenticated
    if (req.user && req.user.id) {
      try {
        db.prepare(`
          INSERT INTO activities (user_id, target_type, target_id, category)
          VALUES (?, 'product', ?, ?)
        `).run(req.user.id, product.id, product.category);
      } catch (e) {}
    }

    return res.json({
      success: true,
      product
    });
  } catch (error) {
    console.error('getProductById error:', error);
    return res.status(500).json({ success: false, message: 'Server error retrieving product.' });
  }
};

/**
 * Get related products for detail page
 */
exports.getRelatedProducts = (req, res) => {
  try {
    const { id } = req.params;
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    const related = recommendationService.getRelatedProducts(product.category, product.id, 4);
    return res.json({
      success: true,
      related
    });
  } catch (error) {
    console.error('getRelatedProducts error:', error);
    return res.status(500).json({ success: false, message: 'Server error retrieving related products.' });
  }
};

/**
 * Admin: Create a new product
 */
exports.createProduct = (req, res) => {
  try {
    const {
      name, brand, category, price, originalPrice, discount,
      rating, isTrending, isFeatured, image, gallery, description, features, inStock
    } = req.body;

    if (!name || !brand || !category || price === undefined || !image) {
      return res.status(400).json({ success: false, message: 'Name, brand, category, price, and image are required.' });
    }

    const id = 'prod-' + Date.now();
    const dateAdded = new Date().toISOString().split('T')[0];

    db.prepare(`
      INSERT INTO products (
        id, name, brand, category, price, original_price, discount,
        rating, reviews_count, is_trending, is_featured, image, gallery,
        description, features, in_stock, date_added
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      name.trim(),
      brand.trim(),
      category.trim(),
      Number(price),
      originalPrice ? Number(originalPrice) : Number(price),
      discount ? Number(discount) : 0,
      rating ? Number(rating) : 5.0,
      0,
      isTrending ? 1 : 0,
      isFeatured ? 1 : 0,
      image,
      JSON.stringify(Array.isArray(gallery) ? gallery : [image]),
      description || '',
      JSON.stringify(Array.isArray(features) ? features : []),
      inStock !== false ? 1 : 0,
      dateAdded
    );

    // Increment category count
    db.prepare("UPDATE categories SET count = count + 1 WHERE LOWER(name) = LOWER(?)").run(category.trim());

    const created = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
    return res.status(201).json({
      success: true,
      message: 'Product created successfully!',
      product: formatProduct(created)
    });
  } catch (error) {
    console.error('createProduct error:', error);
    return res.status(500).json({ success: false, message: 'Server error creating product.' });
  }
};

/**
 * Admin: Update existing product
 */
exports.updateProduct = (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(id);

    if (!existing) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    const {
      name, brand, category, price, originalPrice, discount,
      rating, isTrending, isFeatured, image, gallery, description, features, inStock
    } = req.body;

    db.prepare(`
      UPDATE products SET
        name = COALESCE(?, name),
        brand = COALESCE(?, brand),
        category = COALESCE(?, category),
        price = COALESCE(?, price),
        original_price = COALESCE(?, original_price),
        discount = COALESCE(?, discount),
        rating = COALESCE(?, rating),
        is_trending = COALESCE(?, is_trending),
        is_featured = COALESCE(?, is_featured),
        image = COALESCE(?, image),
        gallery = COALESCE(?, gallery),
        description = COALESCE(?, description),
        features = COALESCE(?, features),
        in_stock = COALESCE(?, in_stock)
      WHERE id = ?
    `).run(
      name ? name.trim() : null,
      brand ? brand.trim() : null,
      category ? category.trim() : null,
      price !== undefined ? Number(price) : null,
      originalPrice !== undefined ? Number(originalPrice) : null,
      discount !== undefined ? Number(discount) : null,
      rating !== undefined ? Number(rating) : null,
      isTrending !== undefined ? (isTrending ? 1 : 0) : null,
      isFeatured !== undefined ? (isFeatured ? 1 : 0) : null,
      image || null,
      gallery ? JSON.stringify(gallery) : null,
      description !== undefined ? description : null,
      features ? JSON.stringify(features) : null,
      inStock !== undefined ? (inStock ? 1 : 0) : null,
      id
    );

    const updated = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
    return res.json({
      success: true,
      message: 'Product updated successfully!',
      product: formatProduct(updated)
    });
  } catch (error) {
    console.error('updateProduct error:', error);
    return res.status(500).json({ success: false, message: 'Server error updating product.' });
  }
};

/**
 * Admin: Delete product
 */
exports.deleteProduct = (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(id);

    if (!existing) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    db.prepare('DELETE FROM wishlists WHERE product_id = ?').run(id);
    db.prepare('DELETE FROM products WHERE id = ?').run(id);
    db.prepare("UPDATE categories SET count = MAX(0, count - 1) WHERE LOWER(name) = LOWER(?)").run(existing.category);

    return res.json({
      success: true,
      message: 'Product deleted successfully.'
    });
  } catch (error) {
    console.error('deleteProduct error:', error);
    return res.status(500).json({ success: false, message: 'Server error deleting product.' });
  }
};

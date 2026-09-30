const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { db, initSchema } = require('./db');

function loadFrontendSeeds() {
  const dataJsPath = path.join(__dirname, '..', '..', '..', 'js', 'data.js');
  const code = fs.readFileSync(dataJsPath, 'utf8');
  const fn = new Function('localStorage', code + '; return { SEED_PRODUCTS, SEED_CONTENT, SEED_CATEGORIES, DEMO_USER, DEMO_ADMIN, SEED_FEEDBACK, SEED_USERS };');
  return fn({ getItem: () => null, setItem: () => {} });
}

function seedDatabase() {
  console.log('--- Starting Database Seeding ---');
  initSchema();

  const {
    SEED_PRODUCTS,
    SEED_CONTENT,
    SEED_CATEGORIES,
    DEMO_USER,
    DEMO_ADMIN,
    SEED_FEEDBACK,
    SEED_USERS
  } = loadFrontendSeeds();

  // Clear existing records
  db.exec(`
    DELETE FROM wishlists;
    DELETE FROM activities;
    DELETE FROM feedbacks;
    DELETE FROM algorithm_settings;
    DELETE FROM contents;
    DELETE FROM products;
    DELETE FROM categories;
    DELETE FROM users;
  `);

  const passwordHashAlex = bcrypt.hashSync('alex123', 10);
  const passwordHashAdmin = bcrypt.hashSync('admin123', 10);
  const passwordHashDefault = bcrypt.hashSync('password123', 10);

  // 1. Insert Users
  const insertUser = db.prepare(`
    INSERT INTO users (id, name, email, password_hash, age, location, interests, role, status, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  // Demo User
  insertUser.run(
    DEMO_USER.id,
    DEMO_USER.name,
    DEMO_USER.email.toLowerCase(),
    passwordHashAlex,
    DEMO_USER.age || 26,
    DEMO_USER.location || 'Bangalore, India',
    JSON.stringify(DEMO_USER.interests || ["Technology", "Travel", "Books"]),
    'user',
    DEMO_USER.status || 'Active',
    DEMO_USER.joinedDate || '2026-01-10'
  );

  // Admin User
  insertUser.run(
    DEMO_ADMIN.id,
    DEMO_ADMIN.name,
    DEMO_ADMIN.email.toLowerCase(),
    passwordHashAdmin,
    35,
    'Corporate HQ',
    JSON.stringify(['Technology', 'Analytics']),
    'admin',
    'Active',
    '2026-01-01'
  );

  // Additional Seed Users
  for (const u of SEED_USERS) {
    if (u.email.toLowerCase() !== DEMO_USER.email.toLowerCase()) {
      insertUser.run(
        u.id,
        u.name,
        u.email.toLowerCase(),
        passwordHashDefault,
        25,
        'India',
        JSON.stringify(u.interests || []),
        'user',
        u.status || 'Active',
        u.joinedDate || '2026-01-15'
      );
    }
  }
  console.log(`Inserted ${SEED_USERS.length + 1} users (including demo & admin accounts).`);

  // 2. Insert Categories
  const insertCategory = db.prepare(`
    INSERT INTO categories (id, name, icon, description, count)
    VALUES (?, ?, ?, ?, ?)
  `);

  for (const c of SEED_CATEGORIES) {
    insertCategory.run(c.id, c.name, c.icon, c.description, c.count || 0);
  }
  console.log(`Inserted ${SEED_CATEGORIES.length} categories.`);

  // 3. Insert Products
  const insertProduct = db.prepare(`
    INSERT INTO products (
      id, name, brand, category, price, original_price, discount,
      rating, reviews_count, is_trending, is_featured, image, gallery,
      description, features, in_stock, date_added
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const p of SEED_PRODUCTS) {
    insertProduct.run(
      p.id,
      p.name,
      p.brand,
      p.category,
      p.price,
      p.originalPrice || p.price,
      p.discount || 0,
      p.rating || 5.0,
      p.reviewsCount || 0,
      p.isTrending ? 1 : 0,
      p.isFeatured ? 1 : 0,
      p.image,
      JSON.stringify(p.gallery || [p.image]),
      p.description,
      JSON.stringify(p.features || []),
      p.inStock ? 1 : 0,
      p.dateAdded || '2026-01-01'
    );
  }
  console.log(`Inserted ${SEED_PRODUCTS.length} products.`);

  // 4. Insert Content Articles
  const insertContent = db.prepare(`
    INSERT INTO contents (
      id, title, category, author, date, reading_time,
      views, rating, image, summary, body
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const a of SEED_CONTENT) {
    insertContent.run(
      a.id,
      a.title,
      a.category,
      a.author,
      a.date,
      a.readingTime || '5 min read',
      a.views || 0,
      a.rating || 5.0,
      a.image,
      a.summary,
      a.body
    );
  }
  console.log(`Inserted ${SEED_CONTENT.length} articles.`);

  // 5. Insert Feedback
  const insertFeedback = db.prepare(`
    INSERT INTO feedbacks (id, user_id, user_name, user_email, target_type, target_id, target_name, rating, comment, date, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const fb of SEED_FEEDBACK) {
    insertFeedback.run(
      fb.id,
      DEMO_USER.id,
      fb.user,
      fb.email,
      fb.targetType,
      fb.targetType === 'product' ? 'prod-1' : 'art-1',
      fb.targetName,
      fb.rating,
      fb.comment,
      fb.date,
      fb.status || 'New'
    );
  }
  console.log(`Inserted ${SEED_FEEDBACK.length} feedback items.`);

  // 6. Insert Demo Wishlist items
  const insertWishlist = db.prepare(`
    INSERT INTO wishlists (user_id, product_id) VALUES (?, ?)
  `);
  const demoWishlist = ['prod-1', 'prod-2', 'prod-8'];
  for (const pid of demoWishlist) {
    insertWishlist.run(DEMO_USER.id, pid);
  }

  // 7. Insert Demo Recently Viewed Activities
  const insertActivity = db.prepare(`
    INSERT INTO activities (user_id, target_type, target_id, category) VALUES (?, ?, ?, ?)
  `);
  const demoViews = [
    { id: 'prod-1', cat: 'Electronics' },
    { id: 'prod-4', cat: 'Electronics' },
    { id: 'prod-11', cat: 'Books' },
    { id: 'prod-21', cat: 'Travel' }
  ];
  for (const v of demoViews) {
    insertActivity.run(DEMO_USER.id, 'product', v.id, v.cat);
  }

  // 8. Insert Default Algorithm Settings
  db.prepare(`
    INSERT INTO algorithm_settings (id, interest_match, category_match, wishlist_affinity, viewed_affinity, high_rating, trending)
    VALUES (1, 5, 4, 3, 3, 2, 1)
  `).run();

  console.log('Initialized algorithm settings weights.');
  console.log('=== Database Seeding Completed Successfully ===');
}

if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };

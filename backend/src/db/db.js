const { DatabaseSync } = require('node:sqlite');
const path = require('path');
const fs = require('fs');

// Ensure data folder exists
const dataDir = path.join(__dirname, '..', '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'smartrecommend.db');
const db = new DatabaseSync(dbPath);

// Enable WAL mode and foreign keys for high performance and integrity
db.exec('PRAGMA journal_mode = WAL;');
db.exec('PRAGMA foreign_keys = ON;');

/**
 * Initialize all database tables if they do not exist
 */
function initSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      age INTEGER DEFAULT 25,
      location TEXT DEFAULT '',
      interests TEXT DEFAULT '[]',
      role TEXT DEFAULT 'user',
      status TEXT DEFAULT 'Active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      brand TEXT NOT NULL,
      category TEXT NOT NULL,
      price REAL NOT NULL,
      original_price REAL,
      discount REAL DEFAULT 0,
      rating REAL DEFAULT 5.0,
      reviews_count INTEGER DEFAULT 0,
      is_trending INTEGER DEFAULT 0,
      is_featured INTEGER DEFAULT 0,
      image TEXT NOT NULL,
      gallery TEXT DEFAULT '[]',
      description TEXT,
      features TEXT DEFAULT '[]',
      in_stock INTEGER DEFAULT 1,
      date_added TEXT
    );

    CREATE TABLE IF NOT EXISTS contents (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      author TEXT NOT NULL,
      date TEXT NOT NULL,
      reading_time TEXT DEFAULT '5 min read',
      views INTEGER DEFAULT 0,
      rating REAL DEFAULT 5.0,
      image TEXT,
      summary TEXT,
      body TEXT
    );

    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT UNIQUE NOT NULL,
      icon TEXT NOT NULL,
      description TEXT,
      count INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS activities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT,
      target_type TEXT NOT NULL,
      target_id TEXT NOT NULL,
      category TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS wishlists (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      product_id TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, product_id)
    );

    CREATE TABLE IF NOT EXISTS feedbacks (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      user_name TEXT,
      user_email TEXT,
      target_type TEXT NOT NULL,
      target_id TEXT,
      target_name TEXT,
      rating INTEGER NOT NULL,
      comment TEXT,
      date TEXT,
      status TEXT DEFAULT 'New'
    );

    CREATE TABLE IF NOT EXISTS algorithm_settings (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      interest_match REAL DEFAULT 5,
      category_match REAL DEFAULT 4,
      wishlist_affinity REAL DEFAULT 3,
      viewed_affinity REAL DEFAULT 3,
      high_rating REAL DEFAULT 2,
      trending REAL DEFAULT 1,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

initSchema();

module.exports = {
  db,
  initSchema
};

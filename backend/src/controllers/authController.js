const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db } = require('../db/db');
const { JWT_SECRET } = require('../middleware/authMiddleware');

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

function formatUser(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    age: row.age,
    location: row.location,
    interests: JSON.parse(row.interests || '[]'),
    role: row.role,
    status: row.status,
    createdAt: row.created_at
  };
}

/**
 * Register new user
 */
exports.register = (req, res) => {
  try {
    const { name, email, password, interests, location, age } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(cleanEmail);
    if (existing) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
    }

    const userId = 'user-' + Date.now();
    const passwordHash = bcrypt.hashSync(password, 10);
    const interestsJson = JSON.stringify(Array.isArray(interests) && interests.length > 0 ? interests : ['Technology']);

    db.prepare(`
      INSERT INTO users (id, name, email, password_hash, age, location, interests, role, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'user', 'Active')
    `).run(userId, name.trim(), cleanEmail, passwordHash, Number(age) || 25, location || 'India', interestsJson);

    const userRow = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
    const user = formatUser(userRow);
    const token = generateToken(user);

    return res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      token,
      user
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ success: false, message: 'Server error during registration.' });
  }
};

/**
 * User login
 */
exports.login = (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const userRow = db.prepare('SELECT * FROM users WHERE email = ?').get(cleanEmail);

    if (!userRow) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    if (userRow.status === 'Disabled') {
      return res.status(403).json({ success: false, message: 'This account has been disabled by an administrator.' });
    }

    const isMatch = bcrypt.compareSync(password, userRow.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const user = formatUser(userRow);
    const token = generateToken(user);

    return res.json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      token,
      user
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Server error during login.' });
  }
};

/**
 * 1-Click Demo User Login (Alex Johnson)
 */
exports.demoUserLogin = (req, res) => {
  try {
    const demoRow = db.prepare("SELECT * FROM users WHERE email = 'alex@example.com'").get();
    if (!demoRow) {
      return res.status(404).json({ success: false, message: 'Demo user account not found.' });
    }

    const user = formatUser(demoRow);
    const token = generateToken(user);

    return res.json({
      success: true,
      message: 'Logged in as Demo User (Alex Johnson)',
      token,
      user
    });
  } catch (error) {
    console.error('Demo user login error:', error);
    return res.status(500).json({ success: false, message: 'Server error during demo login.' });
  }
};

/**
 * 1-Click Demo Admin Login
 */
exports.demoAdminLogin = (req, res) => {
  try {
    const adminRow = db.prepare("SELECT * FROM users WHERE email = 'admin@smartrecommend.com'").get();
    if (!adminRow) {
      return res.status(404).json({ success: false, message: 'Admin account not found.' });
    }

    const user = formatUser(adminRow);
    const token = generateToken(user);

    return res.json({
      success: true,
      message: 'Admin session authenticated successfully',
      token,
      user
    });
  } catch (error) {
    console.error('Demo admin login error:', error);
    return res.status(500).json({ success: false, message: 'Server error during admin login.' });
  }
};

/**
 * Get current authenticated user profile + live activity counters
 */
exports.getMe = (req, res) => {
  try {
    const userRow = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
    if (!userRow) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const user = formatUser(userRow);

    // Compute live activity statistics
    const viewedCount = db.prepare(`
      SELECT COUNT(DISTINCT target_id) AS cnt FROM activities 
      WHERE user_id = ? AND target_type = 'product'
    `).get(req.user.id)?.cnt || 0;

    const wishlistCount = db.prepare(`
      SELECT COUNT(*) AS cnt FROM wishlists WHERE user_id = ?
    `).get(req.user.id)?.cnt || 0;

    const contentCount = db.prepare(`
      SELECT COUNT(DISTINCT target_id) AS cnt FROM activities 
      WHERE user_id = ? AND target_type = 'content'
    `).get(req.user.id)?.cnt || 0;

    const ratingsCount = db.prepare(`
      SELECT COUNT(*) AS cnt FROM feedbacks WHERE user_id = ?
    `).get(req.user.id)?.cnt || 0;

    return res.json({
      success: true,
      user,
      stats: {
        viewed: viewedCount,
        wishlist: wishlistCount,
        content: contentCount,
        ratings: ratingsCount
      }
    });
  } catch (error) {
    console.error('getMe error:', error);
    return res.status(500).json({ success: false, message: 'Server error retrieving profile.' });
  }
};

/**
 * Update user profile details
 */
exports.updateProfile = (req, res) => {
  try {
    const { name, age, location } = req.body;
    db.prepare(`
      UPDATE users 
      SET name = COALESCE(?, name),
          age = COALESCE(?, age),
          location = COALESCE(?, location)
      WHERE id = ?
    `).run(name ? name.trim() : null, age ? Number(age) : null, location || null, req.user.id);

    const userRow = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
    return res.json({
      success: true,
      message: 'Profile updated successfully!',
      user: formatUser(userRow)
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({ success: false, message: 'Server error updating profile.' });
  }
};

/**
 * Update user declared interest tags
 */
exports.updateInterests = (req, res) => {
  try {
    const { interests } = req.body;
    if (!Array.isArray(interests)) {
      return res.status(400).json({ success: false, message: 'Interests must be an array of category names.' });
    }

    db.prepare('UPDATE users SET interests = ? WHERE id = ?').run(JSON.stringify(interests), req.user.id);
    const userRow = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);

    return res.json({
      success: true,
      message: 'Interests updated successfully!',
      interests: JSON.parse(userRow.interests || '[]')
    });
  } catch (error) {
    console.error('Update interests error:', error);
    return res.status(500).json({ success: false, message: 'Server error updating interests.' });
  }
};

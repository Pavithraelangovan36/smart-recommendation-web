require('dotenv').config();
const app = require('./src/app');
const { initSchema, db } = require('./src/db/db');
const { seedDatabase } = require('./src/db/seed');

// Ensure database tables exist
initSchema();

// Auto-seed if database is empty (e.g. fresh cloud deployment on Render)
try {
  const count = db.prepare('SELECT COUNT(*) as cnt FROM products').get()?.cnt || 0;
  if (count === 0) {
    console.log('Database empty on startup. Running initial seed...');
    seedDatabase();
  }
} catch (e) {
  console.log('Seeding initial database...');
  seedDatabase();
}

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`
  ==============================================================
   🚀 SMART RECOMMENDATION SYSTEM - BACKEND SERVER RUNNING
  ==============================================================
   📍 Local URL:     http://localhost:${PORT}
   🩺 Health Check:  http://localhost:${PORT}/api/health
   🛍️ Products API:  http://localhost:${PORT}/api/products
   💡 Recs API:      http://localhost:${PORT}/api/recommendations/top
   📊 Admin API:     http://localhost:${PORT}/api/admin/dashboard-stats
  --------------------------------------------------------------
   Demo User:   alex@example.com / alex123
   Admin User:  admin@smartrecommend.com / admin123
  ==============================================================
  `);
});

module.exports = server;

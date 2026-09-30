require('dotenv').config();
const app = require('./src/app');
const { initSchema } = require('./src/db/db');

// Ensure database tables exist
initSchema();

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

const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');
const { optionalAuth } = require('../middleware/authMiddleware');

router.post('/view', optionalAuth, activityController.trackActivity);
router.get('/recently-viewed', optionalAuth, activityController.getRecentlyViewed);

module.exports = router;

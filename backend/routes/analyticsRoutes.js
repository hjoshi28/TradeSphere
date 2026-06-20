const express = require('express');
const { getPortfolioAnalytics, getUserStats } = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/dashboard', protect, getPortfolioAnalytics);
router.get('/stats', protect, getUserStats);

module.exports = router;
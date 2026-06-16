const express = require('express');
const { getPortfolioAnalytics } = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/dashboard', protect, getPortfolioAnalytics);

module.exports = router;
const express = require('express');
const { getPortfolioInsights } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/insights', protect, getPortfolioInsights);

module.exports = router;
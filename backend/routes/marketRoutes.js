const express = require('express');
const {
    getTrendingStocks,
    getTopMovers,
    searchStock,
    getStockProfile,
    getMarketNews
} = require('../controllers/marketController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/trending', protect, getTrendingStocks);
router.get('/movers', protect, getTopMovers);
router.get('/search', protect, searchStock);
router.get('/news', protect, getMarketNews);
router.get('/profile/:symbol', protect, getStockProfile);

module.exports = router;

const express = require('express');
// Added getStockLiveQuote to the destructured object below:
const { executeTrade, getHoldings, getTransactions, getStockLiveQuote } = require('../controllers/tradeController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/execute', protect, executeTrade);
router.get('/holdings', protect, getHoldings);
router.get('/transactions', protect, getTransactions);

// Live stock price proxy endpoint
router.get('/quote/:symbol', protect, getStockLiveQuote);

module.exports = router;
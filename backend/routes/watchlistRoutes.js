const express = require('express');
const { getWatchlist, addToWatchlist, removeFromWatchlist } = require('../controllers/watchlistController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/')
    .get(protect, getWatchlist);
router.route('/add')
    .post(protect, addToWatchlist);
router.route('/remove')
    .post(protect, removeFromWatchlist);

module.exports = router;
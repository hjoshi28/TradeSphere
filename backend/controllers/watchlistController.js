const Watchlist = require('../models/Watchlist');
const axios = require('axios');

exports.getWatchlist = async (req, res) => {
    try {
        let watchlist = await Watchlist.findOne({ user: req.user._id });
        if (!watchlist) {
            watchlist = await Watchlist.create({ user: req.user._id, symbols: ['AAPL', 'TSLA'] }); // Default seed tickers
        }

        // Fetch live market feed prices for all watchlisted items in parallel
        const watchlistWithPrices = await Promise.all(watchlist.symbols.map(async (symbol) => {
            try {
                const response = await axios.get(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${process.env.FINNHUB_API_KEY}`);
                return {
                    symbol,
                    price: response.data.c || 0,
                    change: response.data.d || 0,
                    percentChange: response.data.dp || 0
                };
            } catch (err) {
                return { symbol, price: 0, change: 0, percentChange: 0 };
            }
        }));

        res.json(watchlistWithPrices);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.addToWatchlist = async (req, res) => {
    const { symbol } = req.body;
    if (!symbol) return res.status(400).json({ message: 'Stock symbol is required' });

    try {
        // Verify token validity with Finnhub before saving to user profile
        const verifyToken = await axios.get(`https://finnhub.io/api/v1/quote?symbol=${symbol.toUpperCase()}&token=${process.env.FINNHUB_API_KEY}`);
        if (!verifyToken.data.c) {
            return res.status(404).json({ message: 'Invalid stock ticker symbol' });
        }

        const watchlist = await Watchlist.findOneAndUpdate(
            { user: req.user._id },
            { $addToSet: { symbols: symbol.toUpperCase() } }, // Prevents duplicate values
            { new: true, upsert: true }
        );
        res.status(200).json({ message: `${symbol.toUpperCase()} added to watchlist`, watchlist });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.removeFromWatchlist = async (req, res) => {
    const { symbol } = req.body;
    try {
        const watchlist = await Watchlist.findOneAndUpdate(
            { user: req.user._id },
            { $pull: { symbols: symbol.toUpperCase() } },
            { new: true }
        );
        res.status(200).json({ message: `${symbol.toUpperCase()} removed from watchlist`, watchlist });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
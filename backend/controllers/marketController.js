const axios = require('axios');

// Predefined list of popular stocks to track
const POPULAR_STOCKS = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'NVDA', 'META', 'AMD', 'JPM', 'V', 'NFLX', 'DIS', 'BA', 'INTC', 'CRM'];

const fetchQuote = async (symbol) => {
    try {
        const response = await axios.get(
            `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${process.env.FINNHUB_API_KEY}`
        );
        return {
            symbol,
            price: response.data.c || 0,
            change: response.data.d || 0,
            percentChange: response.data.dp || 0,
            high: response.data.h || 0,
            low: response.data.l || 0,
            previousClose: response.data.pc || 0,
        };
    } catch {
        return { symbol, price: 0, change: 0, percentChange: 0, high: 0, low: 0, previousClose: 0 };
    }
};

exports.getTrendingStocks = async (req, res) => {
    try {
        const trendingSymbols = POPULAR_STOCKS.slice(0, 10);
        const stocks = await Promise.all(trendingSymbols.map(fetchQuote));
        // Filter out stocks with no price data
        res.json(stocks.filter(s => s.price > 0));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getTopMovers = async (req, res) => {
    try {
        const stocks = await Promise.all(POPULAR_STOCKS.map(fetchQuote));
        const validStocks = stocks.filter(s => s.price > 0);
        const sorted = validStocks.sort((a, b) => b.percentChange - a.percentChange);

        res.json({
            gainers: sorted.filter(s => s.percentChange > 0).slice(0, 5),
            losers: sorted.filter(s => s.percentChange < 0).sort((a, b) => a.percentChange - b.percentChange).slice(0, 5),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.searchStock = async (req, res) => {
    const { q } = req.query;
    if (!q) return res.status(400).json({ message: 'Search query is required' });

    try {
        const response = await axios.get(
            `https://finnhub.io/api/v1/search?q=${q}&token=${process.env.FINNHUB_API_KEY}`
        );
        const results = (response.data.result || [])
            .filter(r => r.type === 'Common Stock')
            .slice(0, 10)
            .map(r => ({
                symbol: r.symbol,
                description: r.description,
                type: r.type,
            }));
        res.json(results);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getStockProfile = async (req, res) => {
    const { symbol } = req.params;
    try {
        const response = await axios.get(
            `https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${process.env.FINNHUB_API_KEY}`
        );
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getMarketNews = async (req, res) => {
    try {
        const response = await axios.get(
            `https://finnhub.io/api/v1/news?category=general&token=${process.env.FINNHUB_API_KEY}`
        );
        const news = (response.data || []).slice(0, 20).map(n => ({
            headline: n.headline,
            source: n.source,
            url: n.url,
            image: n.image,
            summary: n.summary,
            datetime: n.datetime,
        }));
        res.json(news);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

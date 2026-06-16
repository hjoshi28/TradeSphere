const Holding = require('../models/Holding');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const axios = require('axios');

exports.executeTrade = async (req, res) => {
    const { symbol, companyName, type, quantity, price, sector } = req.body;
    const userId = req.user._id;
    const totalCost = quantity * price;

    try {
        const user = await User.findById(userId);

        if (type === 'BUY') {
            if (user.balance < totalCost) return res.status(400).json({ message: 'Insufficient funds' });
            user.balance -= totalCost;

            let holding = await Holding.findOne({ user: userId, symbol });
            if (holding) {
                const totalQty = holding.quantity + quantity;
                holding.avgPrice = ((holding.avgPrice * holding.quantity) + totalCost) / totalQty;
                holding.quantity = totalQty;
                await holding.save();
            } else {
                await Holding.create({ user: userId, symbol, companyName, quantity, avgPrice: price, sector });
            }
        } else if (type === 'SELL') {
            let holding = await Holding.findOne({ user: userId, symbol });
            if (!holding || holding.quantity < quantity) {
                return res.status(400).json({ message: 'Insufficient shares to sell' });
            }

            user.balance += totalCost;
            holding.quantity -= quantity;

            if (holding.quantity === 0) {
                await holding.deleteOne();
            } else {
                await holding.save();
            }
        }

        await user.save();
        await Transaction.create({ user: userId, symbol, type, quantity, price, totalAmount: totalCost });

        res.status(200).json({ message: 'Trade executed successfully', balance: user.balance });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getHoldings = async (req, res) => {
    try {
        const holdings = await Holding.find({ user: req.user._id });
        res.json(holdings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getTransactions = async (req, res) => {
    try {
        const history = await Transaction.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(history);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getStockLiveQuote = async (req, res) => {
    const { symbol } = req.params;
    try {
        const response = await axios.get(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${process.env.FINNHUB_API_KEY}`);
        if (!response.data.c) {
            return res.status(404).json({ message: "Asset symbol not found globally" });
        }
        res.json({
            price: response.data.c,
            high: response.data.h,
            low: response.data.l,
            previousClose: response.data.pc
        });
    } catch (error) {
        res.status(500).json({ message: "Market data provider latency issue" });
    }
};
const Holding = require('../models/Holding');
const axios = require('axios');

exports.getPortfolioAnalytics = async (req, res) => {
    try {
        const holdings = await Holding.find({ user: req.user._id });
        
        let totalInvestment = 0;
        let currentPortfolioValue = 0;
        let sectorAllocation = {};

        // 🚀 Parallel asynchronous fetching of actual live market metrics
        const liveHoldingsData = await Promise.all(holdings.map(async (h) => {
            try {
                const response = await axios.get(`https://finnhub.io/api/v1/quote?symbol=${h.symbol}&token=${process.env.FINNHUB_API_KEY}`);
                // Finnhub API maps the current price to the property 'c'
                const livePrice = response.data.c || h.avgPrice; 
                return { ...h._doc, livePrice };
            } catch (err) {
                return { ...h._doc, livePrice: h.avgPrice }; // Fallback safety
            }
        }));

        liveHoldingsData.forEach(h => {
            const cost = h.quantity * h.avgPrice;
            const currentVal = h.quantity * h.livePrice;

            totalInvestment += cost;
            currentPortfolioValue += currentVal;
            sectorAllocation[h.sector] = (sectorAllocation[h.sector] || 0) + currentVal;
        });

        const sectorData = Object.keys(sectorAllocation).map(sector => ({
            name: sector,
            value: parseFloat(sectorAllocation[sector].toFixed(2))
        }));

        let concentrationScore = 0;
        if (currentPortfolioValue > 0) {
            sectorData.forEach(s => {
                const percentage = (s.value / currentPortfolioValue) * 100;
                concentrationScore += percentage * percentage;
            });
        }

        const healthScore = Math.max(0, Math.min(100, Math.round(100 - (concentrationScore / 100))));
        let recommendation = "Your portfolio is well diversified across multiple market sectors.";
        if (healthScore < 50) recommendation = "High concentration risk! Consider reallocating capital to underrepresented sectors.";

        res.json({
            totalInvestment: parseFloat(totalInvestment.toFixed(2)),
            currentValue: parseFloat(currentPortfolioValue.toFixed(2)),
            netGainLoss: parseFloat((currentPortfolioValue - totalInvestment).toFixed(2)),
            healthScore,
            recommendation,
            sectorData
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
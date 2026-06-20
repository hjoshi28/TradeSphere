const Holding = require('../models/Holding');
const User = require('../models/User');
const axios = require('axios');

exports.getPortfolioInsights = async (req, res) => {
    try {
        const userId = req.user._id;
        
        // 1. Fetch live user financial data from MongoDB
        const user = await User.findById(userId).select('balance name');
        const holdings = await Holding.find({ user: userId });

        if (!holdings || holdings.length === 0) {
            return res.json({ 
                analysis: "Welcome to your AI Strategic Hub! Once you purchase your first virtual stock positions, I will run a full cryptographic risk audit on your asset distribution here." 
            });
        }

        // 2. Format a clean dataset for the AI engine
        const portfolioSummary = holdings.map(h => ({
            symbol: h.symbol,
            quantity: h.quantity,
            avgPrice: h.avgPrice,
            sector: h.sector
        }));

        // 3. Construct a highly prescriptive engineering prompt
        const prompt = `
        You are an elite institutional portfolio strategist acting as the embedded AI module for "TradeSphere", a virtual stock simulator.
        Analyze this user's current portfolio data objectively:
        - User Name: ${user.name}
        - Free Cash Balance: $${user.balance.toFixed(2)}
        - Active Holdings: ${JSON.stringify(portfolioSummary)}

        Provide a structured evaluation in clean Markdown format:
        1. **Portfolio Health Summary**: Brief state of their capital deployment.
        2. **Risk & Concentration Analysis**: Check if they are dangerously over-allocated in a single sector or asset.
        3. **Actionable Rebalancing Steps**: Explicitly suggest which sectors or stocks to add, reduce, or look into next using their remaining cash.
        
        Keep your advice professional, data-driven, and highly concise. Do not include lengthy disclaimers.
        `;

        // 4. Dispatch the request to the official Google Gemini API endpoint
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
        
        const response = await axios.post(geminiUrl, {
            contents: [{ parts: [{ text: prompt }] }]
        });

        // 5. Safely isolate the returned generative text markdown string
        const aiAnalysis = response.data.candidates[0].content.parts[0].text;
        res.json({ analysis: aiAnalysis });

    } catch (error) {
        console.error("Gemini Endpoint Connectivity Error:", error.message);
        console.error("Gemini API Response:", JSON.stringify(error.response?.data, null, 2));
        res.status(500).json({ message: "Failed to generate AI portfolio metrics" });
    }
};
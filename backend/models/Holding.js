const mongoose = require('mongoose');

const holdingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    symbol: { type: String, required: true },
    companyName: { type: String, required: true },
    quantity: { type: Number, required: true },
    avgPrice: { type: Number, required: true },
    sector: { type: String, required: true }
}, { timestamps: true });

// Prevent duplicate stock entry per user; compound index
holdingSchema.index({ user: 1, symbol: 1 }, { unique: true });

module.exports = mongoose.model('Holding', holdingSchema);
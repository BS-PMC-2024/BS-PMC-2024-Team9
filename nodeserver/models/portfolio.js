const mongoose = require('mongoose');

const StockSchema = new mongoose.Schema({
  ticker: { type: String, required: true },
  shares: { type: Number, required: true },
  average_price: { type: Number, required: true }
});

const TransactionSchema = new mongoose.Schema({
  ticker: { type: String, required: true },
  shares: { type: Number, required: true },
  price: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  type: { type: String, required: true, enum: ['Buy', 'Sell', 'Short', 'Cover'] }, // Add 'Short' and 'Cover'
  profitOrLoss: { type: Number, required: true },
  closed: {type:Boolean , default: false},
});

const ShortPositionSchema = new mongoose.Schema({
  ticker: { type: String, required: true },
  shares: { type: Number, required: true },
  average_price: { type: Number, required: true }
});

const PortfolioSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  cash_balance: { type: Number, default: 0 },
  stocks: [StockSchema],
  shortPositions: [ShortPositionSchema], // Add short positions array
  transactions: [TransactionSchema],
  favorites: [{type:String}],
});


const Portfolio = mongoose.model("Portfolio", PortfolioSchema);

module.exports.Portfolio = Portfolio;

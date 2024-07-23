// models/Analysis.js
const mongoose = require('mongoose');

const AnalysisSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ticker: { type: String, required: true },
  indicators: { type: Map, of: String }, // Map to store various indicators and their values
  date: { type: Date, default: Date.now },
  notes: { type: String },
});

module.exports = mongoose.model('Analysis', AnalysisSchema);

const express = require('express');
const router = express.Router();
const {auth} = require('../middleware/auth');
const {User} = require('../models/user');
const {Portfolio} = require('../models/portfolio');

// הוספת כסף לחשבון המשתמש
router.post('/add-money', auth, async (req, res) => {
  try {
    const { amount } = req.body;
    if (amount <= 0) {
      return res.status(400).json({ error: 'Amount must be greater than zero.' });
    }

    let portfolio = await Portfolio.findOne({ user: req.user._id });
    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found.' });
    }

    portfolio.cash_balance += amount;
    await portfolio.save();
    res.json({ cash_balance: portfolio.cash_balance });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// משיכת כסף מחשבון המשתמש
router.post('/withdraw-money', auth, async (req, res) => {
  try {
    const { amount } = req.body;
    if (amount <= 0) {
      return res.status(400).json({ error: 'Amount must be greater than zero.' });
    }

    let portfolio = await Portfolio.findOne({ user: req.user._id });
    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found.' });
    }

    if (amount > portfolio.cash_balance) {
      return res.status(400).json({ error: 'Insufficient funds.' });
    }

    portfolio.cash_balance -= amount;
    await portfolio.save();
    res.json({ cash_balance: portfolio.cash_balance });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;

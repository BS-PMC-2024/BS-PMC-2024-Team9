const { auth, isUser } = require('../middleware/auth');
const { Portfolio } = require('../models/portfolio');
const router = require("express").Router();

// Get user's portfolio
router.get('/', auth,  async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ user: req.user._id });
    if (!portfolio) {
      return res.status(400).json({ msg: 'No portfolio found for this user' });
    }
    res.json(portfolio);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get user's transactions
router.get('/transactions', auth, async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ user: req.user._id });
    if (!portfolio) {
      return res.status(400).json({ msg: 'No portfolio found for this user' });
    }
    res.json(portfolio.transactions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Add stock to user's portfolio
router.post('/add_stock', auth, async (req, res) => {
  const { ticker, shares, average_price } = req.body;

  try {
    let portfolio = await Portfolio.findOne({ user: req.user._id });

    if (!portfolio) {
      portfolio = new Portfolio({ user: req.user._id });
    }

    const stockIndex = portfolio.stocks.findIndex(stock => stock.ticker === ticker);

    if (stockIndex !== -1) {
      // Update existing stock
      portfolio.stocks[stockIndex].shares += shares;
      portfolio.stocks[stockIndex].average_price = average_price;  // Update average price as needed
    } else {
      // Add new stock
      portfolio.stocks.push({ ticker, shares, average_price });
    }

    await portfolio.save();
    res.json(portfolio);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Buy stock
router.post('/buy', auth, async (req, res) => {
  const { ticker, shares, price } = req.body;

  if (!ticker || !shares || !price) {
    return res.status(400).json({ msg: 'Ticker, shares, and price are required' });
  }

  try {
    let portfolio = await Portfolio.findOne({ user: req.user._id });

    if (!portfolio) {
      portfolio = new Portfolio({ user: req.user._id, cash_balance: 0 });
    }

    const totalCost = shares * price;
    if (portfolio.cash_balance < totalCost) {
      return res.status(400).json({ msg: 'Insufficient funds' });
    }

    portfolio.cash_balance -= totalCost;
    const stockIndex = portfolio.stocks.findIndex(stock => stock.ticker === ticker);

    if (stockIndex !== -1) {
      // Update existing stock
      portfolio.stocks[stockIndex].shares += shares;
      // Update average price
      const existingStock = portfolio.stocks[stockIndex];
      const newTotalShares = existingStock.shares + shares;
      existingStock.average_price = ((existingStock.shares * existingStock.average_price) + totalCost) / newTotalShares;
    } else {
      // Add new stock
      portfolio.stocks.push({ ticker, shares, average_price: price });
    }

    // Add transaction
    portfolio.transactions.push({
      ticker,
      shares,
      price,
      type: 'Buy',
      profitOrLoss: 0,
      closed: false // Initial state is open
    });

    await portfolio.save();
    res.json(portfolio);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Sell stock
router.post('/sell', auth, async (req, res) => {
  const { ticker, shares, price } = req.body;
  
  if (!ticker || !shares || !price) {
    return res.status(400).json({ msg: 'Ticker, shares, and price are required' });
  }

  try {
    let portfolio = await Portfolio.findOne({ user: req.user._id });

    if (!portfolio) {
      return res.status(400).json({ msg: 'Portfolio not found' });
    }

    const stockIndex = portfolio.stocks.findIndex(stock => stock.ticker === ticker);
    if (stockIndex === -1 || portfolio.stocks[stockIndex].shares < shares) {
      return res.status(400).json({ msg: 'Not enough shares to sell' });
    }

    const totalRevenue = shares * price;
    portfolio.cash_balance += totalRevenue;
    portfolio.stocks[stockIndex].shares -= shares;

    if (portfolio.stocks[stockIndex].shares === 0) {
      portfolio.stocks.splice(stockIndex, 1);
    }

    // Calculate profit or loss for the transaction
    const transactionProfitOrLoss = (price - portfolio.stocks[stockIndex].average_price) * shares;

    // Find the buy transaction for the same stock to close it
    const openTransactionIndex = portfolio.transactions.findIndex(
      transaction => transaction.ticker === ticker && transaction.type === 'Buy' && !transaction.closed
    );

    if (openTransactionIndex !== -1) {
      portfolio.transactions[openTransactionIndex].closed = true;
    }
    console.log(`Selling ${shares} shares of ${ticker} at $${price} each. Stock info:`);

    // Add sell transaction
    portfolio.transactions.push({
      ticker,
      shares,
      price,
      type: 'Sell',
      profitOrLoss: transactionProfitOrLoss,
      closed: true // Sell transaction is always closed
    });

    await portfolio.save();
    res.json(portfolio);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Add favorite stock
router.post('/favorite', auth , async (req,res ) => {
  const { ticker } = req.body;
  if(!ticker){
    return res.status(400).json({msg:'Ticker is required'});
  }
  try {
    let portfolio = await Portfolio.findOne({user: req.user._id});
    if(!portfolio){
      portfolio = new Portfolio({user: req.user._id , cash_balance:0,favorites:[]});
    }
    if(!portfolio.favorites.includes(ticker)){
      portfolio.favorites.push(ticker);
    }
    await portfolio.save();
    res.json(portfolio);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});
// get user`s favorite stocks
router.get('/favorites',auth , async(req,res) => {
  try {
    const portfolio = await Portfolio.findOne({user: req.user._id});
    if(!portfolio){
      return res.status(400).json({msg:'No portfolio found for this user'});
    }
    res.json(portfolio.favorites);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Remove stock from user's favorites
router.delete('/rmfavorite/:ticker', auth, async (req, res) => {
  try {
    let portfolio = await Portfolio.findOne({ user: req.user._id });

    if (!portfolio) {
      return res.status(400).json({ msg: 'Portfolio not found' });
    }
    
    const ticker = req.params.ticker;


    const stockIndex = portfolio.favorites.indexOf(ticker);



    if (stockIndex === -1) {
      return res.status(400).json({ msg: 'Stock not found in favorites' });
    }

    portfolio.favorites.splice(stockIndex, 1);

    await portfolio.save();
    res.json({ favorites: portfolio.favorites });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});




module.exports = router;

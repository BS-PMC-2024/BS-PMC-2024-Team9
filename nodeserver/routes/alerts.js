const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const {auth} = require('../middleware/auth');
const {User} = require('../models/user');
const Alert = require('../models/alert'); // Assuming you have an Alert model

// Get all alerts for the authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const alerts = await Alert.find({ user: req.user._id });
    res.json(alerts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Add a new alert
router.post(
  '/',
  [
    auth,
    [
      check('ticker', 'Ticker is required').not().isEmpty(),
      check('price', 'Price is required').isFloat({ gt: 0 })
    ]
  ],
  async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { ticker, price } = req.body;

    try {
      const newAlert = new Alert({
        user: req.user._id,
        ticker,
        price
      });

      const alert = await newAlert.save();

      res.json(alert);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// Delete an alert
router.delete('/:id', auth, async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id);

    if (!alert) {
      return res.status(404).json({ msg: 'Alert not found' });
    }

    // Check user
    if (alert.user.toString() !== req.user._id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await alert.deleteOne();

    res.json({ msg: 'Alert removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;

// routes/analysis.js
const express = require('express');
const router = express.Router();
const {auth} = require('../middleware/auth');
const {Analysis} = require('../models/analysis');

// הוספת ניתוח חדש
router.post('/add', auth, async (req, res) => {
  const { ticker, indicators, notes } = req.body;

  try {
    const newAnalysis = new Analysis({
      user: req.user.id,
      ticker,
      indicators,
      notes,
    });

    const analysis = await newAnalysis.save();
    res.json(analysis);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// קבלת כל הניתוחים של המשתמש
router.get('/all', auth, async (req, res) => {
  try {
    const analyses = await Analysis.find({ user: req.user.id });
    res.json(analyses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// קבלת ניתוח לפי ID
router.get('/:id', auth, async (req, res) => {
  try {
    const analysis = await Analysis.findById(req.params.id);

    if (!analysis) {
      return res.status(404).json({ msg: 'Analysis not found' });
    }

    res.json(analysis);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// מחיקת ניתוח
router.delete('/:id', auth, async (req, res) => {
  try {
    const analysis = await Analysis.findById(req.params.id);

    if (!analysis) {
      return res.status(404).json({ msg: 'Analysis not found' });
    }

    await analysis.remove();
    res.json({ msg: 'Analysis removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;

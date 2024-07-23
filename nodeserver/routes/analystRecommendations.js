const express = require('express');
const router = express.Router();
const axios = require('axios');

// Get analyst recommendations by ticker
router.get('/', async (req, res) => {
  const { ticker } = req.query;
  const apiKey = 'cnnc531r01qq36n63pt0cnnc531r01qq36n63ptg';
  
  try {
    const response = await axios.get(`https://finnhub.io/api/v1/stock/recommendation?symbol=${ticker}&token=${apiKey}`);
    res.json(response.data);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;

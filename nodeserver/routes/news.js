const express = require('express');
const router = express.Router();
const axios = require('axios');
const moment = require('moment')
router.get('/', async (req, res) => {
    try {
        const today = moment().format('YYYY-MM-DD');
        const response = await axios.get(`https://newsapi.org/v2/everything?q=finance&apiKey=941c905a04a24e6c8edee618209cf60e&from=2024-07-07&to=${today}`);
        const articles = response.data.articles.slice(0, 5); // Limit to 5 articles
        res.json({ articles });
    } catch (err) {
        console.error("Error fetching news: ", err); // Debug: Log the error
        res.status(500).json({ error: 'Failed to fetch news' });
    }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const {User} = require('../models/user');
const Comment = require('../models/comment');
const {isAdmin} = require('../middleware/auth');
const { Portfolio } = require('../models/portfolio');

// קבלת כל המשתמשים עם יתרת הכסף בתיק ההשקעות שלהם
router.get('/users', isAdmin, async (req, res) => {
  try {
    const users = await User.find({});

    const usersWithPortfolios = await Promise.all(
      users.map(async (user) => {
        const portfolio = await Portfolio.findOne({ user: user._id });
        const cashBalance = portfolio ? portfolio.cash_balance : 0; // יתרת הכסף בתיק
        return { ...user._doc, cashBalance }; // מחזירים את יתרת הכסף עם פרטי המשתמש
      })
    );

    res.json(usersWithPortfolios);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.get('/comments', isAdmin, async (req, res) => {
    try {
      const comments = await Comment.find({});
      res.json(comments);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });
  

// מחיקת משתמש
router.delete('/users/:id', isAdmin , async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    await user.deleteOne();
    res.json({ msg: 'User removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// מחיקת תגובה
router.delete('/comments/:id', isAdmin,async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ msg: 'Comment not found' });
    }

    await comment.deleteOne();
    res.json({ msg: 'Comment removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// מסלול לקבלת סטטיסטיקות של משתמשים ותגובות לפי יום
router.get('/stats', isAdmin, async (req, res) => {
  try {
    const userStats = await User.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const commentStats = await Comment.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({ userStats, commentStats });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;

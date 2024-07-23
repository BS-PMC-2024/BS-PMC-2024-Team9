const express = require('express');
const router = express.Router();
const {User} = require('../models/user');
const Comment = require('../models/comment');
const {isAdmin} = require('../middleware/auth');

// קבלת כל המשתמשים
router.get('/users', isAdmin, async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
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

module.exports = router;

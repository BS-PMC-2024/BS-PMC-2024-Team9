const express = require('express');
const router = express.Router();
const Comment = require('../models/comment');
const { auth } = require('../middleware/auth');

// Add a new comment
router.post('/', async (req, res) => {
    const { ticker, user, comment } = req.body;

    try {
        // Create a new comment document and save it to the database
        const newComment = new Comment({ ticker, user, comment });
        await newComment.save();
        
        // Respond with status 201 (Created) and return the new comment
        res.status(201).json(newComment);
    } catch (err) {
        // Handle any errors and send a 500 (Internal Server Error) status
        res.status(500).json({ error: 'Failed to add comment' });
    }
});

// Get all comments for a specific ticker
router.get('/:ticker', async (req, res) => {
    const { ticker } = req.params;

    try {
        // Find all comments associated with the specified ticker symbol
        const comments = await Comment.find({ ticker });
        
        // Respond with the comments and a 200 (OK) status
        res.status(200).json(comments);
    } catch (err) {
        // Handle any errors and send a 500 (Internal Server Error) status
        res.status(500).json({ error: 'Failed to fetch comments' });
    }
});

// Delete a comment by ID
router.delete('/:id', auth, async (req, res) => {
    try {
        // Find the comment by its ID
        const comment = await Comment.findById(req.params.id);

        // If the comment doesn't exist, respond with a 404 (Not Found) status
        if (!comment) {
            return res.status(404).json({ msg: 'Comment not found' });
        }

        // Check if the user who is trying to delete the comment is the same as the user who created the comment
        if (comment.user !== req.user.name) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        // Delete the comment from the database
        await comment.deleteOne();
        
        // Respond with a success message
        res.json({ msg: 'Comment deleted' });
    } catch (err) {
        // Log the error to the console and respond with a 500 (Internal Server Error) status
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;

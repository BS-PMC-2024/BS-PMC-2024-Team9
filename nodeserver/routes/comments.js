const express = require('express');
const router = express.Router();
const Comment = require('../models/comment');
const {auth} = require('../middleware/auth');

//Add comment
router.post('/',async(req,res) => {
    const {ticker,user,comment} = req.body;
    try {
        const newComment = new Comment({ticker , user , comment});
        await newComment.save();
        res.status(201).json(newComment);
    } catch (err) {
        res.status(500).json({error:'Faild to add comment'});
    }
});

//get the comment for ticker
router.get('/:ticker' , async (req,res) => {
    const {ticker} = req.params;
    try {
        const comments = await Comment.find({ticker});
        res.status(200).json(comments);
    } catch (err) {
        res.status(500).json({error: 'Failed to fetch comments'});
    }
}) ;

//delete message
router.delete('/:id' , auth,async(req,res) =>{
    try {
        const comment = await Comment.findById(req.params.id);
        if(!comment){
            return res.status(404).json({msg: 'Comment not found'});
        }
        //valid if the user == user comment
        if(comment.user !== req.user.name){
            return res.status(401).json({msg:'user not authorized'});
        }

        await comment.deleteOne();
        res.json({msg:'comment deleted'});
    } catch (err) {
        console.error(err.message);
        res.status(500).send('server error');
    }
});

module.exports = router;

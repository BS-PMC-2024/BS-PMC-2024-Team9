const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    ticker: {type : String , required: true},
    user: { type: String , required: true},
    comment : {type: String , required: true},
    date: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Comment', CommentSchema);

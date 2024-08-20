const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 200,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 200,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  portfolio: { type: mongoose.Schema.Types.ObjectId, 
    ref: 'Portfolio' 
  },
  date: { type: Date, 
    default: Date.now 
  },
  preferences: {
    language: { type: String, default: 'English' },
    timezone: { type: String, default: 'UTC' },
  },
});

const User = mongoose.model("User", userSchema);

module.exports.User = User;

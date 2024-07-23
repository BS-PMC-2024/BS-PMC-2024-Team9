const express = require("express");
const bcrypt = require("bcryptjs");
const Joi = require("joi");
const { User } = require("../models/user");
const { Portfolio } = require("../models/portfolio");
const genAuthToken = require("../utils/genAuthToken");

const router = express.Router();

router.post("/", async (req, res) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().min(3).max(200).required().email(),
    password: Joi.string().min(3).max(200).required(),
    initial_balance: Joi.number().min(0).required()  // הוספת בדיקת השדה initial_balance
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already exist");

  user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();
  
  // יצירת תיק השקעות עם יתרה ראשונית
  const portfolio = new Portfolio({
    user: user._id,
    cash_balance: req.body.initial_balance,
  });
  await portfolio.save();

  const token = genAuthToken(user);
  res.send(token);
});

module.exports = router;

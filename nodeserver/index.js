const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();

// Configure CORS to allow requests from your frontend domain
const corsOptions = {
    origin: 'http://localhost:5173', // Change this to the frontend URL
    credentials: true,
  };

const register = require("./routes/register");
const login = require("./routes/login");
const portfolio = require("./routes/portfolio");
const news = require("./routes/news");
const analystRecommendations = require("./routes/analystRecommendations");
const analysis = require("./routes/analysis");
const user = require("./routes/user");
const alerts = require("./routes/alerts");
const comments = require("./routes/comments");
const admin = require("./routes/admin");

require("dotenv").config();

app.use(express.json());
app.use(cors(corsOptions));

app.use("/api/register",register);
app.use("/api/login",login);
app.use("/api/portfolio", portfolio);
app.use('/api/news', news);
app.use('/api/analystRecommendations', analystRecommendations);
app.use('/api/analysis',analysis);
app.use('/api/user',user);
app.use('/api/alerts',alerts);
app.use('/api/comments', comments);
app.use('/api/admin',admin);

// Start alert service
const triggerAlerts = require('./utils/alertService');
triggerAlerts(); // Start the alert service

app.get("/", (req, res) => {
    res.send("Welcome to our online shop API...")
});


const port = 5050
const url = process.env.MONGO_DB
app.listen(port ,console.log(`Server running on port ${port}`));

mongoose.connect(url)
.then(() => console.log("MongoDB connection successful..."))
.catch((err) => console.log("MongoDB connection failed",err.message));
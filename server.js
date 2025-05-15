// server.js
const express = require('express');
const app = express();
const dotenv = require('dotenv');
const userRoutes = require('./routes/users');
const connectDB = require('./config/database');

dotenv.config();

// Connect to MongoDB
connectDB();

// Middleware to parse JSON bodies
app.use(express.json());

// Routes
app.use('/users', userRoutes);

// Use Vercel's PORT environment variable, or default to 3000
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
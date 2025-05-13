const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db.config');
const userRoutes = require('./routes/userRoutes');

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/users', userRoutes);

// Root route
app.get('/', (req, res) => {
  res.send(`
    <h1>API is running!</h1>
    <p>Welcome to the User Matrix Backend API!</p>
    <p>Try accessing <a href="/api/users/login">/api/users/login</a> to view user data.</p>
  `);
});

// 404 Error Handling
app.use((req, res, next) => {
  res.status(404).send(`
    <h1>404 Not Found</h1>
    <p>Sorry, the route you are looking for is not found.</p>
  `);
});

// 500 Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send(`
    <h1>500 Internal Server Error</h1>
    <p>An error occurred on the server. Please try again later.</p>
  `);
});

// Export the app for serverless deployment on platforms like Vercel
module.exports = app;
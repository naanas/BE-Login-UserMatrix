const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./users/config/db.config');
const userRoutes = require('./users/routes/userRoutes');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Add this line to parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Add this line to parse URL-encoded request bodies

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/users', userRoutes); // Mount the userRoutes with the base URL '/api/users'

app.get('/', (req, res) => {
  res.send('API is running!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
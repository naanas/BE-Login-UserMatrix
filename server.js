const express = require('express');
const app = express();
const dotenv = require('dotenv');
const userRoutes = require('./routes/users');
const connectDB = require('./config/database');

dotenv.config(); // Load environment variables from .env file

connectDB();

app.use(express.json());
app.use('/users', userRoutes);

const port = process.env.PORT || 5000; // Use Vercel's PORT or default to 3000
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
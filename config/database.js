// config/database.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB database!');
  } catch (err) {
    console.error('Error connecting to MongoDB database:', err);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
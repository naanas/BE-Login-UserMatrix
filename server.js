const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db.config');
const userRoutes = require('./routes/userRoutes');

dotenv.config(); // Load environment variables from .env file

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

// Tangani rute root (/)
app.get('/', (req, res) => {
    res.send('<h1>API is running!</h1><p>Coba akses /api/users untuk melihat data pengguna.</p>');
});

// Middleware untuk menangani rute yang tidak ditemukan (404)
app.use((req, res, next) => {
    res.status(404).send('<h1>404 Not Found</h1><p>Rute tidak ditemukan.</p>');
});

// Middleware untuk menangani kesalahan server (500)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('<h1>500 Internal Server Error</h1><p>Terjadi kesalahan pada server.</p>');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
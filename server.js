const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db.config');
const userRoutes = require('./routes/userRoutes');

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

// Tangani rute root (/)
app.get('/', (req, res) => {
  res.send(`
    <h1>API is running!</h1>
    <p>Selamat datang di backend API User Matrix!</p>
    <p>Coba akses <a href="/api/users/login">/api/users/login</a> untuk melihat data pengguna.</p>
  `);
});

// Middleware untuk menangani rute yang tidak ditemukan (404)
app.use((req, res, next) => {
  res.status(404).send(`
    <h1>404 Not Found</h1>
    <p>Maaf, rute yang Anda cari tidak ditemukan.</p>
  `);
});

// Middleware untuk menangani kesalahan server (500)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send(`
    <h1>500 Internal Server Error</h1>
    <p>Terjadi kesalahan pada server. Silakan coba lagi nanti.</p>
  `);
});

// Tidak perlu app.listen() di Vercel
// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

module.exports = app; // Export app untuk Vercel
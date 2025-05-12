const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const path = require('path');
const db = require('./config/db.config');
const bcrypt = require('bcrypt');
require('dotenv').config(); // Load variables from .env file

const app = express();
const port = process.env.PORT || 5000; // Gunakan variabel lingkungan PORT atau default ke 5000

// Middleware untuk mengurai body request
app.use(bodyParser.json());

// Konfigurasi CORS
app.use(cors({
  origin: '*' // Izinkan semua origin (tidak disarankan untuk produksi)
}));

// Sajikan file statis dari direktori 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Gunakan userRoutes
app.use(userRoutes);

// Endpoint untuk menerima input data (register)
app.post('/api/input', async (req, res) => {
  const { userId, password, role } = req.body;

  // Validasi data (opsional)
  if (!userId || !password) {
    return res.status(400).json({ message: 'User ID dan password harus diisi' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10); // Hash password sebelum disimpan

    // Simpan data ke database
    const query = `INSERT INTO users (userId, password, role) VALUES (?, ?, ?)`;

    db.query(query, [userId, hashedPassword, role || 'user'], (err, results) => {
      if (err) {
        console.error('Error query:', err);
        return res.status(500).json({ message: 'Terjadi kesalahan server saat menyimpan data' });
      }

      return res.status(200).json({ message: 'User berhasil dibuat' });
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

// Middleware untuk menangani error
app.use((err, req, res, next) => {
  console.error('Terjadi kesalahan:', err.stack);
  res.status(500).json({ message: 'Terjadi kesalahan server.' });
});

// Jalankan server
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
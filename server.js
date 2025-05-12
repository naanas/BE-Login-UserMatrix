const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes'); // Import userRoutes
const app = express();
const port = 5000;

// Middleware untuk mengurai body request
app.use(bodyParser.json());

// Konfigurasi CORS
app.use(cors());

// Gunakan userRoutes
app.use(userRoutes);

// Middleware untuk menangani error
app.use((err, req, res, next) => {
  console.error('Terjadi kesalahan:', err.stack);
  res.status(500).json({ message: 'Terjadi kesalahan server.' });
});

// Jalankan server
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
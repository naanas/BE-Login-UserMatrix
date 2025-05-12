const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
const port = 5000;

// Middleware untuk mengurai body request
app.use(bodyParser.json());

// Konfigurasi CORS
app.use(cors());

// Konfigurasi koneksi database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'asd',
  database: 'asd',
});

// Koneksi ke database
db.connect((err) => {
  if (err) {
    console.error('Koneksi database gagal:', err);
    return;
  }
  console.log('Terhubung ke database MySQL');
});

// Endpoint login
app.post('/login', async (req, res) => {
  const { userId, password } = req.body;

  try {
    const query = `SELECT userId, password, role FROM users WHERE userId = ?`; // Include role in the query

    db.query(query, [userId], async (err, results) => {
      if (err) {
        console.error('Error query:', err);
        return res.status(500).json({ message: 'Terjadi kesalahan server.' });
      }

      if (results.length === 0) {
        return res.status(401).json({ message: 'User ID tidak ditemukan.' });
      }

      const user = results[0];
      const hashedPassword = user.password;

      const passwordMatch = await bcrypt.compare(password, hashedPassword);

      if (passwordMatch) {
        // Include the role in the successful response
        return res.status(200).json({
          message: 'Login berhasil',
          userId: user.userId,
          role: user.role,
        });
      } else {
        return res.status(401).json({ message: 'Password salah.' });
      }
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Terjadi kesalahan server.' });
  }
});

// Endpoint register (opsional)
app.post('/register', async (req, res) => {
  const { userId, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `INSERT INTO users (userId, password) VALUES (?, ?)`;

    db.query(query, [userId, hashedPassword], (err, results) => {
      if (err) {
        console.error('Error query:', err);
        return res.status(500).json({ message: 'Terjadi kesalahan server.' });
      }

      return res.status(201).json({ message: 'User berhasil dibuat' });
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Terjadi kesalahan server.' });
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
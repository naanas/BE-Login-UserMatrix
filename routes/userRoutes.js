const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Rute untuk mendapatkan daftar pengguna (berfungsi)
router.get('/manage/users', (req, res) => {
  res.json({ message: 'Daftar pengguna' });
});

// Rute untuk login
router.post('/login', (req, res) => {
  // Logika login di sini
  res.json({ message: 'Login berhasil!' });
});
module.exports = router;
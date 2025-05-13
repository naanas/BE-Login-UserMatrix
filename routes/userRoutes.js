const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Rute login
router.post('/login', userController.loginUser);

// Example protected route (requires JWT)
router.get('/profile', userController.protect, (req, res) => {
    res.json({ message: 'Profile data', user: req.user });
});

// Rute register
router.post('/register', userController.registerUser);

// Rute untuk mendapatkan daftar pengguna
router.get('/manage/users', userController.getAllUsers);

// Rute untuk menambahkan pengguna baru
router.post('/users', userController.createUser);

// Rute untuk mendapatkan detail pengguna berdasarkan ID
router.get('/manage/users/:id', userController.getUserById);

// Rute untuk memperbarui pengguna
router.put('/manage/users/:id', userController.updateUser);

// Rute untuk menghapus pengguna
router.delete('/manage/users/:id', userController.deleteUser);

module.exports = router;
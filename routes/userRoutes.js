const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Rute login
router.post('/login', userController.login);

// Rute register
router.post('/register', userController.register);

// Rute untuk mendapatkan daftar pengguna
router.get('/manage/users', userController.getUsers);

// Rute untuk menambahkan pengguna baru
router.post('/manage/users', userController.createUser);

// Rute untuk memperbarui pengguna
router.put('/manage/users/:id', userController.updateUser);

// Rute untuk menghapus pengguna
router.delete('/manage/users/:id', userController.deleteUser);

module.exports = router;
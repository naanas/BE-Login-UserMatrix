const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Rute login (Pastikan ada di bagian atas)
router.post('/login', userController.loginUser);

// Rute lainnya
router.get('/profile', userController.protect, (req, res) => {
  res.status(200).json({ message: 'Profile data', user: req.user });
});

router.post('/register', userController.registerUser);

router.get('/manage/users', userController.getAllUsers);

router.post('/users', userController.createUser);

router.get('/manage/users/:id', userController.getUserById);

router.put('/manage/users/:id', userController.updateUser);

router.delete('/manage/users/:id', userController.deleteUser);

module.exports = router;
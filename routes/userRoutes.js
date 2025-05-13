const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Rute login
router.post('/login', userController.loginUser);

// Example protected route (requires JWT)
router.get('/profile', userController.protect, (req, res) => {
  res.status(200).json({ message: 'Profile data', user: req.user }); // Tambahkan status 200
});


module.exports = router;
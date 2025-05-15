// routes/users.js
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/auth');

// GET all users (protected, admin only)
router.get('/', authMiddleware.authenticateToken, authMiddleware.authorizeRole(['spv']), async (req, res) => {
  try {
    const users = await User.find({}, 'userid role'); // Retrieve only userid and role
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve users.' });
  }
});

// GET user by ID (protected, admin or self)
router.get('/:id', authMiddleware.authenticateToken, async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findOne({ userid: userId }, 'userid role');

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (req.user.role !== 'spv' && req.user.userid !== userId) {
      return res.status(403).json({ message: 'Unauthorized.' });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve user.' });
  }
});

// POST create a new user (protected, admin only)
router.post('/', authMiddleware.authenticateToken, authMiddleware.authorizeRole(['spv']), async (req, res) => {
  const userData = req.body;

  const user = new User(userData);

  try {
    await user.save();
    res.status(201).json({ message: 'User created successfully.', userId: user.userid });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create user.', error: err.message });
  }
});

// PUT update user by ID (protected, admin only)
router.put('/:id', authMiddleware.authenticateToken, authMiddleware.authorizeRole(['spv']), async (req, res) => {
  const userId = req.params.id;
  const userData = req.body;

  try {
    const user = await User.findOneAndUpdate({ userid: userId }, userData, { new: true });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.json({ message: 'User updated successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update user.', error: err.message });
  }
});


// DELETE user by ID (protected, admin only)
router.delete('/:id', authMiddleware.authenticateToken, authMiddleware.authorizeRole(['spv']), async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findOneAndDelete({ userid: userId });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.json({ message: 'User deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete user.', error: err.message });
  }
});

// POST login
router.post('/login', async (req, res) => {
  const { userid, password } = req.body;

  try {
    const user = await User.findOne({ userid });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password.' });
    }

    const payload = {
      userid: user.userid,
      role: user.role
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ message: 'Login successful!', token: token });
  } catch (err) {
    res.status(500).json({ message: 'Failed to authenticate.', error: err.message });
  }
});

module.exports = router;
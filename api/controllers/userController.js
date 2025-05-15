const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Fungsi untuk mengenkripsi password
const generateHashedPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
};

const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '30d', // Token expires in 30 days
    });
};

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
    const { userId, password } = req.body; // Use userId instead of email

    if (!userId || !password) {
        return res.status(400).json({ message: 'Please provide userId and password' });
    }

    try {
        const user = await User.findOne({ userId }).select('+password'); // Use userId instead of email

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = generateToken(user._id);

        res.status(200).json({
            message: 'Login successful',
            token: token,
            user: {
                userId: user.userId, // Send back userId
                role: user.role,
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Login failed' });
    }
};

// Middleware to protect routes
const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from the token
            req.user = await User.findById(decoded.userId).select('-password');

            next();
        } catch (error) {
            console.error('Error verifying token:', error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// @desc    Get all users
// @route   GET /api/users/manage/users
// @access  Private
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
};

// @desc    Get user by ID
// @route   GET /api/users/manage/users/:id
// @access  Private
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error(error.message);

        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(500).send('Server error');
    }
};

// @desc    Create a new user
// @route   POST /api/users/users
// @access  Private
const createUser = async (req, res) => {
    const { userId, password, role } = req.body;

    try {
        // Check if user exists
        let user = await User.findOne({ userId });

        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await generateHashedPassword(password);

        // Create user
        user = new User({
            userId,
            password: hashedPassword,
            role,
        });

        await user.save();

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
};

// @desc    Update user
// @route   PUT /api/users/manage/users/:id
// @access  Private
const updateUser = async (req, res) => {
    const { password, role } = req.body;

    try {
        let user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const updateFields = {};

        if (password) {
            updateFields.password = await generateHashedPassword(password);
        }
        if (role) updateFields.role = role;

        user = await User.findByIdAndUpdate(
            req.params.id,
            { $set: updateFields },
            { new: true }
        );

        res.status(200).json({ message: 'User updated successfully', user });
    } catch (error) {
        console.error(error.message);

        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(500).send('Server error');
    }
};

// @desc    Delete user
// @route   DELETE /api/users/manage/users/:id
// @access  Private
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await User.findByIdAndRemove(req.params.id);

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error(error.message);

        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(500).send('Server error');
    }
};

module.exports = {
    loginUser,
    protect,
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
};
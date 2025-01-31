const User = require('../models/User'); // Import User model

/**
 * @desc    Create a new user
 * @route   POST /api/users
 * @access  Public
 */
const createUser = async (req, res) => {
    try {
        const { firstname, lastname, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user
        const newUser = new User({ firstname, lastname, email, password });
        await newUser.save();

        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * @desc    Get all users
 * @route   GET /api/users
 * @access  Public
 */
const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { createUser, getUsers };

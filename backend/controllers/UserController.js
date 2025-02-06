const mongoose = require('mongoose');
const User = require('../models/User'); // Import User model

/**
 * @desc    Get all users
 * @route   GET /api/users
 * @access  Public
 */
const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        const totalUsers = await User.countDocuments();

        res.status(200).json({
            success: true,
            message: "Users fetched successfully",
            total: totalUsers,
            data: users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

/**
 * @desc    Create a new user
 * @route   POST /api/users
 * @access  Public
 */
const createUser = async (req, res) => {
    try {
        const { firstname, lastname, email, password, role } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }

        // Create new user
        const newUser = new User({ firstname, lastname, email, password, role });
        await newUser.save();

        res.status(201).json({
            success: true,
            message: "User created successfully",
            data: newUser
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

/**
 * @desc    Get a single user by ID
 * @route   GET /api/users/:id
 * @access  Public
 */
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid User ID format"
            });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "User fetched successfully",
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

/**
 * @desc    Update a user
 * @route   PUT /api/users/:id
 * @access  Public
 */
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { firstname, lastname, email, password, role } = req.body;

        // Validate the MongoDB ObjectId format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid User ID format"
            });
        }

        // Find user by ID and update
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { firstname, lastname, email, password, role },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: updatedUser
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

/**
 * @desc    Delete a user
 * @route   DELETE /api/users/:id
 * @access  Public
 */
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid User ID format"
            });
        }

        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "User deleted successfully",
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

module.exports = { createUser, getUsers, getUserById, updateUser, deleteUser };

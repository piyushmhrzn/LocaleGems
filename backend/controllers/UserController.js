const mongoose = require('mongoose');
const User = require('../models/User'); // Import User model
const authMiddleware = require('../middleware/authMiddleware'); // Import auth middleware

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
 * @access  Private
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
 * @access  Private (authenticated user only)
 */
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { firstname, lastname, email, phone, address, city, country } = req.body;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "Invalid User ID format" });
        }

        // Ensure the user can only update their own profile
        if (req.user !== id) {
            return res.status(403).json({ success: false, message: "Unauthorized to update this profile" });
        }

        // Update user
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { firstname, lastname, email, phone, address, city, country },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: updatedUser
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: "Email already exists" });
        }
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
 * @access  Private
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
        if (req.user !== id) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized to delete this profile"
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

module.exports = {
    getUsers, // Left public for now; adding authMiddleware if needed
    createUser, // Left public for now; adding authMiddleware if needed
    getUserById: [authMiddleware, getUserById],
    updateUser: [authMiddleware, updateUser],
    deleteUser: [authMiddleware, deleteUser]
};

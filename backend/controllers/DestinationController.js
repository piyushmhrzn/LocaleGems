const mongoose = require('mongoose');
const Destination = require('../models/Destination');

/**
 * @desc    Get all destinations
 * @route   GET /api/destinations
 * @access  Public
 */
exports.getDestinations = async (req, res) => {
    try {
        const destinations = await Destination.find();
        const totalDestinations = await Destination.countDocuments();

        res.status(200).json({
            success: true,
            message: "Destinations fetched successfully",
            total: totalDestinations,
            data: destinations
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
 * @desc    Get a single destination by ID
 * @route   GET /api/destinations/:id
 * @access  Public
 */
exports.getDestinationById = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Destination ID format"
            });
        }

        const destination = await Destination.findById(id);
        if (!destination) {
            return res.status(404).json({
                success: false,
                message: "Destination not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Destination fetched successfully",
            data: destination
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
 * @desc    Create a new destination
 * @route   POST /api/destinations
 * @access  Public
 */
exports.createDestination = async (req, res) => {
    try {
        const newDestination = new Destination(req.body);
        await newDestination.save();

        res.status(201).json({
            success: true,
            message: "Destination created successfully",
            data: newDestination
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Error creating destination",
            error: error.message
        });
    }
};

/**
 * @desc    Update an existing destination by ID
 * @route   PUT /api/destinations/:id
 * @access  Public
 */
exports.updateDestination = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Destination ID format"
            });
        }

        const updatedDestination = await Destination.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedDestination) {
            return res.status(404).json({
                success: false,
                message: "Destination not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Destination updated successfully",
            data: updatedDestination
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Error updating destination",
            error: error.message
        });
    }
};

/**
 * @desc    Delete a destination by ID
 * @route   DELETE /api/destinations/:id
 * @access  Public
 */
exports.deleteDestination = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Destination ID format"
            });
        }

        const deletedDestination = await Destination.findByIdAndDelete(id);
        if (!deletedDestination) {
            return res.status(404).json({
                success: false,
                message: "Destination not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Destination deleted successfully",
            data: deletedDestination
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting destination",
            error: error.message
        });
    }
};

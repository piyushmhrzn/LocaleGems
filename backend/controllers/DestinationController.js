const mongoose = require('mongoose');
const Destination = require('../models/Destination');
const authMiddleware = require('../middleware/authMiddleware'); // Import middleware

/**
 * @desc    Get destinations by limit and page
 * @route   GET /api/destinations
 * @access  Public
 */
exports.getDestinations = async (req, res) => {
    try {
        let { page = 1, limit = 3 } = req.query;
        page = parseInt(page);
        limit = parseInt(limit);

        const totalDestinations = await Destination.countDocuments();
        const destinations = await Destination.find()
            .skip((page - 1) * limit)
            .limit(limit);

        res.status(200).json({
            success: true,
            message: "Destinations fetched successfully",
            total: totalDestinations,
            page,
            totalPages: Math.ceil(totalDestinations / limit),
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
 * @desc    Get all destinations (admin only)
 * @route   GET /api/destinations/all
 * @access  Private (admin only)
 */
exports.getAllDestinations = async (req, res) => {
    try {
        const destinations = await Destination.find();
        const totalDestinations = await Destination.countDocuments();

        res.status(200).json({
            success: true,
            message: "All destinations fetched successfully",
            total: totalDestinations,
            data: destinations,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
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
        const { name, image, location, coordinates, city, country, short_description, long_description } = req.body;

        // Validate coordinates
        if (!coordinates || !Array.isArray(coordinates.coordinates) || coordinates.coordinates.length !== 2) {
            return res.status(400).json({
                success: false,
                message: "Coordinates must be an array of [longitude, latitude]"
            });
        }

        const newDestination = new Destination({
            name,
            image,
            location,
            coordinates: { type: "Point", coordinates: coordinates.coordinates }, // Ensure GeoJSON format
            city,
            country,
            short_description,
            long_description
        });
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
        const { coordinates } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Destination ID format"
            });
        }

        // Validate coordinates if provided
        if (coordinates && (!Array.isArray(coordinates.coordinates) || coordinates.coordinates.length !== 2)) {
            return res.status(400).json({
                success: false,
                message: "Coordinates must be an array of [longitude, latitude]"
            });
        }

        const updatedDestination = await Destination.findByIdAndUpdate(
            id,
            { ...req.body, ...(coordinates && { coordinates: { type: "Point", coordinates: coordinates.coordinates } }) },
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

module.exports = {
    getDestinations: exports.getDestinations,
    getAllDestinations: [authMiddleware, exports.getAllDestinations], // Admin-specific
    getDestinationById: exports.getDestinationById,
    createDestination: exports.createDestination,
    updateDestination: [authMiddleware, exports.updateDestination],
    deleteDestination: [authMiddleware, exports.deleteDestination],
};
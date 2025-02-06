const mongoose = require('mongoose');
const LocalBusiness = require('../models/Business');

/**
 * @desc    Get all local businesses
 * @route   GET /api/businesses
 * @access  Public
 */
exports.getBusinesses = async (req, res) => {
    try {
        const businesses = await LocalBusiness.find().populate('user_id');
        const totalBusinesses = await LocalBusiness.countDocuments();

        res.status(200).json({
            success: true,
            message: "Businesses fetched successfully",
            total: totalBusinesses,
            data: businesses
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
 * @desc    Get a single local business by ID
 * @route   GET /api/businesses/:id
 * @access  Public
 */
exports.getBusinessById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "Invalid Business ID format" });
        }

        const business = await LocalBusiness.findById(id).populate('user_id');
        if (!business) {
            return res.status(404).json({ success: false, message: "Business not found" });
        }

        res.status(200).json({
            success: true,
            message: "Business fetched successfully",
            data: business
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

/**
 * @desc    Create a new local business
 * @route   POST /api/businesses
 * @access  Public (Authentication can be added later)
 */
exports.createBusiness = async (req, res) => {
    try {
        const { user_id, name, type, location, city, country, proximity_to_destination } = req.body;
        if (!user_id || !name || !type || !location || !city || !country || !proximity_to_destination) {
            return res.status(400).json({ success: false, message: "All required fields must be provided" });
        }

        const newBusiness = new LocalBusiness(req.body);
        await newBusiness.save();

        res.status(201).json({
            success: true,
            message: "Business created successfully",
            data: newBusiness
        });
    } catch (error) {
        res.status(400).json({ success: false, message: "Error creating business", error: error.message });
    }
};

/**
 * @desc    Update an existing local business by ID
 * @route   PUT /api/businesses/:id
 * @access  Public
 */
exports.updateBusiness = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "Invalid Business ID format" });
        }

        const updatedBusiness = await LocalBusiness.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedBusiness) {
            return res.status(404).json({ success: false, message: "Business not found" });
        }

        res.status(200).json({
            success: true,
            message: "Business updated successfully",
            data: updatedBusiness
        });
    } catch (error) {
        res.status(400).json({ success: false, message: "Error updating business", error: error.message });
    }
};

/**
 * @desc    Delete a local business by ID
 * @route   DELETE /api/businesses/:id
 * @access  Public
 */
exports.deleteBusiness = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "Invalid Business ID format" });
        }

        const deletedBusiness = await LocalBusiness.findByIdAndDelete(id);
        if (!deletedBusiness) {
            return res.status(404).json({ success: false, message: "Business not found" });
        }

        res.status(200).json({
            success: true,
            message: "Business deleted successfully",
            data: deletedBusiness
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error deleting business", error: error.message });
    }
};

const mongoose = require('mongoose');
const Business = require('../models/Business');
const User = require('../models/User');
const axios = require('axios'); // For geocoding
const authMiddleware = require('../middleware/authMiddleware'); // Import middleware

/**
 * @desc    Create a new business
 * @route   POST /api/businesses
 * @access  Public
 */
const createBusiness = async (req, res) => {
    try {
        const {
            name,
            category,
            description,
            location,
            contactEmail,
            contactPhone,
            destination,
            proximity_to_destination,
        } = req.body;

        // Validate required fields
        if (!name || !category || !description || !location || !contactEmail || !contactPhone || !destination || !proximity_to_destination) {
            return res.status(400).json({
                success: false,
                message: "All required fields must be provided",
            });
        }

        // Validate destination_id
        if (!mongoose.Types.ObjectId.isValid(destination)) {
            return res.status(400).json({
                success: false,
                message: "Invalid destination ID",
            });
        }

        // Match user by email
        let user_id = null;
        const existingUser = await User.findOne({ email: contactEmail });
        if (existingUser) {
            user_id = existingUser._id;
        }

        // Optional Geocoding
        let coordinates = null;
        if (process.env.GOOGLE_MAPS_API_KEY) {
            try {
                const geoResponse = await axios.get(
                    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${process.env.GOOGLE_MAPS_API_KEY}`
                );
                if (geoResponse.data.status === "OK") {
                    const { lat, lng } = geoResponse.data.results[0].geometry.location;
                    coordinates = { type: "Point", coordinates: [lng, lat] };
                }
            } catch (geoError) {
                console.error("Geocoding error:", geoError.message);
            }
        }

        const newBusiness = new Business({
            user_id,
            name,
            category,
            description,
            location,
            contactEmail,
            contactPhone,
            destination_id: destination,
            proximity_to_destination,
            coordinates,
            status: 'pending',
        });

        const savedBusiness = await newBusiness.save(); // Move this to the outer try block

        res.status(201).json({
            success: true,
            message: "Business registered successfully. Waiting for verification",
            data: savedBusiness,
        });
    } catch (error) {
        console.error("Error in createBusiness:", error.message);
        res.status(500).json({
            success: false,
            message: "Business registration failed",
            error: error.message, // send the real reason to frontend
        });
    }
};


/**
 * @desc    Get businesses for the authenticated user
 * @route   GET /api/businesses
 * @access  Private (authenticated users only)
 */
const getBusinesses = async (req, res) => {
    try {
        // Get user_id from authenticated user (set by authMiddleware)
        const userId = req.user; // From JWT payload via authMiddleware
        const filter = { user_id: userId }; //  Only fetch businesses owned by this user

        const businesses = await Business.find(filter).populate('destination_id', 'name city country');
        const totalBusinesses = await Business.countDocuments(filter);

        res.status(200).json({
            success: true,
            message: "Businesses fetched successfully",
            total: totalBusinesses,
            data: businesses,
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
 * @desc    Get all businesses (admin only)
 * @route   GET /api/businesses/all
 * @access  Private (admin only)
 */
const getAllBusinesses = async (req, res) => {
    try {
        const businesses = await Business.find().populate('destination_id', 'name city country');
        const totalBusinesses = await Business.countDocuments();

        res.status(200).json({
            success: true,
            message: "All businesses fetched successfully",
            total: totalBusinesses,
            data: businesses,
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
 * @desc    Get a single business by ID
 * @route   GET /api/businesses/:id
 * @access  Public
 */
const getBusinessById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Business ID format",
            });
        }

        const business = await Business.findById(id).populate('destination_id', 'name city country');
        if (!business) {
            return res.status(404).json({
                success: false,
                message: "Business not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Business fetched successfully",
            data: business,
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
 * @desc    Update a business
 * @route   PUT /api/businesses/:id
 * @access  Private
 */
const updateBusiness = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            name,
            category,
            description,
            location,
            city,
            country,
            contactEmail,
            contactPhone,
            destination_id,
            proximity_to_destination,
            website,
            businessHours,
            image,
        } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Business ID format",
            });
        }

        // Optional: Geocode updated location
        let coordinates = null;
        if (location) {
            try {
                const geoResponse = await axios.get(
                    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${process.env.GOOGLE_MAPS_API_KEY}`
                );
                const { lat, lng } = geoResponse.data.results[0].geometry.location;
                coordinates = { type: "Point", coordinates: [lng, lat] };
            } catch (geoError) {
                console.error("Geocoding failed:", geoError.message);
            }
        }

        const updatedBusiness = await Business.findByIdAndUpdate(
            id,
            {
                name,
                category,
                description,
                location,
                city,
                country,
                contactEmail,
                contactPhone,
                destination_id,
                proximity_to_destination,
                website,
                businessHours,
                image,
                coordinates,
            },
            { new: true, runValidators: true }
        );

        if (!updatedBusiness) {
            return res.status(404).json({
                success: false,
                message: "Business not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Business updated successfully",
            data: updatedBusiness,
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
 * @desc    Delete a business
 * @route   DELETE /api/businesses/:id
 * @access  Private
 */
const deleteBusiness = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Business ID format",
            });
        }

        const business = await Business.findByIdAndDelete(id);
        if (!business) {
            return res.status(404).json({
                success: false,
                message: "Business not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Business deleted successfully",
            data: business,
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
 * @desc    Update business status (admin only)
 * @route   PUT /api/businesses/:id/status
 * @access  Private (admin only)
 */
const updateBusinessStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Business ID format",
            });
        }

        if (!['pending', 'approved', 'rejected'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status value. Must be 'pending', 'approved', or 'rejected'",
            });
        }

        const updatedBusiness = await Business.findByIdAndUpdate(
            id,
            { status },
            { new: true, runValidators: true }
        );

        if (!updatedBusiness) {
            return res.status(404).json({
                success: false,
                message: "Business not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Business status updated successfully",
            data: updatedBusiness,
        });
    } catch (error) {
        console.error("Error in updateBusinessStatus:", error.message);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};


module.exports = {
    createBusiness,
    getBusinesses: [authMiddleware, getBusinesses],
    getAllBusinesses,
    getBusinessById,
    updateBusiness: [authMiddleware, updateBusiness],
    updateBusinessStatus: [authMiddleware, updateBusinessStatus],
    deleteBusiness: [authMiddleware, deleteBusiness],
};
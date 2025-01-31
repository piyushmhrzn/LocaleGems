const LocalBusiness = require('../models/Business');

/**
 * @desc Get all local businesses
 * @route GET /api/businesses
 * @access Public
 */
exports.getBusinesses = async (req, res) => {
    try {
        const businesses = await LocalBusiness.find().populate('user_id');
        res.json(businesses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * @desc Create a new local business
 * @route POST /api/businesses
 * @access Public (Authentication can be added later)
 */
exports.createBusiness = async (req, res) => {
    try {
        const newBusiness = new LocalBusiness(req.body);
        await newBusiness.save();
        res.status(201).json(newBusiness);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

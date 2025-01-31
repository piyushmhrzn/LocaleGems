const Destination = require('../models/Destination');

/**
 * @desc Get all destinations
 * @route GET /api/destinations
 * @access Public
 */
exports.getDestinations = async (req, res) => {
    try {
        const destinations = await Destination.find();
        res.json(destinations);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * @desc Create a new destination
 * @route POST /api/destinations
 * @access Public
 */
exports.createDestination = async (req, res) => {
    try {
        const newDestination = new Destination(req.body);
        await newDestination.save();
        res.status(201).json(newDestination);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

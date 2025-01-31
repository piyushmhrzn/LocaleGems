const Event = require('../models/Event');

/**
 * @desc Get all events
 * @route GET /api/events
 * @access Public
 */
exports.getEvents = async (req, res) => {
    try {
        const events = await Event.find().populate('destination_id user_id');
        res.json(events);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * @desc Create a new event
 * @route POST /api/events
 * @access Public
 */
exports.createEvent = async (req, res) => {
    try {
        const newEvent = new Event(req.body);
        await newEvent.save();
        res.status(201).json(newEvent);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

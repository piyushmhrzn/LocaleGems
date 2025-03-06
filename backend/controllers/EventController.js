const mongoose = require('mongoose');
const Event = require('../models/Event');

/**
 * @desc    Get all events
 * @route   GET /api/events
 * @access  Public
 */
exports.getEvents = async (req, res) => {
    try {
        let { search, location } = req.query;
        let filter = {};

        if (search && location) {
            // If both search and location are provided, match events that satisfy both
            filter = {
                $and: [
                    {
                        $or: [
                            { name: { $regex: search, $options: "i" } },
                            { location: { $regex: search, $options: "i" } }
                        ]
                    },
                    { location: { $regex: location, $options: "i" } }
                ]
            };
        } else if (search) {
            // If only search is provided
            filter = {
                $or: [
                    { name: { $regex: search, $options: "i" } },
                    { location: { $regex: search, $options: "i" } }
                ]
            };
        } else if (location) {
            // If only location is provided
            filter.location = { $regex: location, $options: "i" };
        }

        // Fetch events with filters
        const events = await Event.find(filter).populate("destination_id user_id");

        res.status(200).json({
            success: true,
            message: "Events fetched successfully",
            total: events.length,
            data: events,
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
 * @desc    Get a single event by ID
 * @route   GET /api/events/:id
 * @access  Public
 */
exports.getEventById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Event ID format"
            });
        }

        const event = await Event.findById(id).populate('destination_id user_id');
        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Event fetched successfully",
            data: event
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
 * @desc    Create a new event
 * @route   POST /api/events
 * @access  Public
 */
exports.createEvent = async (req, res) => {
    try {
        const newEvent = new Event(req.body);
        await newEvent.save();

        res.status(201).json({
            success: true,
            message: "Event created successfully",
            data: newEvent
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Error creating event",
            error: error.message
        });
    }
};

/**
 * @desc    Update an event by ID
 * @route   PUT /api/events/:id
 * @access  Public
 */
exports.updateEvent = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Event ID format"
            });
        }

        const updatedEvent = await Event.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedEvent) {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Event updated successfully",
            data: updatedEvent
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Error updating event",
            error: error.message
        });
    }
};

/**
 * @desc    Delete an event by ID
 * @route   DELETE /api/events/:id
 * @access  Public
 */
exports.deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Event ID format"
            });
        }

        const deletedEvent = await Event.findByIdAndDelete(id);
        if (!deletedEvent) {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Event deleted successfully",
            data: deletedEvent
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting event",
            error: error.message
        });
    }
};

const express = require('express');
const { getEvents, createEvent } = require('../controllers/EventController');

const router = express.Router();

/**
 * @route GET /api/events
 * @desc Fetch all events
 */
router.get('/', getEvents);

/**
 * @route POST /api/events
 * @desc Create a new event
 */
router.post('/', createEvent);

module.exports = router;

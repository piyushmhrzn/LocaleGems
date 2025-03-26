const express = require('express');
const { getEvents, createEvent, getEventById, updateEvent, deleteEvent, searchEvents } = require('../controllers/EventController');

const router = express.Router();

/**
 * @route GET /api/events
 * @desc Get all events
 */
router.get('/', getEvents);

/**
 * @route GET /api/events/all
 * @desc Get all events
 */
router.get('/all', getEvents);

/**
 * @route POST /api/events
 * @desc Create a new event
 */
router.post('/', createEvent);

/**
 * @route GET /api/events/search
 * @desc Search an event
 */
router.get('/search', searchEvents);

/**
 * @route GET /api/events/:id
 * @desc Get a single event by ID
 */
router.get('/:id', getEventById);

/**
 * @route PUT /api/events/:id
 * @desc Update an event by ID
 */
router.put('/:id', updateEvent);

/**
 * @route DELETE /api/events/:id
 * @desc Delete an event by ID
 */
router.delete('/:id', deleteEvent);

module.exports = router;

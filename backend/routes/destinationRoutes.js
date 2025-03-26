const express = require('express');
const { getDestinations, getAllDestinations, getDestinationById, createDestination, updateDestination, deleteDestination, searchDestinations } = require('../controllers/DestinationController');

const router = express.Router();

/**
 * @route   GET /api/destinations
 * @desc    Fetch all destinations by page
 * @access  Public
 */
router.get('/', getDestinations);

/**
 * @route   POST /api/destinations
 * @desc    Create a new destination
 * @access  Public
 */
router.post('/', createDestination);

/**
 * @route   GET /api/destinations
 * @desc    Fetch all destinations 
 * @access  Private (admin only)
 */
router.get('/all', getAllDestinations); // Admin-specific

/**
 * @route GET /api/destinations/search
 * @desc Search a destination
 */
router.get('/search', searchDestinations);

/**
 * @route   GET /api/destinations/:id
 * @desc    Fetch a single destination by ID
 * @access  Public
 */
router.get('/:id', getDestinationById);

/**
 * @route   PUT /api/destinations/:id
 * @desc    Update an existing destination by ID
 * @access  Public
 */
router.put('/:id', updateDestination);

/**
 * @route   DELETE /api/destinations/:id
 * @desc    Delete a destination by ID
 * @access  Public
 */
router.delete('/:id', deleteDestination);

module.exports = router;

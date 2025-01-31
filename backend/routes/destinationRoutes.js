const express = require('express');
const { getDestinations, createDestination } = require('../controllers/DestinationController');

const router = express.Router();

/**
 * @route GET /api/destinations
 * @desc Fetch all destinations
 */
router.get('/', getDestinations);

/**
 * @route POST /api/destinations
 * @desc Create a new destination
 */
router.post('/', createDestination);

module.exports = router;

const express = require('express');
const { getBusinesses, getBusinessById, createBusiness, updateBusiness, deleteBusiness } = require('../controllers/LocalBusinessController');

const router = express.Router();

/**
 * @route   GET /api/businesses
 * @desc    Get all local businesses
 */
router.get('/', getBusinesses);

/**
 * @route   GET /api/businesses/:id
 * @desc    Get a single local business by ID
 */
router.get('/:id', getBusinessById);

/**
 * @route   POST /api/businesses
 * @desc    Create a new local business
 */
router.post('/', createBusiness);

/**
 * @route   PUT /api/businesses/:id
 * @desc    Update a local business by ID
 */
router.put('/:id', updateBusiness);

/**
 * @route   DELETE /api/businesses/:id
 * @desc    Delete a local business by ID
 */
router.delete('/:id', deleteBusiness);

module.exports = router;

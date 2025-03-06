const express = require('express');
const { getBusinesses, getAllBusinesses, getBusinessById, createBusiness, updateBusiness, updateBusinessStatus, deleteBusiness } = require('../controllers/LocalBusinessController');

const router = express.Router();

/**
 * @route   GET /api/businesses
 * @desc    Get local businesse for one owner
 */
router.get('/', getBusinesses);

/**
 * @route   GET /api/businesses/all
 * @desc    Get all businesse
 */
router.get('/all', getAllBusinesses);

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
 * @route   PUT /api/businesses/:id/status
 * @desc    Update a local business status (for admin only)
 */
router.put('/:id/status', updateBusinessStatus);

/**
 * @route   DELETE /api/businesses/:id
 * @desc    Delete a local business by ID
 */
router.delete('/:id', deleteBusiness);

module.exports = router;

const express = require('express');
const { getBusinesses, createBusiness } = require('../controllers/LocalBusinessController');

const router = express.Router();

/**
 * @route GET /api/businesses
 * @desc Get all local businesses
 */
router.get('/', getBusinesses);

/**
 * @route POST /api/businesses
 * @desc Create a new local business
 */
router.post('/', createBusiness);

module.exports = router;

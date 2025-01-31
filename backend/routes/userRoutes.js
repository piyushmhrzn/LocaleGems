const express = require('express');
const { getUsers, createUser } = require('../controllers/UserController');

const router = express.Router();

/**
 * @route GET /api/users
 * @desc Fetch all users
 */
router.get('/', getUsers);

/**
 * @route POST /api/users
 * @desc Create a new user
 */
router.post('/', createUser);

module.exports = router;

const express = require('express');
const { getUsers, getAllUsers, getUserById, createUser, updateUser, deleteUser } = require('../controllers/UserController');
const upload = require('../middleware/uploadMiddleware');
const authMiddleware = require('../middleware/authMiddleware'); // Assuming you have this

const router = express.Router();

/**
 * @route GET /api/users
 * @desc Fetch all users
 */
router.get('/', getUsers);

/**
 * @route GET /api/users/all
 * @desc Fetch all users
 */
router.get('/all', getUsers);

/**
 * @route GET /api/users/:id
 * @desc Fetch user by ID
 */
router.get('/:id', getUserById);

/**
 * @route POST /api/users
 * @desc Create a new user
 */
router.post('/', createUser);

/**
 * @route PUT /api/users/:id
 * @desc Update user details (with optional image upload)
 */
router.put('/:id', authMiddleware, upload.single('image'), updateUser);

/**
 * @route DELETE /api/users/:id
 * @desc Delete a user
 */
router.delete('/:id', deleteUser);

module.exports = router;
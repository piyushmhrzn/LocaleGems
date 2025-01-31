const express = require('express');
const { getBlogs, createBlog } = require('../controllers/BlogController');

const router = express.Router();

/**
 * @route GET /api/blogs
 * @desc Get all blogs
 */
router.get('/', getBlogs);

/**
 * @route POST /api/blogs
 * @desc Create a new blog
 */
router.post('/', createBlog);

module.exports = router;

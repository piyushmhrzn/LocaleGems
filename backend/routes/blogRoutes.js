const express = require('express');
const { getBlogs, createBlog, getBlogById, updateBlog, deleteBlog, searchBlogs } = require('../controllers/BlogController');

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

/**
 * @route GET /api/blogs/search
 * @desc Search a blog
 */
router.get('/search', searchBlogs);

/**
 * @route GET /api/blogs/:id
 * @desc Get a single blog by ID
 */
router.get('/:id', getBlogById);

/**
 * @route PUT /api/blogs/:id
 * @desc Update a blog by ID
 */
router.put('/:id', updateBlog);

/**
 * @route DELETE /api/blogs/:id
 * @desc Delete a blog by ID
 */
router.delete('/:id', deleteBlog);

module.exports = router;

const Blog = require('../models/Blog');

/**
 * @desc Get all blogs
 * @route GET /api/blogs
 * @access Public
 */
exports.getBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find().populate('user_id');
        res.json(blogs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * @desc Create a new blog
 * @route POST /api/blogs
 * @access Public (Authentication can be added later)
 */
exports.createBlog = async (req, res) => {
    try {
        const newBlog = new Blog(req.body);
        await newBlog.save();
        res.status(201).json(newBlog);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

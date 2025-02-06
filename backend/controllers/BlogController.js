const mongoose = require('mongoose');
const Blog = require('../models/Blog');

/**
 * @desc    Get all blogs
 * @route   GET /api/blogs
 * @access  Public
 */
exports.getBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find().populate('user_id');
        const totalBlogs = await Blog.countDocuments();

        res.status(200).json({
            success: true,
            message: "Blogs fetched successfully",
            total: totalBlogs,
            data: blogs
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

/**
 * @desc    Get a single blog by ID
 * @route   GET /api/blogs/:id
 * @access  Public
 */
exports.getBlogById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Blog ID format"
            });
        }

        const blog = await Blog.findById(id).populate('user_id');
        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Blog fetched successfully",
            data: blog
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

/**
 * @desc    Create a new blog
 * @route   POST /api/blogs
 * @access  Public (Authentication can be added later)
 */
exports.createBlog = async (req, res) => {
    try {
        const newBlog = new Blog(req.body);
        await newBlog.save();

        res.status(201).json({
            success: true,
            message: "Blog created successfully",
            data: newBlog
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Error creating blog",
            error: error.message
        });
    }
};

/**
 * @desc    Update a blog by ID
 * @route   PUT /api/blogs/:id
 * @access  Public
 */
exports.updateBlog = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Blog ID format"
            });
        }

        const updatedBlog = await Blog.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedBlog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Blog updated successfully",
            data: updatedBlog
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Error updating blog",
            error: error.message
        });
    }
};

/**
 * @desc    Delete a blog by ID
 * @route   DELETE /api/blogs/:id
 * @access  Public
 */
exports.deleteBlog = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Blog ID format"
            });
        }

        const deletedBlog = await Blog.findByIdAndDelete(id);
        if (!deletedBlog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Blog deleted successfully",
            data: deletedBlog
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting blog",
            error: error.message
        });
    }
};

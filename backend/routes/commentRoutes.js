const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, async (req, res) => {
    const { destination_id, event_id, comment } = req.body;
    try {
        const newComment = new Comment({
            user_id: req.user,
            destination_id: destination_id || null,
            event_id: event_id || null,
            comment,
        });
        await newComment.save();
        res.status(201).json({
            success: true,
            message: 'Comment submitted'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error submitting comment',
            error
        });
    }
});

router.get('/destination/:id', async (req, res) => {
    try {
        const comments = await Comment.find({ destination_id: req.params.id }).populate('user_id', 'firstname lastname image');
        res.status(200).json({
            success: true,
            data: comments
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching comments',
            error
        });
    }
});

router.get('/event/:id', async (req, res) => {
    try {
        const comments = await Comment.find({ event_id: req.params.id }).populate('user_id', 'firstname lastname image');
        res.status(200).json({
            success: true,
            data: comments
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching comments',
            error
        });
    }
});

module.exports = router;
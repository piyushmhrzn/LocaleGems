const express = require('express');
const router = express.Router();
const Rating = require('../models/Rating');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, async (req, res) => {
    const { destination_id, event_id, rating } = req.body;
    try {
        const newRating = new Rating({
            user_id: req.user, // From authMiddleware
            destination_id: destination_id || null,
            event_id: event_id || null,
            rating,
        });
        await newRating.save();
        res.status(201).json({
            success: true,
            message: 'Rating submitted'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error submitting rating',
            error
        });
    }
});

router.get('/destination/:id', async (req, res) => {
    try {
        const ratings = await Rating.find({ destination_id: req.params.id }).populate('user_id', 'firstname lastname image');
        res.status(200).json({
            success: true,
            data: ratings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching ratings',
            error
        });
    }
});

router.get('/event/:id', async (req, res) => {
    try {
        const ratings = await Rating.find({ event_id: req.params.id }).populate('user_id', 'firstname lastname image');
        res.status(200).json({
            success: true,
            data: ratings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching ratings',
            error
        });
    }
});

module.exports = router;
const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    destination_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Destination' }, // Optional for events
    event_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' }, // Optional for destinations
    rating: { type: Number, required: true, min: 1, max: 5 },
    created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Rating', ratingSchema);
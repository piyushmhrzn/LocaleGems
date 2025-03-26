const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    destination_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Destination' }, // Optional for events
    event_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' }, // Optional for destinations
    comment: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Comment', commentSchema);
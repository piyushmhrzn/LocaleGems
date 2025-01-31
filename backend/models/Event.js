const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    image: { type: String },
    destination_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Destination', required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Event', EventSchema);
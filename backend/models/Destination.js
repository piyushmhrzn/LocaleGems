const mongoose = require('mongoose');

const DestinationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String },
    location: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    short_description: { type: String, required: true },
    long_description: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Destination', DestinationSchema);
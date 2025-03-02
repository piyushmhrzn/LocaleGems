const mongoose = require('mongoose');

const DestinationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String },
    location: { type: String, required: true }, // Keep as place name (e.g., "New York City")
    coordinates: {
        type: { type: String, enum: ['Point'], default: 'Point' }, // For geospatial queries
        coordinates: { type: [Number], required: true } // [lng, lat] format
    },
    city: { type: String, required: true },
    country: { type: String, required: true },
    short_description: { type: String, required: true },
    long_description: { type: String, required: true },
}, { timestamps: true });

// Add 2dsphere index for geospatial queries
DestinationSchema.index({ coordinates: '2dsphere' });

module.exports = mongoose.model('Destination', DestinationSchema);
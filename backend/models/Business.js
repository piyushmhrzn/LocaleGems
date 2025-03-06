const mongoose = require('mongoose');

const BusinessSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    name: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String },
    type: { type: String },
    location: { type: String, required: true },
    website: { type: String },
    contactEmail: { type: String, required: true },
    contactPhone: { type: String, required: true },
    businessHours: { type: String },
    city: { type: String },
    country: { type: String },
    logo: { type: String },
    destination_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Destination',
        required: true
    },
    proximity_to_destination: { type: Number, required: true },
    coordinates: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number] } // Optional ([lng, lat] format)
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
        required: true
    },
}, { timestamps: true });

BusinessSchema.index({ coordinates: '2dsphere' });

const Business = mongoose.model("Business", BusinessSchema);
module.exports = Business;
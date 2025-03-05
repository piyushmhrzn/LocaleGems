const mongoose = require('mongoose');

const BusinessSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String },
    type: { type: String, required: true },
    location: { type: String, required: true },
    website: { type: String },
    contactEmail: { type: String, required: true },
    contactPhone: { type: String, required: true },
    businessHours: { type: String },
    city: { type: String, required: true },
    country: { type: String, required: true },
    logo: { type: String },
    proximity_to_destination: { type: Number, required: true }, // in km or meters
}, { timestamps: true });

const Business = mongoose.model("Business", BusinessSchema);
module.exports = Business;
const mongoose = require('mongoose');

const LocalBusinessSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    image: { type: String },
    type: { type: String, required: true },
    location: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    proximity_to_destination: { type: Number, required: true }, // in km or meters
}, { timestamps: true });

module.exports = mongoose.model('LocalBusiness', LocalBusinessSchema);
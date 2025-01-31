const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    image: { type: String },
    role: { type: String, enum: ['admin', 'owner', 'user'], default: 'user' },
    status: { type: Number, enum: [0, 1], default: 1 },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
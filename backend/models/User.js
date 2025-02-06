const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
    {
        firstname: { type: String, required: true },
        lastname: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true }, // Encrypted password
        phone: { type: String },
        address: { type: String },
        city: { type: String },
        country: { type: String },
        image: { type: String },
        role: {
            type: String,
            enum: ['admin', 'owner', 'user'],
            default: 'user',
            required: true
        },
        status: { type: Number, enum: [0, 1], default: 1 },
    },
    { timestamps: true }
);

/**
 * 🔒 Hash password before saving user
 */
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next(); // Skip if password is not modified
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

/**
 * 🔐 Method to compare entered password with stored hashed password
 */
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);

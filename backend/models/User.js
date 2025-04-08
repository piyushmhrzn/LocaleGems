const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
    {
        firstname: {
            type: String,
            required: [true, 'First name is required'],
            trim: true, // Remove leading or trailing whitespace
            minlength: [2, 'First name must be at least 2 characters long'],
            maxlength: [50, 'First name cannot exceed 50 characters'],
        },
        lastname: {
            type: String,
            required: [true, 'Last name is required'],
            trim: true,
            minlength: [2, 'Last name must be at least 2 characters long'],
            maxlength: [50, 'Last name cannot exceed 50 characters'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            trim: true,
            lowercase: true,
            match: [
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                'Please provide a valid email address',
            ],
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [6, 'Password must be at least 6 characters long'],
            maxlength: [128, 'Password cannot exceed 128 characters'],
            validate: {
                validator: function (value) {
                    // Require at least one uppercase, one lowercase, one number, and one special character
                    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/.test(value);
                },
                message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*)',
            },
        },
        phone: {
            type: String,
            trim: true,
            match: [
                /^\+?[\d\s-]{7,15}$/,
                'Phone number must be between 7 and 15 digits, optionally with spaces, dashes, or a leading +',
            ],
        },
        address: {
            type: String,
            trim: true,
            maxlength: [200, 'Address cannot exceed 200 characters'],
        },
        city: {
            type: String,
            trim: true,
            maxlength: [100, 'City cannot exceed 100 characters'],
        },
        country: {
            type: String,
            trim: true,
            maxlength: [100, 'Country cannot exceed 100 characters'],
        },
        image: {
            type: String,
            trim: true,
            match: [
                /^(https?:\/\/[^\s]+)?$/,
                'Image must be a valid URL or empty',
            ],
        },
        role: {
            type: String,
            enum: {
                values: ['admin', 'owner', 'user'],
                message: 'Role must be one of: admin, owner, user',
            },
            default: 'user',
            required: [true, 'Role is required'],
        },
        status: {
            type: Number,
            enum: {
                values: [0, 1],
                message: 'Status must be 0 (inactive) or 1 (active)',
            },
            default: 1,
        },
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
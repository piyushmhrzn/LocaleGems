const mongoose = require('mongoose');

// User Schema
const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    address: { type: String },
    password: { type: String, required: true },
    bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }]
});

// Event Schema
const EventSchema = new mongoose.Schema({
    name: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String },
    tickets: { type: Number, default: 0 },
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

// Destination Schema
const DestinationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String },
    history: { type: String },
    businessesNearby: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Business' }]
});

// Business Schema
const BusinessSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    location: { type: String, required: true },
    contact: { type: String },
    distanceFromEvent: { type: Number }
});


// Create Models
const User = mongoose.model('User', UserSchema);
const Event = mongoose.model('Event', EventSchema);
const Destination = mongoose.model('Destination', DestinationSchema);
const Business = mongoose.model('Business', BusinessSchema);
const Blog = mongoose.model('Blog', BlogSchema);

// Blog Schema
const BlogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
});




// Export Models
module.exports = { User, Event, Destination, Business, Blog };

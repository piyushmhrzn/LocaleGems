const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');

dotenv.config(); // Load environment variables from .env file

const app = express();
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse JSON request bodies
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Create uploads folder if it doesn’t exist
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

// Getting the port from .env file
const PORT = process.env.PORT || 3000;

// Nodemailer transporter setup (using Gmail SMTP)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// ✅ Import all route files
const UserRoutes = require('./routes/userRoutes');
const DestinationRoutes = require('./routes/destinationRoutes');
const EventRoutes = require('./routes/eventRoutes');
const LocalBusinessRoutes = require('./routes/localBusinessRoutes');
const BlogRoutes = require('./routes/blogRoutes');
const AuthRoutes = require('./routes/authRoutes');
const RatingRoutes = require('./routes/ratingRoutes');
const CommentRoutes = require('./routes/commentRoutes');

// ✅ Register route middlewares with their respective endpoints
app.use('/api/users', UserRoutes);
app.use('/api/destinations', DestinationRoutes);
app.use('/api/events', EventRoutes);
app.use('/api/businesses', LocalBusinessRoutes);
app.use('/api/blogs', BlogRoutes);
app.use('/api/auth', AuthRoutes);
app.use('/api/ratings', RatingRoutes);
app.use('/api/comments', CommentRoutes);

// Newsletter subscription route with email sending
app.post('/api/newsletter/subscribe', async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ success: false, message: "Email is required" });
    }

    // Email options
    const mailOptions = {
        from: process.env.EMAIL_USER, // Sender address
        to: email, // Subscriber's email
        subject: "Welcome to LocaleGems Newsletter!",
        text: `
            Thank you for subscribing to LocaleGems!
            Stay tuned for the latest updates on destinations, events, and travel tips straight to your inbox.
            Explore hidden gems and local experiences with us!
            - The LocaleGems Team
        `,
        html: `
            <h3>Thank You for Subscribing to LocaleGems!</h3>
            <p>Stay tuned for the latest updates on destinations, events, and travel tips straight to your inbox.</p>
            <p>Explore hidden gems and local experiences with us!</p>
            <p>- The LocaleGems Team</p>
        `,
    };

    try {
        // Send email
        await transporter.sendMail(mailOptions);
        console.log(`New newsletter subscription: ${email} - Email sent successfully`);
        res.status(200).json({ success: true, message: "Subscribed successfully" });
    } catch (error) {
        console.error(`Error sending email to ${email}:`, error);
        res.status(500).json({ success: false, message: "Failed to subscribe" });
    }
});

// ✅ Default root route
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Welcome to LocaleGems API!' });
});

// ✅ Connect to MongoDB database
mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('✅ MongoDB connected successfully.'))
    .catch((err) => {
        console.error('❌ Error connecting to MongoDB:', err.message);
        process.exit(1); // Exit process with failure
    });

// ✅ Global error-handling middleware
app.use((err, req, res, next) => {
    console.error('🚨 Unhandled Error:', err.message);
    res.status(500).json({
        error: 'An unexpected error occurred on the server.',
        details: err.message,
    });
});

// ✅ Start the Express server
app.listen(PORT, () => console.log(`🚀 Server live on port:${PORT}`));
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config(); // Load environment variables from .env file

const app = express();
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse JSON request bodies

// Getting the port from .env file
const PORT = process.env.PORT || 3000; 

// ✅ Import all route files
const UserRoutes = require('./routes/userRoutes');
const DestinationRoutes = require('./routes/destinationRoutes');
const EventRoutes = require('./routes/eventRoutes');
const LocalBusinessRoutes = require('./routes/localBusinessRoutes');
const BlogRoutes = require('./routes/blogRoutes');

// ✅ Register route middlewares with their respective endpoints
app.use('/api/users', UserRoutes); 
app.use('/api/destinations', DestinationRoutes);
app.use('/api/events', EventRoutes);
app.use('/api/businesses', LocalBusinessRoutes); 
app.use('/api/blogs', BlogRoutes); 

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
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));

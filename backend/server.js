const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');



dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('MongoDB connected successfully.'))
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err.message);
        process.exit(1); // Exit process with failure
    });


// Basic route
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Welcome to the API!' });
});


// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled Error:', err.message);
    res.status(500).json({
        error: 'An unexpected error occurred on the server.',
        details: err.message,
    });
});

// Start the server
app.listen(PORT, () =>
    console.log(`Server running on port: http://localhost:${PORT}`)
);

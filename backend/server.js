const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // To handle Cross-Origin Resource Sharing
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
const connectDB = async () => {
    try {
        const MONGODB_URI = process.env.MONGODB_URI;
        if (!MONGODB_URI) {
            throw new Error('MONGODB_URI is not defined in environment variables');
        }
        await mongoose.connect(MONGODB_URI);
        console.log('MongoDB connected.');
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        console.error('Exiting application due to database connection failure.');
        process.exit(1);
    }
};
connectDB();

// Define a simple route
app.get('/', (req, res) => {
    res.send('Family Chore Tracker API');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
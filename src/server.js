// connect-pharma-api/server.js

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { connectDB } = require('./config/firebase_config');

// Initialize Firebase and get the Firestore instance
// Must happen BEFORE requiring routes/services
const db = connectDB();
if (!db) {
    console.error("Cannot start server: Database connection failed.");
    process.exit(1);
}

// Route Imports
const authRoutes = require('./routes/authRoutes');
const requestRoutes = require('./routes/requestRoutes');
const profileRoutes = require('./routes/profileRoutes');
const recordRoutes = require('./routes/recordRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/records', recordRoutes);

app.get('/', (req, res) => {
    res.send('Connect Pharma API is running...');
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => console.log('🚀 Server running on port ' + PORT));

// Handle server errors (like Port already in use)
server.on('error', (err) => {
    console.error('❌ Server startup error:', err.message);
    if (err.code === 'EADDRINUSE') {
        process.exit(1);
    }
});

// Catch silent crashes
process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
    console.error('❌ Uncaught Exception:', err);
    process.exit(1);
});
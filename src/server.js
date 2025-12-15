// connect-pharma-api/server.js

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/firebaseConfig');

// Route Imports
const authRoutes = require('./routes/authRoutes');
const requestRoutes = require('./routes/requestRoutes');
const profileRoutes = require('./routes/profileRoutes');
const recordRoutes = require('./routes/recordRoutes');

// Initialize Firebase and get the Firestore instance
const db = connectDB(); 
if (!db) {
    console.error("Cannot start server: Database connection failed.");
    process.exit(1);
}

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
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
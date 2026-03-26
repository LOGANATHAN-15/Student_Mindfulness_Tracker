const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const setupReminders = require('./services/reminderService');

dotenv.config();

const authRoutes = require('./routes/authRoutes');
const activityRoutes = require('./routes/activityRoutes');
const adminRoutes = require('./routes/adminRoutes');
const streakRoutes = require('./routes/streakRoutes');
const journalRoutes = require('./routes/journalRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Set Mongoose options for better error handling
mongoose.set('strictQuery', false);
// Disable buffering everywhere to prevent the 10s hang
mongoose.set('bufferCommands', false); 
mongoose.plugin((schema) => { schema.set('bufferCommands', false); });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/streaks', streakRoutes);
app.use('/api/journals', journalRoutes);

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('✅ MongoDB connected successfully');
        
        // Start Reminder Service
        setupReminders();

        // Start the server ONLY after the database is connected
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('❌ MongoDB connection error:');
        console.error(err.message);
        console.log('Double-check your password in .env and ensure your IP is whitelisted in MongoDB Atlas.');
    });

// Basic Route
app.get('/', (req, res) => {
    res.send('Mindfulness Tracker API is running');
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// No changes needed here, app.listen has been moved up into the .then() block
// to ensure the DB is ready before we accept requests.


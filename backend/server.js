const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
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

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/streaks', streakRoutes);
app.use('/api/journals', journalRoutes);

// Static File Serving (Production)
// We look for the frontend build in the parent's frontend directory
const frontendPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendPath));

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

// Handle SPA Routing (Catch-all)
// This MUST be after all API routes and static file middleware
app.get('*', (req, res) => {
    // Only serve index.html for non-API routes
    if (!req.path.startsWith('/api')) {
        res.sendFile(path.join(frontendPath, 'index.html'));
    } else {
        res.status(404).json({ message: 'API route not found' });
    }
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

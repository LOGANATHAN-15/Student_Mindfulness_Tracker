const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Activity = require('../models/Activity');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/users', protect, admin, async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/stats', protect, admin, async (req, res) => {
    try {
        const totalActivities = await Activity.countDocuments();
        const totalUsers = await User.countDocuments();

        // Simple aggregation for activity types
        const typeStats = await Activity.aggregate([
            { $group: { _id: "$type", count: { $sum: 1 } } }
        ]);

        res.json({
            totalActivities,
            totalUsers,
            typeStats
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

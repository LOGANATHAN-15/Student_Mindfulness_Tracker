const express = require('express');
const router = express.Router();
const Streak = require('../models/Streak');
const { protect } = require('../middleware/authMiddleware');
const { achievements } = require('../utils/achievements');

// Get current user's streak data
router.get('/', protect, async (req, res) => {
    try {
        let streak = await Streak.findOne({ user: req.user._id });

        if (!streak) {
            // Create initial streak record
            streak = new Streak({
                user: req.user._id,
                currentStreak: 0,
                longestStreak: 0,
                lastActivityDate: null,
                totalActiveDays: 0,
                achievements: []
            });
            await streak.save();
        }

        res.json(streak);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all available achievements (for reference)
router.get('/all-achievements', protect, async (req, res) => {
    try {
        res.json(achievements);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

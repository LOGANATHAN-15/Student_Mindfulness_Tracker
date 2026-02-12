const express = require('express');
const router = express.Router();
const Activity = require('../models/Activity');
const { protect } = require('../middleware/authMiddleware');

// Get all activities for the logged-in user
router.get('/', protect, async (req, res) => {
    try {
        const activities = await Activity.find({ user: req.user._id }).sort({ date: -1 });
        res.json(activities);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a new activity
router.post('/', protect, async (req, res) => {
    try {
        const { type, duration, date, notes } = req.body;

        const activity = new Activity({
            user: req.user._id,
            type,
            duration,
            date,
            notes
        });

        const createdActivity = await activity.save();
        res.status(201).json(createdActivity);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete an activity
router.delete('/:id', protect, async (req, res) => {
    try {
        const activity = await Activity.findById(req.params.id);

        if (activity) {
            if (activity.user.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'Not authorized to delete this activity' });
            }
            await activity.deleteOne();
            res.json({ message: 'Activity removed' });
        } else {
            res.status(404).json({ message: 'Activity not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update an activity
router.put('/:id', protect, async (req, res) => {
    try {
        const { type, duration, date, notes } = req.body;
        const activity = await Activity.findById(req.params.id);

        if (activity) {
            if (activity.user.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'Not authorized to update this activity' });
            }

            activity.type = type || activity.type;
            activity.duration = duration || activity.duration;
            activity.date = date || activity.date;
            activity.notes = notes || activity.notes;

            const updatedActivity = await activity.save();
            res.json(updatedActivity);
        } else {
            res.status(404).json({ message: 'Activity not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

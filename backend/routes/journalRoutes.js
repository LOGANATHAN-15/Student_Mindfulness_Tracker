const express = require('express');
const router = express.Router();
const Journal = require('../models/Journal');
const { protect } = require('../middleware/authMiddleware');

// Get all journal entries for the logged-in user
router.get('/', protect, async (req, res) => {
    try {
        const journals = await Journal.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .populate('activityRef');
        res.json(journals);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get a single journal entry
router.get('/:id', protect, async (req, res) => {
    try {
        const journal = await Journal.findById(req.params.id).populate('activityRef');

        if (!journal) {
            return res.status(404).json({ message: 'Journal entry not found' });
        }

        if (journal.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to view this journal' });
        }

        res.json(journal);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a new journal entry
router.post('/', protect, async (req, res) => {
    try {
        const { title, content, mood, tags, activityRef } = req.body;

        const journal = new Journal({
            user: req.user._id,
            title,
            content,
            mood,
            tags,
            activityRef
        });

        const createdJournal = await journal.save();
        res.status(201).json(createdJournal);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update a journal entry
router.put('/:id', protect, async (req, res) => {
    try {
        const { title, content, mood, tags } = req.body;
        const journal = await Journal.findById(req.params.id);

        if (!journal) {
            return res.status(404).json({ message: 'Journal entry not found' });
        }

        if (journal.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to update this journal' });
        }

        journal.title = title || journal.title;
        journal.content = content || journal.content;
        journal.mood = mood !== undefined ? mood : journal.mood;
        journal.tags = tags || journal.tags;

        const updatedJournal = await journal.save();
        res.json(updatedJournal);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete a journal entry
router.delete('/:id', protect, async (req, res) => {
    try {
        const journal = await Journal.findById(req.params.id);

        if (!journal) {
            return res.status(404).json({ message: 'Journal entry not found' });
        }

        if (journal.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to delete this journal' });
        }

        await journal.deleteOne();
        res.json({ message: 'Journal entry removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

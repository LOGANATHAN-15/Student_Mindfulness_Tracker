const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    type: {
        type: String, // Meditation, Yoga, Breathing
        required: true,
        enum: ['Meditation', 'Yoga', 'Breathing']
    },
    duration: {
        type: Number, // in minutes
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    notes: {
        type: String
    }
}, { timestamps: true });

const Activity = mongoose.model('Activity', activitySchema);
module.exports = Activity;

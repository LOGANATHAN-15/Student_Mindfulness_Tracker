const mongoose = require('mongoose');

const streakSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
        unique: true
    },
    currentStreak: {
        type: Number,
        default: 0
    },
    longestStreak: {
        type: Number,
        default: 0
    },
    lastActivityDate: {
        type: Date,
        default: null
    },
    totalActiveDays: {
        type: Number,
        default: 0
    },
    achievements: [{
        name: String,
        icon: String,
        unlockedAt: {
            type: Date,
            default: Date.now
        }
    }]
}, { timestamps: true });

const Streak = mongoose.model('Streak', streakSchema);
module.exports = Streak;

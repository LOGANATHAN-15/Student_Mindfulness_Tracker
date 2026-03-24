const mongoose = require('mongoose');

const journalSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true
    },
    mood: {
        type: Number,
        min: 1,
        max: 10
    },
    tags: [{
        type: String,
        trim: true
    }],
    activityRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Activity',
        default: null
    }
}, { timestamps: true });

const Journal = mongoose.model('Journal', journalSchema);
module.exports = Journal;

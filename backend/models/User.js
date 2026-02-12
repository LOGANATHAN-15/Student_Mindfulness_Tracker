const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: function (v) {
                return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: "Please enter a valid email address"
        }
    },
    password: {
        type: String,
        // Password is not required if logging in via Google
        required: function () { return !this.googleId }
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    googleId: {
        type: String
    },
    lastLogin: {
        type: Date,
        default: Date.now
    },
    lastLogout: {
        type: Date
    }
}, { timestamps: true });

// Password Encryption Middleware
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Match Password Method
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;

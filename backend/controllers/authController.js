const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// Register User
const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Basic Backend Validation
        if (!email.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            username,
            email,
            password,
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Login User
const authUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            user.lastLogin = Date.now();
            await user.save();

            res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Logout User Logic - Updates lastLogout time
const logoutUser = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const user = await User.findById(req.user._id);
        if (user) {
            user.lastLogout = Date.now();
            await user.save();
            res.json({ message: 'Logged out successfully' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Google Login
const googleAuth = async (req, res) => {
    const { token } = req.body;

    try {
        // Verify Google Token
        // In a real app with proper ENV, verify. For dev/demo if CLIENT_ID missing, we might decode manually or fail.
        // Assuming user puts a dummy client ID or real one.

        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const { name, email, sub } = ticket.getPayload();

        let user = await User.findOne({ email });

        if (user) {
            user.lastLogin = Date.now();
            if (!user.googleId) {
                user.googleId = sub;
            }
            await user.save();
        } else {
            // Create new user from Google
            // Generate random password
            const randomPassword = Math.random().toString(36).slice(-8);

            user = await User.create({
                username: name,
                email,
                password: randomPassword,
                googleId: sub
            });
        }

        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });

    } catch (error) {
        console.error("Google Auth Error:", error);
        res.status(400).json({ message: 'Google authentication failed' });
    }
};

module.exports = { registerUser, authUser, logoutUser, googleAuth };

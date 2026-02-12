const express = require('express');
const router = express.Router();
const { registerUser, authUser, logoutUser, googleAuth } = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', authUser);
router.post('/logout', protect, logoutUser); // Protected because we need req.user to know WHO logged out
router.post('/google', googleAuth);

module.exports = router;

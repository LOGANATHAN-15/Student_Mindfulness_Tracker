const cron = require('node-cron');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const Activity = require('../models/Activity');

const setupReminders = () => {
    // IMPORTANT: Verify you have set EMAIL_USER and EMAIL_PASS in .env for this to work!
    // Running daily to check for users who logged out > 24 hours ago (PRODUCTION MODE).
    cron.schedule('0 0 * * *', async () => {
        console.log('🔍 Checking for users who LOGGED OUT > 24 hours ago...');

        try {
            const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

            // Find users whose 'lastLogout' time is older than 24 hours ago
            // And ensure they actually HAVE a lastLogout time (meaning they logged out at least once)
            // Exclude admins
            const users = await User.find({
                lastLogout: { $lt: twentyFourHoursAgo, $exists: true }, // Ensure field exists
                role: { $ne: 'admin' }
            });

            if (users.length > 0) {
                console.log(`Found ${users.length} users who logged out > 24 hours ago.`);
                for (const user of users) {
                    await sendReminderEmail(user.email, user.username);
                }
            } else {
                console.log('No users found who logged out > 24 hours ago.');
            }
        } catch (error) {
            console.error('Error running reminder cron job:', error);
        }
    });
};

const sendReminderEmail = async (email, username) => {
    // Real email sending enabled
    // Make sure EMAIL_USER and EMAIL_PASS are set in .env with valid Gmail App Password

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    try {
        const frontendUrl = process.env.FRONTEND_URL || process.env.CLIENT_URL || 'http://localhost:5173';

        let info = await transporter.sendMail({
            from: '"Mindfulness Tracker" <noreply@mindfulnesstracker.com>',
            to: email,
            subject: "Gentle Reminder: Time to Unwind 🌿",
            text: `Hi ${username},\n\nWe noticed you haven't been active for more than 24 hours. We miss you! Come back and log a mindfulness activity.\n\nTake care,\nYour Mindfulness Team`,
            html: `<div style="font-family: sans-serif; color: #333;">
                    <h2>Hello ${username},</h2>
                    <p>We noticed you haven't been active for more than 24 hours.</p>
                    <p>Remember, even <strong>5 minutes of breathing</strong> can make a huge difference in your day.</p>
                    <br>
                    <a href="${frontendUrl}/dashboard" style="background-color: #4ade80; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Log Activity Now</a>
                    <br><br>
                    <p>Take care,<br>Your Mindfulness Team 🌿</p>
                   </div>`
        });
        console.log(`✅ Real email sent to ${email}: ${info.messageId}`);
    } catch (error) {
        console.error(`❌ Failed to send email to ${email}:`, error.message);
    }
};

module.exports = setupReminders;

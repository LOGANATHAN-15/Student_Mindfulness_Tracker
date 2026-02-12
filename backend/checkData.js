const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Activity = require('./models/Activity');

dotenv.config();

const checkData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ Connected to MongoDB');

        const users = await User.find({});
        console.log('\n--- 👤 Users found: ' + users.length + ' ---');
        console.table(users.map(u => ({
            _id: u._id.toString(),
            username: u.username,
            email: u.email
        })));

        const activities = await Activity.find({});
        console.log('\n--- 🧘 Activities found: ' + activities.length + ' ---');
        console.table(activities.map(a => ({
            type: a.type,
            duration: a.duration + ' min',
            date: a.date.toISOString().split('T')[0],
            user: a.user.toString()
        })));

        if (users.length === 0 && activities.length === 0) {
            console.log('\n⚠️ No data found. Try registering a user and adding an activity in the app first!');
        }

    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    } finally {
        await mongoose.disconnect();
        console.log('\nDisconnected from MongoDB');
    }
};

checkData();

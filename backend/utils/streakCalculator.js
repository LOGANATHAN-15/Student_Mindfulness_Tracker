const Streak = require('../models/Streak');
const { checkAchievements } = require('./achievements');

// Calculate if the date is consecutive to the last activity
function isConsecutiveDay(lastDate, currentDate) {
    if (!lastDate) return true; // First activity ever

    const last = new Date(lastDate);
    const current = new Date(currentDate);

    // Reset time to compare only dates
    last.setHours(0, 0, 0, 0);
    current.setHours(0, 0, 0, 0);

    const diffTime = current - last;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    return diffDays <= 1; // Same day or next day
}

// Check if activity is on a new day
function isNewDay(lastDate, currentDate) {
    if (!lastDate) return true;

    const last = new Date(lastDate);
    const current = new Date(currentDate);

    last.setHours(0, 0, 0, 0);
    current.setHours(0, 0, 0, 0);

    return current > last;
}

// Update user's streak based on new activity
async function updateStreak(userId, activityDate = new Date()) {
    try {
        // Find or create streak record
        let streak = await Streak.findOne({ user: userId });

        if (!streak) {
            // First activity ever
            streak = new Streak({
                user: userId,
                currentStreak: 1,
                longestStreak: 1,
                lastActivityDate: activityDate,
                totalActiveDays: 1,
                achievements: []
            });
        } else {
            // Check if this is a new day
            if (isNewDay(streak.lastActivityDate, activityDate)) {
                // Increment total active days
                streak.totalActiveDays += 1;

                // Check if consecutive
                if (isConsecutiveDay(streak.lastActivityDate, activityDate)) {
                    streak.currentStreak += 1;
                } else {
                    // Streak broken, reset to 1
                    streak.currentStreak = 1;
                }

                // Update longest streak if needed
                if (streak.currentStreak > streak.longestStreak) {
                    streak.longestStreak = streak.currentStreak;
                }

                // Update last activity date
                streak.lastActivityDate = activityDate;
            }
            // If same day, don't update streak but activity still counts
        }

        // Check for new achievements
        const newAchievements = checkAchievements(
            {
                currentStreak: streak.currentStreak,
                totalActiveDays: streak.totalActiveDays
            },
            streak.achievements
        );

        // Add new achievements
        if (newAchievements.length > 0) {
            streak.achievements.push(...newAchievements);
        }

        await streak.save();

        return {
            streak,
            newAchievements
        };
    } catch (error) {
        console.error('Error updating streak:', error);
        throw error;
    }
}

module.exports = { updateStreak, isConsecutiveDay, isNewDay };

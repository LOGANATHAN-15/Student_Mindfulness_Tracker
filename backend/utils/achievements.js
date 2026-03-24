// Achievement definitions for streak milestones
const achievements = [
    {
        name: 'First Step',
        icon: '🎯',
        criteria: { type: 'streak', value: 1 },
        description: 'Completed your first mindfulness session'
    },
    {
        name: 'Getting Started',
        icon: '🌱',
        criteria: { type: 'streak', value: 3 },
        description: 'Maintained a 3-day streak'
    },
    {
        name: 'Week Warrior',
        icon: '💪',
        criteria: { type: 'streak', value: 7 },
        description: 'One week of consistent practice'
    },
    {
        name: 'Fortnight Focus',
        icon: '⭐',
        criteria: { type: 'streak', value: 14 },
        description: 'Two weeks of dedication'
    },
    {
        name: 'Monthly Master',
        icon: '🏆',
        criteria: { type: 'streak', value: 30 },
        description: 'A full month of mindfulness'
    },
    {
        name: 'Mindful Legend',
        icon: '👑',
        criteria: { type: 'streak', value: 50 },
        description: '50 days of consistent practice'
    },
    {
        name: 'Zen Master',
        icon: '🧘',
        criteria: { type: 'streak', value: 100 },
        description: '100 days of enlightenment'
    },
    {
        name: 'Century Champion',
        icon: '💎',
        criteria: { type: 'totalDays', value: 100 },
        description: '100 total active days'
    },
    {
        name: 'Dedicated Practitioner',
        icon: '🎖️',
        criteria: { type: 'totalDays', value: 50 },
        description: '50 total active days'
    }
];

// Check which achievements should be unlocked based on streak data
function checkAchievements(streakData, existingAchievements = []) {
    const existingNames = existingAchievements.map(a => a.name);
    const newAchievements = [];

    achievements.forEach(achievement => {
        // Skip if already unlocked
        if (existingNames.includes(achievement.name)) {
            return;
        }

        // Check criteria
        let shouldUnlock = false;
        if (achievement.criteria.type === 'streak') {
            shouldUnlock = streakData.currentStreak >= achievement.criteria.value;
        } else if (achievement.criteria.type === 'totalDays') {
            shouldUnlock = streakData.totalActiveDays >= achievement.criteria.value;
        }

        if (shouldUnlock) {
            newAchievements.push({
                name: achievement.name,
                icon: achievement.icon,
                description: achievement.description,
                unlockedAt: new Date()
            });
        }
    });

    return newAchievements;
}

module.exports = { achievements, checkAchievements };

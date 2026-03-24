import { motion } from 'framer-motion';
import { moodEmojis } from './MoodSelector';

const MoodChart = ({ activities }) => {
    if (!activities || activities.length === 0) {
        return (
            <div className="glass-panel p-6 text-center opacity-70">
                <p>No mood data available yet. Start logging activities with mood tracking!</p>
            </div>
        );
    }

    // Filter activities with mood data
    const activitiesWithMood = activities.filter(a => a.moodBefore || a.moodAfter);

    if (activitiesWithMood.length === 0) {
        return (
            <div className="glass-panel p-6 text-center opacity-70">
                <p>No mood data available yet. Start logging activities with mood tracking!</p>
            </div>
        );
    }

    // Get last 7 activities with mood
    const recentMoodData = activitiesWithMood.slice(0, 7).reverse();

    // Calculate average mood improvement
    const moodImprovements = activitiesWithMood
        .filter(a => a.moodBefore && a.moodAfter)
        .map(a => a.moodAfter - a.moodBefore);

    const avgImprovement = moodImprovements.length > 0
        ? (moodImprovements.reduce((a, b) => a + b, 0) / moodImprovements.length).toFixed(1)
        : 0;

    return (
        <div className="glass-panel p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">Mood Trends</h3>
                <div className="text-center">
                    <p className="text-xs opacity-70">Avg Improvement</p>
                    <p className={`text-2xl font-bold ${avgImprovement > 0 ? 'text-green-500' : 'text-gray-500'}`}>
                        {avgImprovement > 0 ? '+' : ''}{avgImprovement}
                    </p>
                </div>
            </div>

            {/* Simple Bar Chart */}
            <div className="space-y-3">
                {recentMoodData.map((activity, index) => {
                    const hasBeforeAfter = activity.moodBefore && activity.moodAfter;
                    const improvement = hasBeforeAfter ? activity.moodAfter - activity.moodBefore : 0;

                    return (
                        <div key={activity._id || index} className="space-y-1">
                            <div className="flex items-center justify-between text-xs opacity-70">
                                <span>{activity.type}</span>
                                <span>{new Date(activity.date).toLocaleDateString()}</span>
                            </div>

                            <div className="flex gap-2 items-center">
                                {/* Before Mood */}
                                {activity.moodBefore && (
                                    <div className="flex items-center gap-1 flex-1">
                                        <span className="text-lg">{moodEmojis[activity.moodBefore]?.emoji}</span>
                                        <div className="flex-1 h-6 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${activity.moodBefore * 10}%` }}
                                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                                className="h-full bg-gradient-to-r from-orange-400 to-orange-500 flex items-center justify-end pr-2"
                                            >
                                                <span className="text-xs font-bold text-white">{activity.moodBefore}</span>
                                            </motion.div>
                                        </div>
                                    </div>
                                )}

                                {/* Arrow */}
                                {hasBeforeAfter && (
                                    <span className="text-xl">→</span>
                                )}

                                {/* After Mood */}
                                {activity.moodAfter && (
                                    <div className="flex items-center gap-1 flex-1">
                                        <span className="text-lg">{moodEmojis[activity.moodAfter]?.emoji}</span>
                                        <div className="flex-1 h-6 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${activity.moodAfter * 10}%` }}
                                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                                className="h-full bg-gradient-to-r from-green-400 to-green-500 flex items-center justify-end pr-2"
                                            >
                                                <span className="text-xs font-bold text-white">{activity.moodAfter}</span>
                                            </motion.div>
                                        </div>
                                    </div>
                                )}

                                {/* Improvement Badge */}
                                {hasBeforeAfter && improvement !== 0 && (
                                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${improvement > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                        {improvement > 0 ? '+' : ''}{improvement}
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default MoodChart;

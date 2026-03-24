import { motion } from 'framer-motion';
import { Flame, Trophy, Target } from 'lucide-react';
import { useEffect, useState } from 'react';
import axios from 'axios';

const StreakCard = ({ token }) => {
    const [streakData, setStreakData] = useState({
        currentStreak: 0,
        longestStreak: 0,
        totalActiveDays: 0,
        achievements: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStreak = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const { data } = await axios.get('http://localhost:5000/api/streaks', config);
                setStreakData(data);
            } catch (error) {
                console.error('Error fetching streak:', error);
            } finally {
                setLoading(false);
            }
        };

        if (token) fetchStreak();
    }, [token]);

    if (loading) {
        return (
            <div className="glass-panel p-6 animate-pulse">
                <div className="h-20 bg-gray-200 rounded"></div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-[32px] p-8 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] dark:shadow-none border border-gray-50 dark:border-gray-700 relative overflow-hidden h-full flex flex-col justify-between group">
            {/* Background Ghost Icon */}
            <div className="absolute -right-6 -top-6 opacity-5 dark:opacity-10 pointer-events-none transform group-hover:scale-110 transition-transform duration-700">
                <Flame size={180} className="text-orange-500" />
            </div>

            <div className="relative z-10 space-y-6">
                <div className="flex items-start gap-6">
                    <div className="w-16 h-16 shrink-0 rounded-[22px] bg-orange-100 flex items-center justify-center shadow-sm">
                        <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <Flame size={32} className="text-orange-500" />
                        </motion.div>
                    </div>

                    <div className="pt-1">
                        <p className="text-slate-400 dark:text-slate-500 font-extrabold text-[11px] uppercase tracking-wider mb-1">
                            Current Streak
                        </p>
                        <h3 className="text-4xl font-black text-slate-800 dark:text-white">
                            {streakData.currentStreak} <span className="text-lg font-bold opacity-50">Days</span>
                        </h3>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="flex gap-8 pt-4 border-t border-gray-50 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                        <Trophy size={18} className="text-yellow-500" />
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Longest</p>
                            <p className="font-bold text-sm text-slate-700 dark:text-gray-300">{streakData.longestStreak} days</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Target size={18} className="text-blue-500" />
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Total Active</p>
                            <p className="font-bold text-sm text-slate-700 dark:text-gray-300">{streakData.totalActiveDays} days</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Latest Achievement */}
            {streakData.achievements && streakData.achievements.length > 0 && (
                <div className="mt-6 pt-4 border-t border-gray-50 dark:border-gray-700 relative z-10">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Latest Milestone</p>
                    <div className="flex items-center gap-3 bg-slate-50 dark:bg-gray-700/50 p-3 rounded-2xl ring-1 ring-slate-100 dark:ring-gray-600">
                        <span className="text-2xl">{streakData.achievements[streakData.achievements.length - 1].icon}</span>
                        <span className="font-bold text-sm text-slate-700 dark:text-gray-200">{streakData.achievements[streakData.achievements.length - 1].name}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StreakCard;

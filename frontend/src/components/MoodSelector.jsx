import { motion } from 'framer-motion';

const moodEmojis = {
    1: { emoji: '😢', label: 'Very Bad', color: 'from-red-500 to-red-600' },
    2: { emoji: '😔', label: 'Bad', color: 'from-red-400 to-orange-500' },
    3: { emoji: '😕', label: 'Poor', color: 'from-orange-400 to-orange-500' },
    4: { emoji: '😐', label: 'Below Average', color: 'from-yellow-400 to-yellow-500' },
    5: { emoji: '😊', label: 'Average', color: 'from-yellow-300 to-green-400' },
    6: { emoji: '🙂', label: 'Good', color: 'from-green-400 to-green-500' },
    7: { emoji: '😄', label: 'Great', color: 'from-green-500 to-blue-400' },
    8: { emoji: '😁', label: 'Very Good', color: 'from-blue-400 to-blue-500' },
    9: { emoji: '🤩', label: 'Excellent', color: 'from-blue-500 to-purple-500' },
    10: { emoji: '😇', label: 'Perfect', color: 'from-purple-500 to-pink-500' },
};

const MoodSelector = ({ value, onChange, label = "How do you feel?" }) => {
    return (
        <div className="space-y-4">
            <label className="block text-sm font-semibold opacity-80">{label}</label>

            <div className="grid grid-cols-5 gap-3">
                {Object.entries(moodEmojis).map(([moodValue, { emoji, label, color }]) => {
                    const isSelected = value === parseInt(moodValue);

                    return (
                        <motion.button
                            key={moodValue}
                            type="button"
                            onClick={() => onChange(parseInt(moodValue))}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className={`
                                relative p-3 rounded-xl transition-all
                                ${isSelected
                                    ? `bg-gradient-to-br ${color} text-white shadow-lg scale-110`
                                    : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                                }
                            `}
                            title={label}
                        >
                            <div className="text-2xl">{emoji}</div>
                            {isSelected && (
                                <motion.div
                                    layoutId="mood-indicator"
                                    className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full"
                                />
                            )}
                        </motion.button>
                    );
                })}
            </div>

            {value && (
                <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center text-sm font-medium"
                >
                    {moodEmojis[value].label} ({value}/10)
                </motion.p>
            )}
        </div>
    );
};

export default MoodSelector;
export { moodEmojis };

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Check } from 'lucide-react';

const SessionTimer = ({ onComplete, activityType = 'Meditation' }) => {
    const [duration, setDuration] = useState(5); // in minutes
    const [timeLeft, setTimeLeft] = useState(0); // in seconds
    const [isRunning, setIsRunning] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const intervalRef = useRef(null);
    const audioRef = useRef(null);

    // Activity animation states
    const [breathPhase, setBreathPhase] = useState('inhale'); // inhale, hold, exhale
    const [meditationPhase, setMeditationPhase] = useState('focus'); // focus, relax
    const [yogaPhase, setYogaPhase] = useState('stretch'); // stretch, hold, release

    useEffect(() => {
        // Audio for completion
        audioRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxjnOb0onIRD2eg6PGYYBcMWJfj8ahiGAlfm+f0nlgNBVyZ5PSqZRYJW5fl8qlmFgheT');

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    useEffect(() => {
        if (isRunning && timeLeft > 0) {
            intervalRef.current = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        setIsRunning(false);
                        setIsCompleted(true);
                        if (audioRef.current) {
                            audioRef.current.play().catch(e => console.log('Audio play failed:', e));
                        }
                        if (onComplete) {
                            onComplete(duration);
                        }
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            if (intervalRef.current) clearInterval(intervalRef.current);
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isRunning, timeLeft, duration, onComplete]);

    // Activity cycle animations
    useEffect(() => {
        if (!isRunning) return;

        let intervalId;

        if (activityType === 'Breathing') {
            intervalId = setInterval(() => {
                setBreathPhase(prev => {
                    if (prev === 'inhale') return 'hold';
                    if (prev === 'hold') return 'exhale';
                    return 'inhale';
                });
            }, 4000);
        } else if (activityType === 'Meditation') {
            intervalId = setInterval(() => {
                setMeditationPhase(prev => prev === 'focus' ? 'relax' : 'focus');
            }, 5000);
        } else if (activityType === 'Yoga') {
            intervalId = setInterval(() => {
                setYogaPhase(prev => {
                    if (prev === 'stretch') return 'hold';
                    if (prev === 'hold') return 'release';
                    return 'stretch';
                });
            }, 5000);
        }

        return () => clearInterval(intervalId);
    }, [isRunning, activityType]);

    const startTimer = () => {
        if (timeLeft === 0) {
            setTimeLeft(duration * 60);
        }
        setIsRunning(true);
        setIsCompleted(false);
    };

    const pauseTimer = () => {
        setIsRunning(false);
    };

    const resetTimer = () => {
        setIsRunning(false);
        setTimeLeft(0);
        setIsCompleted(false);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const progress = timeLeft > 0 ? ((duration * 60 - timeLeft) / (duration * 60)) * 100 : 0;

    const presetDurations = [5, 10, 15, 20, 30];

    return (
        <div className="glass-panel p-8 space-y-6">
            {/* Duration Presets */}
            {!isRunning && timeLeft === 0 && (
                <div className="space-y-3">
                    <label className="block text-sm font-semibold opacity-80">Select Duration</label>
                    <div className="flex gap-2 flex-wrap">
                        {presetDurations.map(mins => (
                            <button
                                key={mins}
                                onClick={() => setDuration(mins)}
                                className={`px-4 py-2 rounded-lg font-medium transition-all ${duration === mins
                                    ? 'bg-primary text-white shadow-lg'
                                    : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                                    }`}
                            >
                                {mins} min
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Timer Display */}
            <div className="relative">
                <div className="text-center space-y-4">
                    {/* Activity Animation Circles */}
                    {isRunning && (
                        <div className="flex justify-center mb-6 min-h-[160px] items-center">
                            {activityType === 'Breathing' && (
                                <motion.div
                                    animate={{
                                        scale: breathPhase === 'inhale' ? 1.5 : breathPhase === 'hold' ? 1.5 : 1,
                                        opacity: breathPhase === 'hold' ? 0.8 : 1
                                    }}
                                    transition={{ duration: 4, ease: 'easeInOut' }}
                                    className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 shadow-2xl flex items-center justify-center"
                                >
                                    <p className="text-white font-bold capitalize">{breathPhase}</p>
                                </motion.div>
                            )}

                            {activityType === 'Meditation' && (
                                <motion.div
                                    animate={{
                                        scale: meditationPhase === 'focus' ? 1.3 : 1.0,
                                        opacity: meditationPhase === 'focus' ? 1 : 0.7
                                    }}
                                    transition={{ duration: 5, ease: 'easeInOut' }}
                                    className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 shadow-2xl flex items-center justify-center"
                                >
                                    <p className="text-white font-bold capitalize">{meditationPhase}</p>
                                </motion.div>
                            )}

                            {activityType === 'Yoga' && (
                                <motion.div
                                    animate={{
                                        scale: yogaPhase === 'stretch' ? 1.4 : yogaPhase === 'hold' ? 1.4 : 1.0,
                                        borderRadius: yogaPhase === 'stretch' ? '50%' : yogaPhase === 'hold' ? '40%' : '50%'
                                    }}
                                    transition={{ duration: 5, ease: 'easeInOut' }}
                                    className="w-32 h-32 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 shadow-2xl flex items-center justify-center"
                                >
                                    <p className="text-white font-bold capitalize">{yogaPhase}</p>
                                </motion.div>
                            )}
                        </div>
                    )}

                    <h2 className="text-6xl font-bold">
                        {timeLeft > 0 ? formatTime(timeLeft) : formatTime(duration * 60)}
                    </h2>

                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-primary to-secondary"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>
                </div>

                {/* Completion Message */}
                <AnimatePresence>
                    {isCompleted && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 flex items-center justify-center bg-green-500/10 backdrop-blur-sm rounded-2xl"
                        >
                            <div className="text-center space-y-2">
                                <Check size={48} className="mx-auto text-green-500" />
                                <p className="text-xl font-bold text-green-600 dark:text-green-400">
                                    Session Complete! 🎉
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="flex gap-3 justify-center">
                {!isRunning && timeLeft === 0 && (
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={startTimer}
                        className="btn-primary px-8 py-3"
                    >
                        <Play size={20} />
                        Start Session
                    </motion.button>
                )}

                {isRunning && (
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={pauseTimer}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg flex items-center gap-2"
                    >
                        <Pause size={20} />
                        Pause
                    </motion.button>
                )}

                {!isRunning && timeLeft > 0 && !isCompleted && (
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={startTimer}
                        className="btn-primary px-6 py-3"
                    >
                        <Play size={20} />
                        Resume
                    </motion.button>
                )}

                {timeLeft > 0 && (
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={resetTimer}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg flex items-center gap-2"
                    >
                        <RotateCcw size={20} />
                        Reset
                    </motion.button>
                )}
            </div>
        </div>
    );
};

export default SessionTimer;

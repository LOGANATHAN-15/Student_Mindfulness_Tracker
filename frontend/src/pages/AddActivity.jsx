import { useState, useContext, useEffect, useRef } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, AlignLeft, Save, X, Sparkles, Play, Pause, RotateCcw } from 'lucide-react';
import MoodSelector from '../components/MoodSelector';

const AddActivity = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const [type, setType] = useState('Meditation');
    const [duration, setDuration] = useState('');
    const [notes, setNotes] = useState('');
    const [moodBefore, setMoodBefore] = useState(null);
    const [moodAfter, setMoodAfter] = useState(null);
    const [journalEntry, setJournalEntry] = useState('');
    const [showMoodAfter, setShowMoodAfter] = useState(false);
    const [newAchievements, setNewAchievements] = useState([]);

    // Timer States
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const [isComplete, setIsComplete] = useState(false);
    const timerRef = useRef(null);

    // Audio for timer completion
    const audioRef = useRef(new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3'));

    useEffect(() => {
        if (isTimerRunning && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && isTimerRunning) {
            handleTimerComplete();
        }
        return () => clearInterval(timerRef.current);
    }, [isTimerRunning, timeLeft]);

    const handleTimerComplete = () => {
        setIsTimerRunning(false);
        setIsComplete(true);
        setShowMoodAfter(true);
        audioRef.current.play().catch(e => console.log("Audio play failed"));
    };

    const startSession = () => {
        if (!duration || duration <= 0) return;
        setTimeLeft(duration * 60);
        setIsTimerRunning(true);
        setIsComplete(false);
    };

    // Pre-fill from guided session if applicable
    useEffect(() => {
        if (location.state?.fromGuidedSession) {
            setType(location.state.type);
            setDuration(location.state.duration.toString());
            setShowMoodAfter(true);
            setIsComplete(true);
        }
    }, [location]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const response = await axios.post(
                'http://localhost:5000/api/activities',
                {
                    type,
                    duration,
                    notes,
                    moodBefore,
                    moodAfter,
                    journalEntry
                },
                config
            );

            if (response.data.newAchievements && response.data.newAchievements.length > 0) {
                setNewAchievements(response.data.newAchievements);
                setTimeout(() => navigate('/dashboard'), 3000);
            } else {
                navigate('/dashboard');
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel p-8"
            >
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold">
                        {isTimerRunning ? 'Session in Progress' : isComplete ? 'Session Complete' : 'Plan Your Session'}
                    </h2>
                    <button onClick={() => navigate('/dashboard')} className="opacity-50 hover:opacity-100">
                        <X size={24} />
                    </button>
                </div>

                {!isTimerRunning && !isComplete && (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium mb-3">Activity Type</label>
                            <div className="grid grid-cols-3 gap-4">
                                {['Meditation', 'Yoga', 'Breathing'].map((t) => (
                                    <button
                                        key={t}
                                        type="button"
                                        onClick={() => setType(t)}
                                        className={`py-3 px-4 rounded-xl border-2 transition-all ${type === t
                                            ? 'bg-primary/10 border-primary text-primary-dark font-bold'
                                            : 'border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900'
                                            }`}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-3">Duration (minutes)</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Clock size={20} className="text-primary" />
                                </div>
                                <input
                                    type="number"
                                    value={duration}
                                    onChange={(e) => setDuration(e.target.value)}
                                    className="input-field pl-12 py-4 text-lg"
                                    placeholder="e.g. 10"
                                    required
                                    min="1"
                                />
                            </div>
                        </div>

                        <MoodSelector
                            value={moodBefore}
                            onChange={setMoodBefore}
                            label="How do you feel right now?"
                        />

                        <button
                            type="button"
                            onClick={startSession}
                            disabled={!duration || !moodBefore}
                            className="w-full btn-primary py-4 text-lg font-bold flex items-center justify-center gap-2 shadow-xl shadow-primary/20 disabled:opacity-50 disabled:shadow-none"
                        >
                            <Play size={20} fill="currentColor" /> Start Session
                        </button>
                    </div>
                )}

                {isTimerRunning && (
                    <div className="flex flex-col items-center py-12 space-y-10">
                        {/* Breathing Animation */}
                        <div className="relative flex items-center justify-center">
                            <motion.div
                                animate={{
                                    scale: [1, 1.4, 1],
                                    opacity: [0.3, 0.6, 0.3]
                                }}
                                transition={{
                                    duration: 8,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                className="absolute w-64 h-64 bg-primary/20 rounded-full blur-3xl"
                            />
                            <div className="relative z-10 text-center">
                                <h3 className="text-7xl font-black mb-4 tracking-tighter text-primary">
                                    {formatTime(timeLeft)}
                                </h3>
                                <p className="text-xl font-medium opacity-50 uppercase tracking-widest">
                                    {type === 'Breathing' ? 'Inhale ... Exhale' : 'Just Breathe'}
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => setIsTimerRunning(!isTimerRunning)}
                                className="p-5 rounded-full bg-white dark:bg-gray-800 shadow-xl text-primary hover:scale-110 transition-transform"
                            >
                                {isTimerRunning ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" />}
                            </button>
                            <button
                                onClick={() => { setIsTimerRunning(false); setTimeLeft(0); handleTimerComplete(); }}
                                className="p-5 rounded-full bg-red-50 text-red-500 shadow-lg hover:scale-110 transition-transform"
                                title="End session early"
                            >
                                <X size={32} />
                            </button>
                        </div>
                    </div>
                )}

                <AnimatePresence>
                    {isComplete && (
                        <motion.form
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            onSubmit={handleSubmit}
                            className="space-y-8"
                        >
                            <div className="p-6 bg-primary/5 rounded-2xl border border-primary/10 text-center">
                                <h3 className="text-xl font-bold text-primary-dark mb-1">Excellent work!</h3>
                                <p className="opacity-70">You've completed your {duration} minute {type.toLowerCase()} session.</p>
                            </div>

                            <MoodSelector
                                value={moodAfter}
                                onChange={setMoodAfter}
                                label="How do you feel after the session?"
                            />

                            <div className="space-y-3">
                                <label className="block text-sm font-medium">Any notes or reflections?</label>
                                <textarea
                                    value={journalEntry}
                                    onChange={(e) => setJournalEntry(e.target.value)}
                                    className="input-field min-h-[120px] p-4 resize-none"
                                    placeholder="Write down your thoughts..."
                                ></textarea>
                            </div>

                            <div className="flex gap-4">
                                <button type="submit" className="flex-1 btn-primary py-4 text-lg font-bold shadow-lg shadow-primary/20">
                                    <Save size={20} /> Save & Finish
                                </button>
                                <button
                                    type="button"
                                    onClick={() => navigate('/dashboard')}
                                    className="px-8 py-4 rounded-xl border border-gray-200 dark:border-gray-800 font-bold opacity-60 hover:opacity-100 transition-opacity"
                                >
                                    Discard
                                </button>
                            </div>
                        </motion.form>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Achievement Popup */}
            <AnimatePresence>
                {newAchievements.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6"
                    >
                        <motion.div
                            initial={{ scale: 0.8, y: 50 }}
                            animate={{ scale: 1, y: 0 }}
                            className="glass-panel p-10 max-w-sm w-full text-center space-y-6"
                        >
                            <div className="w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center mx-auto shadow-2xl animate-bounce">
                                <Sparkles size={48} className="text-white" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-black mb-2">New Milestone!</h2>
                                <p className="opacity-60">You've reached a new peak in your journey.</p>
                            </div>
                            {newAchievements.map((ach, idx) => (
                                <div key={idx} className="bg-gradient-to-br from-primary/10 to-secondary/10 p-6 rounded-2xl border border-primary/20">
                                    <p className="text-5xl mb-3">{ach.icon}</p>
                                    <p className="text-2xl font-bold text-primary-dark">{ach.name}</p>
                                    <p className="text-sm opacity-70 mt-1">{ach.description}</p>
                                </div>
                            ))}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AddActivity;



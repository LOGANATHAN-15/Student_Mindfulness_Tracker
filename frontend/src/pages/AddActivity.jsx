import { useState, useContext, useEffect, useRef } from 'react';
import api from '../utils/api';
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
            const response = await api.post(
                '/activities',
                {
                    type,
                    duration,
                    notes,
                    moodBefore,
                    moodAfter,
                    journalEntry
                }
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
        <div className="container mx-auto px-4 py-20 max-w-2xl">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel p-10 border-none shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)]"
            >
                <div className="flex justify-between items-center mb-10">
                    <h2 className="text-4xl font-black tracking-tighter">
                        {isTimerRunning ? 'In the Moment' : isComplete ? 'Session Unified' : 'Prepare Space'}
                    </h2>

                    <button onClick={() => navigate('/dashboard')} className="p-2 text-muted hover:text-red-500 hover:rotate-90 transition-all duration-500">
                        <X size={32} />
                    </button>
                </div>

                {!isTimerRunning && !isComplete && (
                    <div className="space-y-8">
                        <div>
                            <label className="block text-sm font-black uppercase tracking-widest text-muted mb-4">Focus Mode</label>
                            <div className="grid grid-cols-3 gap-4">
                                {['Meditation', 'Yoga', 'Breathing'].map((t) => (
                                    <button
                                        key={t}
                                        type="button"
                                        onClick={() => setType(t)}
                                        className={`py-4 px-2 rounded-2xl border-2 transition-all duration-500 ${type === t
                                            ? 'bg-primary/20 border-primary text-primary font-black shadow-lg shadow-primary/20 scale-105'
                                            : 'border-border-color opacity-60 hover:opacity-100'
                                            }`}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-black uppercase tracking-widest text-muted mb-4">Intended Duration (min)</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none group-focus-within:text-primary transition-colors">
                                    <Clock size={24} strokeWidth={2.5} />
                                </div>
                                <input
                                    type="number"
                                    value={duration}
                                    onChange={(e) => setDuration(e.target.value)}
                                    className="input-premium pl-14 py-5 text-2xl font-black"
                                    placeholder="0"
                                    required
                                    min="1"
                                />
                            </div>
                        </div>

                        <MoodSelector
                            value={moodBefore}
                            onChange={setMoodBefore}
                            label="Check-in: Current State"
                        />

                        <button
                            type="button"
                            onClick={startSession}
                            disabled={!duration || !moodBefore}
                            className="w-full btn-premium py-5 text-xl tracking-tight disabled:opacity-30 disabled:grayscale"
                        >
                            <Play size={24} fill="currentColor" strokeWidth={0} /> BE PRESENT
                        </button>
                    </div>
                )}

                {isTimerRunning && (
                    <div className="flex flex-col items-center py-16 space-y-12">
                        {/* Advanced Breathing Animation */}
                        <div className="relative flex items-center justify-center">
                            <motion.div
                                animate={{
                                    scale: [1, 1.6, 1],
                                    opacity: [0.2, 0.5, 0.2],
                                    rotate: [0, 180, 360]
                                }}
                                transition={{
                                    duration: 10,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                className="absolute w-80 h-80 bg-gradient-to-tr from-primary to-secondary rounded-[3rem] blur-3xl"
                            />
                            <div className="relative z-10 text-center space-y-2">
                                <motion.h3 
                                    key={timeLeft}
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="text-8xl font-black tracking-tighter text-primary drop-shadow-2xl"
                                >
                                    {formatTime(timeLeft)}
                                </motion.h3>
                                <p className="text-xl font-black uppercase tracking-[0.3em] text-secondary opacity-80 animate-pulse">
                                    {type === 'Breathing' ? 'Expand ... Release' : 'Deep Awareness'}
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-6">
                            <button
                                onClick={() => setIsTimerRunning(!isTimerRunning)}
                                className="p-6 rounded-[2rem] bg-surface shadow-2xl text-primary hover:scale-110 active:scale-90 transition-all border border-border-color"
                            >
                                {isTimerRunning ? <Pause size={42} fill="currentColor" strokeWidth={0} /> : <Play size={42} fill="currentColor" strokeWidth={0} />}
                            </button>
                            <button
                                onClick={() => { setIsTimerRunning(false); setTimeLeft(0); handleTimerComplete(); }}
                                className="p-6 rounded-[2rem] bg-red-500 text-white shadow-2xl hover:scale-110 active:scale-90 transition-all"
                                title="Conclude"
                            >
                                <X size={42} strokeWidth={3} />
                            </button>
                        </div>
                    </div>
                )}

                <AnimatePresence mode="wait">
                    {isComplete && (
                        <motion.form
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            onSubmit={handleSubmit}
                            className="space-y-10"
                        >
                            <div className="p-8 bg-primary/10 rounded-[2.5rem] border border-primary/20 text-center space-y-2">
                                <h3 className="text-3xl font-black text-primary">Space Harmonized</h3>
                                <p className="text-lg font-medium opacity-80">You've successfully completed {duration}m of {type.toLowerCase()}.</p>
                            </div>

                            <MoodSelector
                                value={moodAfter}
                                onChange={setMoodAfter}
                                label="Post-Session Reflection"
                            />

                            <div className="space-y-4">
                                <label className="block text-sm font-black uppercase tracking-widest text-muted">Wisdom Captured (Notes)</label>
                                <textarea
                                    value={journalEntry}
                                    onChange={(e) => setJournalEntry(e.target.value)}
                                    className="input-premium min-h-[160px] text-lg"
                                    placeholder="What revealed itself to you?"
                                ></textarea>
                            </div>

                            <div className="flex gap-4">
                                <button type="submit" className="flex-1 btn-premium py-5 text-xl">
                                    <Save size={24} strokeWidth={2.5} /> UNIFY RECORDS
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



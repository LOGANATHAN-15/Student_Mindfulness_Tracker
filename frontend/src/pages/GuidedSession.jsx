import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, Wind, Flower2 } from 'lucide-react';
import SessionTimer from '../components/SessionTimer';

const activityTypes = [
    {
        name: 'Meditation',
        icon: Activity,
        color: 'from-purple-500 to-indigo-600',
        description: 'Focus your mind on a single object or thought to achieve mental clarity.'
    },
    {
        name: 'Yoga',
        icon: Flower2,
        color: 'from-pink-500 to-rose-600',
        description: 'Practice physical postures and controlled breathing for flexibility and peace.'
    },
    {
        name: 'Breathing',
        icon: Wind,
        color: 'from-blue-500 to-cyan-600',
        description: 'Deliberately change your breathing pattern to calm your nervous system.'
    }
];

const GuidedSession = () => {
    const [selectedType, setSelectedType] = useState(null);
    const [sessionDuration, setSessionDuration] = useState(null);
    const navigate = useNavigate();

    const handleSessionComplete = (duration) => {
        setSessionDuration(duration);
        // Navigate to AddActivity with pre-filled data
        setTimeout(() => {
            navigate('/add-activity', {
                state: {
                    type: selectedType,
                    duration: duration,
                    fromGuidedSession: true
                }
            });
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pb-20">
            <div className="container mx-auto px-4 py-12 max-w-6xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8"
                >
                    <div className="text-center space-y-2">
                        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                            Guided Sessions
                        </h1>
                        <p className="text-xl opacity-70">A specialized practice for your wellbeing</p>
                    </div>

                    {!selectedType ? (
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-center mb-6">Choose Your Practice</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {activityTypes.map(({ name, icon: Icon, color, description }, index) => (
                                    <motion.button
                                        key={name}
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.2, duration: 0.5, ease: "easeOut" }}
                                        onClick={() => setSelectedType(name)}
                                        whileHover={{ y: -10 }}
                                        whileTap={{ scale: 0.95 }}
                                        className={`glass-panel p-10 flex flex-col items-center text-center gap-6 cursor-pointer bg-gradient-to-br ${color} text-white shadow-2xl relative overflow-hidden group`}
                                    >
                                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform">
                                            <Icon size={180} />
                                        </div>

                                        <div className="relative z-10 p-5 bg-white/20 rounded-full backdrop-blur-md">
                                            <Icon size={56} />
                                        </div>

                                        <div className="relative z-10">
                                            <h3 className="text-3xl font-black mb-3">{name}</h3>
                                            <p className="text-white/80 font-medium leading-relaxed">
                                                {description}
                                            </p>
                                        </div>

                                        <div className="relative z-10 mt-4 px-6 py-2 bg-white/20 rounded-full text-sm font-bold backdrop-blur-md group-hover:bg-white text-white group-hover:text-primary transition-all">
                                            Start {name}
                                        </div>
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                            <div className="space-y-6">
                                <div className="text-center lg:text-left">
                                    <h2 className="text-3xl font-bold mb-2">{selectedType} Session</h2>
                                    <button
                                        onClick={() => setSelectedType(null)}
                                        className="text-sm text-primary hover:underline"
                                    >
                                        ← Change Activity
                                    </button>
                                </div>

                                <SessionTimer
                                    onComplete={handleSessionComplete}
                                    activityType={selectedType}
                                />
                            </div>

                            {/* YouTube Playlist Panel */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="glass-panel card-bg p-6 h-full min-h-[400px] flex flex-col"
                            >
                                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                    <Activity size={20} className="text-primary" />
                                    Recommended Playlist
                                </h3>
                                <div className="flex-1 rounded-xl overflow-hidden shadow-inner bg-gray-900">
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        className="min-h-[300px]"
                                        src={`${selectedType === 'Yoga' ? 'https://www.youtube.com/embed/videoseries?list=PLvLW4nXp--xcMYmQCTTDE9qbt5T97wORi' : // User provided playlist
                                            selectedType === 'Meditation' ? 'https://www.youtube.com/embed/6VR0G_-11ec' : // User provided single video
                                                'https://www.youtube.com/embed/M4xqOoZRiDU' // User provided single video for breathing
                                            }`}
                                        title={`${selectedType} Playlist`}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default GuidedSession;

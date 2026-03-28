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
        <div className="min-h-screen pb-20 transition-colors duration-300">
            <div className="container mx-auto px-4 py-12 max-w-6xl">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-12"
                >
                    <div className="text-center">
                        <h1 className="text-4xl font-bold mb-4">Guided Sessions</h1>
                        <p className="text-lg opacity-80 max-w-2xl mx-auto">
                            Choose a practice that fits your current state of mind.
                        </p>
                    </div>

                    {!selectedType ? (
                        <div className="space-y-8">
                            <h2 className="text-2xl font-bold text-center mb-8">Choose Your Practice</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {activityTypes.map(({ name, icon: Icon, color, description }, index) => (
                                    <motion.div
                                        key={name}
                                        whileHover={{ y: -5 }}
                                        className="glass-panel p-8 flex flex-col items-center text-center gap-6"
                                    >
                                        <div className={`p-5 rounded-2xl bg-gradient-to-br ${color} text-white shadow-lg`}>
                                            <Icon size={48} />
                                        </div>

                                        <div className="space-y-2">
                                            <h3 className="text-2xl font-bold">{name}</h3>
                                            <p className="opacity-70 text-sm leading-relaxed">
                                                {description}
                                            </p>
                                        </div>

                                        <button
                                            onClick={() => setSelectedType(name)}
                                            className="w-full py-3 px-6 bg-primary/10 hover:bg-primary/20 text-primary font-bold rounded-xl transition-all"
                                        >
                                            Start Session
                                        </button>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                            <motion.div 
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-6"
                            >
                                <button
                                    onClick={() => setSelectedType(null)}
                                    className="text-primary font-bold flex items-center gap-2 hover:translate-x-[-4px] transition-transform"
                                >
                                    ← Back to Selection
                                </button>
                                
                                <div className="glass-panel p-8">
                                    <h2 className="text-3xl font-bold mb-6">{selectedType}</h2>
                                    <SessionTimer
                                        onComplete={handleSessionComplete}
                                        activityType={selectedType}
                                    />
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="glass-panel p-6 h-full min-h-[450px] flex flex-col"
                            >
                                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                    <Activity size={20} className="text-primary" /> Recommended Practice
                                </h3>
                                
                                <div className="flex-1 rounded-2xl overflow-hidden bg-black/10">
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        className="min-h-[300px]"
                                        src={`${selectedType === 'Yoga' ? 'https://www.youtube.com/embed/videoseries?list=PLvLW4nXp--xcMYmQCTTDE9qbt5T97wORi' : 
                                            selectedType === 'Meditation' ? 'https://www.youtube.com/embed/6VR0G_-11ec' : 
                                                'https://www.youtube.com/embed/M4xqOoZRiDU' 
                                            }`}
                                        title={`${selectedType} Video`}
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

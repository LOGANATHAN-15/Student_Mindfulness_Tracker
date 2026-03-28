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
        <div className="min-h-screen pb-20 transition-colors duration-500">
            <div className="container mx-auto px-4 py-16 max-w-6xl">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-12"
                >
                    <div className="text-center space-y-4">
                        <h1 className="text-6xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                            Guided Sessions
                        </h1>
                        <p className="text-xl text-secondary font-medium max-w-2xl mx-auto opacity-80">
                            Find your inner peace through our curated mindfulness practices. 
                            Choose a session that resonates with your current state.
                        </p>
                    </div>

                    {!selectedType ? (
                        <div className="space-y-8">
                            <h2 className="text-3xl font-bold text-center mb-10 text-primary">Choose Your Practice</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {activityTypes.map(({ name, icon: Icon, color, description }, index) => (
                                    <motion.button
                                        key={name}
                                        initial={{ opacity: 0, y: 40 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1, duration: 0.6 }}
                                        onClick={() => setSelectedType(name)}
                                        whileHover={{ y: -12, scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className={`glass-panel p-10 flex flex-col items-center text-center gap-8 cursor-pointer bg-gradient-to-br ${color} text-white shadow-2xl relative overflow-hidden group border-none`}
                                    >
                                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 group-hover:rotate-12 transition-all duration-700">
                                            <Icon size={200} />
                                        </div>

                                        <div className="relative z-10 p-6 bg-white/20 rounded-[2.5rem] backdrop-blur-xl shadow-inner group-hover:bg-white group-hover:text-primary transition-all duration-500">
                                            <Icon size={64} strokeWidth={1.5} />
                                        </div>

                                        <div className="relative z-10 space-y-3">
                                            <h3 className="text-4xl font-black tracking-tight">{name}</h3>
                                            <p className="text-white/90 font-medium leading-relaxed text-lg">
                                                {description}
                                            </p>
                                        </div>

                                        <div className="relative z-10 mt-4 px-8 py-3 bg-white text-primary rounded-2xl text-base font-bold shadow-xl shadow-black/10 transition-all transform group-hover:scale-110">
                                            Start {name}
                                        </div>
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                            <motion.div 
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-8"
                            >
                                <div className="space-y-2">
                                    <button
                                        onClick={() => setSelectedType(null)}
                                        className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-primary-dark transition-colors group mb-4"
                                    >
                                        <span className="group-hover:-translate-x-1 transition-transform">←</span> 
                                        Change Activity
                                    </button>
                                    <h2 className="text-4xl font-extrabold tracking-tight">{selectedType} Session</h2>
                                    <p className="text-secondary font-medium">Take a deep breath and prepare yourself.</p>
                                </div>

                                <div className="glass-panel p-8">
                                    <SessionTimer
                                        onComplete={handleSessionComplete}
                                        activityType={selectedType}
                                    />
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="glass-panel p-8 h-full min-h-[500px] flex flex-col shadow-2xl overflow-hidden border-primary/20"
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-2xl font-black flex items-center gap-3">
                                        <div className="p-2 bg-primary/10 rounded-lg">
                                            <Activity size={24} className="text-primary" />
                                        </div>
                                        Recommended Playlist
                                    </h3>
                                    <div className="text-xs font-bold uppercase tracking-widest text-muted">Guided Video</div>
                                </div>
                                
                                <div className="flex-1 rounded-3xl overflow-hidden shadow-2xl bg-black/40 border-4 border-white/5">
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        className="min-h-[350px]"
                                        src={`${selectedType === 'Yoga' ? 'https://www.youtube.com/embed/videoseries?list=PLvLW4nXp--xcMYmQCTTDE9qbt5T97wORi' : 
                                            selectedType === 'Meditation' ? 'https://www.youtube.com/embed/6VR0G_-11ec' : 
                                                'https://www.youtube.com/embed/M4xqOoZRiDU' 
                                            }`}
                                        title={`${selectedType} Playlist`}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                                <p className="mt-6 text-sm text-secondary font-medium italic text-center opacity-70">
                                    "Your journey of a thousand miles begins with a single step."
                                </p>
                            </motion.div>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};


export default GuidedSession;

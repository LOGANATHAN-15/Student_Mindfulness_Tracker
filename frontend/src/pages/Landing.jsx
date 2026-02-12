import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import { ArrowRight, Wind, Sun, Activity, Star } from 'lucide-react';

const Landing = () => {
    const fadeIn = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-[calc(100vh-64px)] bg-gray-50 flex flex-col justify-center overflow-hidden relative perspective-container">

            {/* 3D Background Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-[120px] floating" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[700px] h-[700px] bg-gradient-to-tl from-secondary/20 to-transparent rounded-full blur-[100px] floating-delayed" />

            <div className="container mx-auto px-4 py-20 relative z-10">
                <div className="max-w-5xl mx-auto text-center">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        variants={fadeIn}
                    >
                        <Tilt
                            tiltMaxAngleX={5}
                            tiltMaxAngleY={5}
                            perspective={1000}
                            transitionSpeed={1000}
                            scale={1.02}
                            className="inline-block"
                        >
                            <span className="px-6 py-2 rounded-full bg-white/80 border border-primary/20 text-primary-dark text-sm font-bold tracking-widest uppercase mb-8 inline-block shadow-lg backdrop-blur-sm">
                                ✨ Mindfulness Reimagined
                            </span>
                        </Tilt>

                        <h1 className="text-6xl md:text-8xl font-black text-gray-900 mb-8 leading-tight tracking-tighter drop-shadow-sm">
                            Find your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary relative inline-block">
                                Inner Zen
                                <svg className="absolute w-full h-3 -bottom-1 left-0 text-primary opacity-40" viewBox="0 0 100 10" preserveAspectRatio="none">
                                    <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="6" fill="none" />
                                </svg>
                            </span>
                        </h1>

                        <p className="text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
                            A <span className="font-semibold text-gray-800">premium</span> space to track your meditation, yoga, and breathing exercises.
                            Build consistent habits in a distraction-free environment.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            <Link to="/register">
                                <motion.button
                                    whileHover={{ scale: 1.05, boxShadow: "0 20px 40px -10px rgba(74, 222, 128, 0.4)" }}
                                    whileTap={{ scale: 0.95 }}
                                    className="btn-primary text-xl px-10 py-5 rounded-2xl shadow-xl shadow-primary/30"
                                >
                                    Start Your Journey <ArrowRight size={24} strokeWidth={3} />
                                </motion.button>
                            </Link>
                            <Link to="/login">
                                <motion.button
                                    whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,1)" }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-10 py-5 rounded-2xl text-gray-600 font-bold bg-white/50 backdrop-blur-sm border border-gray-200 hover:shadow-lg transition-all"
                                >
                                    Sign In
                                </motion.button>
                            </Link>
                        </div>
                    </motion.div>

                    {/* 3D Features Grid */}
                    <motion.div
                        initial={{ opacity: 0, y: 60 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24"
                    >
                        <Tilt tiltMaxAngleX={8} tiltMaxAngleY={8} scale={1.05} transitionSpeed={400} className="h-full">
                            <div className="glass-panel p-10 text-center h-full relative overflow-hidden group border-t-4 border-blue-400">
                                <div className="absolute inset-0 bg-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-8 shadow-lg shadow-blue-300 transform group-hover:rotate-6 transition-transform">
                                    <Wind size={40} />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-4 relative z-10">Breathing</h3>
                                <p className="text-gray-500 relative z-10 leading-relaxed">Guided logging for deep breathing sessions to reduce stress instantly.</p>
                            </div>
                        </Tilt>

                        <Tilt tiltMaxAngleX={8} tiltMaxAngleY={8} scale={1.05} transitionSpeed={400} className="h-full">
                            <div className="glass-panel p-10 text-center h-full relative overflow-hidden group border-t-4 border-green-400">
                                <div className="absolute inset-0 bg-green-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-8 shadow-lg shadow-green-300 transform group-hover:rotate-6 transition-transform">
                                    <Sun size={40} />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-4 relative z-10">Meditation</h3>
                                <p className="text-gray-500 relative z-10 leading-relaxed">Timer-based tracking for your daily meditation practice.</p>
                            </div>
                        </Tilt>

                        <Tilt tiltMaxAngleX={8} tiltMaxAngleY={8} scale={1.05} transitionSpeed={400} className="h-full">
                            <div className="glass-panel p-10 text-center h-full relative overflow-hidden group border-t-4 border-orange-400">
                                <div className="absolute inset-0 bg-orange-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-8 shadow-lg shadow-orange-300 transform group-hover:rotate-6 transition-transform">
                                    <Activity size={40} />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-4 relative z-10">Yoga</h3>
                                <p className="text-gray-500 relative z-10 leading-relaxed">Keep track of your flows and flexibility progress over time.</p>
                            </div>
                        </Tilt>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Landing;

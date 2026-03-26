import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import api from '../utils/api';
import { motion } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import {
    Activity,
    Wind,
    Flower2,
    Clock,
    Quote,
    Plus,
    History,
    TrendingUp,
    LogOut,
    UserCheck,
    Calendar,
    Award,
    BookOpen,
    Timer
} from 'lucide-react';
import useAutoLogout from '../hooks/useAutoLogout';
import ThemeToggle from '../components/ThemeToggle';
import StreakCard from '../components/StreakCard';
import MoodChart from '../components/MoodChart';

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);
    useAutoLogout(logout);

    const [stats, setStats] = useState({ totalDuration: 0, sessionCount: 0 });
    const [activities, setActivities] = useState([]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await api.get('/activities');

                const totalDuration = data.reduce((acc, curr) => acc + curr.duration, 0);
                setStats({ totalDuration, sessionCount: data.length });
                setActivities(data);
            } catch (error) {
                console.error("Error fetching stats", error);
            }
        };

        if (user) fetchStats();
    }, [user]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 }
    };


    const StatCard = ({ icon: Icon, label, value, color, delay }) => (
        // <Tilt
        //     tiltMaxAngleX={10}
        //     tiltMaxAngleY={10}
        //     scale={1.05}
        //     transitionSpeed={400}
        //     className="h-full"
        // >
        <motion.div
            variants={itemVariants}
            //   whileHover={{ y: -5 }}
            className={`glass-panel p-6 h-full flex flex-col justify-between relative overflow-hidden group border-t-4 ${color.border}`}
        >
            <div className={`absolute top-0 right-0 p-10 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-500`}>
                <Icon size={120} className={color.text} />
            </div>

            <div className="flex items-center space-x-4 z-10">
                <div className={`p-4 rounded-2xl ${color.bg} ${color.text} shadow-lg shadow-${color.shadow}/30`}>
                    <Icon size={28} />
                </div>
                <div>
                    <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider">{label}</p>
                    <h3 className="text-3xl font-bold text-gray-800 mt-1">{value}</h3>
                </div>
            </div>

            <div className="mt-6 flex items-center text-sm text-primary">

                <span>View Details</span>
                <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </div>
        </motion.div>
        // </Tilt>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-20">
            {/* Abstract 3D Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] opacity-30 floating" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-secondary/20 rounded-full blur-[120px] opacity-30 floating-delayed" />
            </div>

            <div className="container mx-auto px-4 py-12 max-w-7xl relative z-10">
                {/* <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                > */}
                <div>

                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                        <div>
                            <motion.div
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ duration: 0.8 }}
                            >
                                <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-gray-600 mb-2 drop-shadow-sm">
                                    Dashboard
                                </h1>
                                <p className="text-xl text-gray-500 flex items-center gap-2 font-medium">
                                    Welcome back, <span className="text-primary-dark">{user?.username}</span> 👋
                                </p>
                            </motion.div>
                        </div>

                        <div className="mt-6 md:mt-0 flex gap-3">
                            <ThemeToggle />
                            {user?.role === 'admin' && (
                                <Link to="/admin">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-purple-500/30 flex items-center gap-2 hover:shadow-purple-500/50 transition-all"
                                    >
                                        <UserCheck size={20} /> Admin Panel
                                    </motion.button>
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                        <StatCard
                            icon={Clock}
                            label="Mindfulness Time"
                            value={`${stats.totalDuration} min`}
                            color={{ bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-500', shadow: 'blue' }}
                        />
                        <StatCard
                            icon={TrendingUp}
                            label="Total Sessions"
                            value={stats.sessionCount}
                            color={{ bg: 'bg-green-100', text: 'text-green-600', border: 'border-green-500', shadow: 'green' }}
                        />
                        <StreakCard token={user.token} />
                    </div>

                    {/* Mood Chart */}
                    {activities.length > 0 && (
                        <div className="mb-16">
                            <h2 className="text-2xl font-bold mb-6 pl-2 border-l-4 border-primary">Your Mood Journey</h2>
                            <MoodChart activities={activities} />
                        </div>
                    )}

                    {/* Main Actions - 3D Cards */}
                    <h2 className="text-2xl font-bold mb-8 pl-2 border-l-4 border-primary">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                        <Link to="/add-activity" className="block group">
                            <Tilt
                                tiltMaxAngleX={5}
                                tiltMaxAngleY={5}
                                scale={1.02}
                                className="h-full"
                            >
                                <div className="glass-panel h-64 flex flex-col items-center justify-center p-8 border-2 border-dashed border-primary/30 group-hover:border-primary transition-all cursor-pointer relative overflow-hidden bg-gradient-to-br from-white to-primary/5">
                                    <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />

                                    <div className="z-10 bg-white p-6 rounded-full shadow-xl shadow-primary/20 mb-6 group-hover:scale-110 group-hover:shadow-primary/40 transition-all duration-300">
                                        <Plus size={48} className="text-primary" />
                                    </div>

                                    <h3 className="text-2xl font-bold text-gray-800 z-10">Log New Activity</h3>
                                    <p className="text-gray-500 mt-2 z-10 font-medium">Record meditation, yoga, or breathing</p>
                                </div>
                            </Tilt>
                        </Link>

                        <Link to="/history" className="block group">
                            <Tilt
                                tiltMaxAngleX={5}
                                tiltMaxAngleY={5}
                                scale={1.02}
                                className="h-full"
                            >
                                <div className="glass-panel h-64 flex flex-col items-center justify-center p-8 border-2 border-transparent group-hover:border-secondary/30 transition-all cursor-pointer relative overflow-hidden bg-gradient-to-br from-white dark:from-gray-800 to-secondary/5">
                                    <div className="absolute inset-0 bg-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />

                                    <div className="z-10 bg-white dark:bg-gray-800 p-6 rounded-full shadow-xl shadow-secondary/20 mb-6 group-hover:scale-110 group-hover:shadow-secondary/40 transition-all duration-300">
                                        <History size={48} className="text-secondary" />
                                    </div>

                                    <h3 className="text-2xl font-bold z-10">View History</h3>
                                    <p className="opacity-70 mt-2 z-10 font-medium">Past sessions</p>
                                </div>
                            </Tilt>
                        </Link>

                        <Link to="/journal" className="block group">
                            <Tilt
                                tiltMaxAngleX={5}
                                tiltMaxAngleY={5}
                                scale={1.02}
                                className="h-full"
                            >
                                <div className="glass-panel h-64 flex flex-col items-center justify-center p-8 border-2 border-transparent group-hover:border-purple-300 transition-all cursor-pointer relative overflow-hidden bg-gradient-to-br from-white dark:from-gray-800 to-purple-50 dark:to-purple-900/10">
                                    <div className="absolute inset-0 bg-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />

                                    <div className="z-10 bg-white dark:bg-gray-800 p-6 rounded-full shadow-xl shadow-purple-500/20 mb-6 group-hover:scale-110 group-hover:shadow-purple-500/40 transition-all duration-300">
                                        <BookOpen size={48} className="text-purple-600" />
                                    </div>

                                    <h3 className="text-2xl font-bold z-10">Journal</h3>
                                    <p className="opacity-70 mt-2 z-10 font-medium">Reflections</p>
                                </div>
                            </Tilt>
                        </Link>

                        <Link to="/guided-session" className="block group">
                            <Tilt
                                tiltMaxAngleX={5}
                                tiltMaxAngleY={5}
                                scale={1.02}
                                className="h-full"
                            >
                                <div className="glass-panel h-64 flex flex-col items-center justify-center p-8 border-2 border-transparent group-hover:border-green-300 transition-all cursor-pointer relative overflow-hidden bg-gradient-to-br from-white dark:from-gray-800 to-green-50 dark:to-green-900/10">
                                    <div className="absolute inset-0 bg-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />

                                    <div className="z-10 bg-white dark:bg-gray-800 p-6 rounded-full shadow-xl shadow-green-500/20 mb-6 group-hover:scale-110 group-hover:shadow-green-500/40 transition-all duration-300">
                                        <Timer size={48} className="text-green-600" />
                                    </div>

                                    <h3 className="text-2xl font-bold z-10">Guided Timer</h3>
                                    <p className="opacity-70 mt-2 z-10 font-medium">Timed sessions</p>
                                </div>
                            </Tilt>
                        </Link>
                    </div>

                    {/* Quote Section with 3D Pop */}
                    <motion.div
                        variants={itemVariants}
                        className="relative mt-12"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-2xl transform rotate-1 opacity-20 blur-lg"></div>
                        <div className="glass-panel bg-white/80 p-10 rounded-2xl relative border-l-8 border-primary shadow-2xl">
                            <Quote className="absolute top-6 left-6 text-primary/20 transform -scale-x-100" size={80} />
                            <blockquote className="text-center relative z-10">
                                <p className="text-2xl italic text-gray-700 font-serif leading-relaxed">
                                    "The present moment is filled with joy and happiness. If you are attentive, you will see it."
                                </p>
                                <footer className="mt-6 text-gray-500 font-bold uppercase tracking-widest text-sm">
                                    — Thich Nhat Hanh
                                </footer>
                            </blockquote>
                        </div>
                    </motion.div>

                </div>
            </div>
        </div>
    );
};

export default Dashboard;

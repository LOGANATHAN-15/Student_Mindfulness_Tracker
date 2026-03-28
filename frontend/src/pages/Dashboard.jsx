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
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { staggerChildren: 0.1, duration: 0.8 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { opacity: 1, scale: 1 }
    };

    const StatCard = ({ icon: Icon, label, value, color, delay }) => (
        <motion.div
            variants={itemVariants}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className={`glass-panel p-6 h-full flex flex-col justify-between relative overflow-hidden border-l-4 ${color.border}`}
        >
            <div className="flex items-center gap-4 z-10">
                <div className={`p-3 rounded-2xl ${color.bg} ${color.text}`}>
                    <Icon size={24} />
                </div>
                <div>
                    <h3 className="text-2xl font-bold">{value}</h3>
                    <p className="text-sm font-medium text-muted">{label}</p>
                </div>
            </div>
        </motion.div>
    );

    return (
        <div className="min-h-screen transition-colors duration-300">
            <div className="container mx-auto px-4 py-8 max-w-6xl relative z-10">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="space-y-12"
                >
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-6 mb-8">
                        <div className="text-center md:text-left">
                            <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
                            <p className="text-lg opacity-80">
                                Welcome back, <span className="text-primary font-semibold">{user?.username}</span> 👋
                            </p>
                        </div>

                        <div className="flex items-center gap-4">
                            <ThemeToggle />
                            {user?.role === 'admin' && (
                                <Link to="/admin">
                                    <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-xl font-semibold shadow-lg transition-all flex items-center gap-2">
                                        <UserCheck size={18} /> Admin Portal
                                    </button>
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <StatCard
                            icon={Clock}
                            label="Practice Time"
                            value={`${stats.totalDuration}m`}
                            color={{ bg: 'bg-blue-500/10', text: 'text-blue-500', border: 'border-blue-500' }}
                        />
                        <StatCard
                            icon={TrendingUp}
                            label="Total Sessions"
                            value={stats.sessionCount}
                            color={{ bg: 'bg-green-500/10', text: 'text-green-500', border: 'border-green-500' }}
                        />
                        <div className="lg:col-span-1">
                            <StreakCard token={user.token} />
                        </div>
                    </section>

                    {/* Mood Analysis */}
                    {activities.length > 0 && (
                        <motion.section variants={itemVariants} className="space-y-6">
                            <h2 className="text-2xl font-bold">Progress Overview</h2>
                            <div className="glass-panel p-6">
                                <MoodChart activities={activities} />
                            </div>
                        </motion.section>
                    )}

                    {/* Actions Grid */}
                    <section className="space-y-6">
                        <h2 className="text-2xl font-bold">Quick Actions</h2>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { to: "/add-activity", icon: Plus, label: "Log Activity", sub: "New session", color: "primary", iconColor: "text-primary" },
                                { to: "/history", icon: History, label: "History", sub: "View past logs", color: "secondary", iconColor: "text-secondary" },
                                { to: "/journal", icon: BookOpen, label: "Journal", sub: "Reflect now", color: "purple", iconColor: "text-purple-500" },
                                { to: "/guided-session", icon: Timer, label: "Practices", sub: "Start session", color: "green", iconColor: "text-green-500" },
                            ].map((action) => (
                                <Link key={action.to} to={action.to} className="group">
                                    <div className={`glass-panel p-8 flex flex-col items-center justify-center text-center hover:shadow-xl transition-all border border-transparent hover:border-${action.color}/20 min-h-[180px]`}>
                                        <div className="mb-4 p-4 rounded-full bg-surface shadow-md group-hover:scale-110 transition-transform">
                                            <action.icon size={32} className={action.iconColor} />
                                        </div>
                                        <h3 className="text-xl font-bold">{action.label}</h3>
                                        <p className="text-sm opacity-60 mt-1">{action.sub}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>

                    {/* Wisdom Section */}
                    <motion.section variants={itemVariants} className="pt-8">
                        <div className="glass-panel p-12 text-center bg-gradient-to-br from-transparent to-primary/5">
                            <div className="max-w-3xl mx-auto space-y-6">
                                <p className="text-2xl md:text-3xl font-medium italic opacity-90 leading-relaxed">
                                    "The present moment is filled with joy and happiness. If you are attentive, you will see it."
                                </p>
                                <footer className="pt-4 border-t border-border-color mt-6 inline-block">
                                    <cite className="text-lg font-bold text-primary not-italic">
                                        Thich Nhat Hanh
                                    </cite>
                                </footer>
                            </div>
                        </div>
                    </motion.section>
                </motion.div>
            </div>
        </div>
    );

};


export default Dashboard;

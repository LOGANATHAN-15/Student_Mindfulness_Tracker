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
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
            className={`glass-panel p-8 h-full flex flex-col justify-between relative overflow-hidden group border-b-4 ${color.border}`}
        >
            <div className="absolute -top-6 -right-6 p-12 opacity-[0.03] dark:opacity-[0.05] group-hover:scale-125 group-hover:rotate-12 transition-all duration-700">
                <Icon size={160} />
            </div>

            <div className="flex items-center gap-6 z-10">
                <div className={`p-5 rounded-3xl ${color.bg} ${color.text} shadow-xl shadow-black/5 group-hover:scale-110 transition-transform duration-500`}>
                    <Icon size={32} strokeWidth={2.5} />
                </div>
                <div>
                    <h3 className="text-4xl font-black tracking-tight">{value}</h3>
                    <p className="text-sm font-bold uppercase tracking-widest text-muted mt-1">{label}</p>
                </div>
            </div>

            <div className="mt-8 flex items-center justify-between text-xs font-bold uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-all duration-300">
                <span className="text-primary">Performance Trend</span>
                <TrendingUp size={14} className="text-primary" />
            </div>
        </motion.div>
    );

    return (
        <div className="min-h-screen transition-colors duration-500 overflow-x-hidden">
            {/* Ambient Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-primary/10 rounded-full blur-[150px] animate-float opacity-40" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[900px] h-[900px] bg-secondary/10 rounded-full blur-[180px] animate-float-delayed opacity-40" />
            </div>

            <div className="container mx-auto px-4 py-16 max-w-7xl relative z-10">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="space-y-16"
                >
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-8 border-b border-primary/10 pb-12">
                        <div className="text-center md:text-left space-y-2">
                            <h1 className="text-7xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-primary via-secondary to-accent-tertiary animate-gradient-x">
                                Dashboard
                            </h1>
                            <p className="text-2xl font-medium text-secondary flex items-center justify-center md:justify-start gap-3">
                                Welcome, <span className="font-black text-primary">{user?.username}</span> 
                                <motion.span animate={{ rotate: [0, 20, 0] }} transition={{ repeat: Infinity, duration: 2 }}>👋</motion.span>
                            </p>
                        </div>

                        <div className="flex items-center gap-4">
                            <ThemeToggle />
                            {user?.role === 'admin' && (
                                <Link to="/admin">
                                    <motion.button
                                        whileHover={{ scale: 1.05, boxShadow: '0 20px 25px -5px rgba(168, 85, 247, 0.4)' }}
                                        whileTap={{ scale: 0.95 }}
                                        className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-purple-500/20 flex items-center gap-3 transition-all"
                                    >
                                        <UserCheck size={22} strokeWidth={2.5} /> ADMIN PORTAL
                                    </motion.button>
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        <StatCard
                            icon={Clock}
                            label="Practice Time"
                            value={`${stats.totalDuration}m`}
                            color={{ bg: 'bg-blue-500/10', text: 'text-blue-500', border: 'border-blue-500', shadow: 'blue' }}
                        />
                        <StatCard
                            icon={TrendingUp}
                            label="Total Sessions"
                            value={stats.sessionCount}
                            color={{ bg: 'bg-green-500/10', text: 'text-green-500', border: 'border-green-500', shadow: 'green' }}
                        />
                        <div className="lg:col-span-1">
                            <StreakCard token={user.token} />
                        </div>
                    </section>

                    {/* Mood Analysis */}
                    {activities.length > 0 && (
                        <motion.section variants={itemVariants} className="space-y-8">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-2 bg-primary rounded-full" />
                                <h2 className="text-3xl font-black tracking-tight">Emotional Landscape</h2>
                            </div>
                            <div className="glass-panel p-8 shadow-2xl">
                                <MoodChart activities={activities} />
                            </div>
                        </motion.section>
                    )}

                    {/* Actions Grid */}
                    <section className="space-y-10 group/actions">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-2 bg-secondary rounded-full" />
                            <h2 className="text-3xl font-black tracking-tight text-secondary">Quick Actions</h2>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[
                                { to: "/add-activity", icon: Plus, label: "Log Growth", sub: "Record a session", color: "primary", iconColor: "text-primary" },
                                { to: "/history", icon: History, label: "Reflection", sub: "Past journey", color: "secondary", iconColor: "text-secondary" },
                                { to: "/journal", icon: BookOpen, label: "Thoughts", sub: "Daily notes", color: "purple", iconColor: "text-purple-500" },
                                { to: "/guided-session", icon: Timer, label: "Immerse", sub: "Zen timer", color: "green", iconColor: "text-green-500" },
                            ].map((action, idx) => (
                                <Link key={action.to} to={action.to} className="group/card h-full">
                                    <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} scale={1.05} className="h-full">
                                        <div className={`glass-panel h-full min-h-[220px] flex flex-col items-center justify-center p-8 border-2 border-transparent group-hover/card:border-${action.color}-500/30 transition-all cursor-pointer relative overflow-hidden bg-gradient-to-br from-transparent to-${action.color}-500/[0.03]`}>
                                            <div className={`absolute inset-0 bg-${action.color}-500/5 opacity-0 group-hover/card:opacity-100 transition-opacity duration-700 blur-2xl`} />
                                            
                                            <div className={`z-10 bg-surface p-6 rounded-[2rem] shadow-2xl group-hover/card:scale-110 group-hover/card:rotate-6 transition-all duration-500`}>
                                                <action.icon size={42} className={action.iconColor} strokeWidth={2.5} />
                                            </div>

                                            <h3 className="text-2xl font-black mt-6 z-10">{action.label}</h3>
                                            <p className="text-muted text-sm font-bold uppercase tracking-widest mt-1 z-10">{action.sub}</p>
                                        </div>
                                    </Tilt>
                                </Link>
                            ))}
                        </div>
                    </section>

                    {/* Wisdom Section */}
                    <motion.section 
                        variants={itemVariants}
                        className="relative pt-10"
                    >
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-20 bg-gradient-to-b from-transparent to-primary/30" />
                        <div className="glass-panel p-16 text-center relative overflow-hidden group">
                           <Quote className="absolute -top-4 -left-4 text-primary opacity-5 transform -rotate-12 group-hover:scale-110 transition-transform duration-1000" size={200} />
                           <Quote className="absolute -bottom-4 -right-4 text-secondary opacity-5 transform rotate-12" size={200} />
                           
                           <blockquote className="relative z-10 max-w-4xl mx-auto space-y-8">
                                <p className="text-4xl md:text-5xl font-black italic tracking-tighter leading-[1.1] text-transparent bg-clip-text bg-gradient-to-r from-text-primary to-text-secondary">
                                    "The present moment is filled with joy and happiness. If you are attentive, you will see it."
                                </p>
                                <footer className="flex flex-col items-center gap-2">
                                    <div className="h-1 w-12 bg-primary rounded-full" />
                                    <cite className="text-xl font-black uppercase tracking-[0.2em] text-primary not-italic">
                                        Thich Nhat Hanh
                                    </cite>
                                </footer>
                           </blockquote>
                        </div>
                    </motion.section>
                </motion.div>
            </div>
        </div>
    );
};


export default Dashboard;

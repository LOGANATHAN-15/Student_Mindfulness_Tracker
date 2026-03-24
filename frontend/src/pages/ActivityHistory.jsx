import { useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Calendar, Clock, ArrowLeft, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { moodEmojis } from '../components/MoodSelector';
import useAutoLogout from '../hooks/useAutoLogout';

const ActivityHistory = () => {
    const { user, logout } = useContext(AuthContext);
    useAutoLogout(logout);
    const [activities, setActivities] = useState([]);
    const [expandedJournal, setExpandedJournal] = useState(null);

    const fetchActivities = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.get('http://localhost:5000/api/activities', config);
            setActivities(data);
        } catch (error) {
            console.error(error);
        }
    };

    useState(() => {
        if (user) fetchActivities();
    }, [user]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this activity?')) {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                };
                await axios.delete(`http://localhost:5000/api/activities/${id}`, config);
                setActivities(activities.filter((activity) => activity._id !== id));
            } catch (error) {
                console.error(error);
            }
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link to="/dashboard" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <ArrowLeft size={24} className="text-gray-600" />
                    </Link>
                    <h2 className="text-2xl font-bold text-gray-800">Your Journey</h2>
                </div>
                <div className="text-gray-500">
                    {activities.length} entries
                </div>
            </div>

            {activities.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                        <Calendar size={32} />
                    </div>
                    <p className="text-gray-500 text-lg">No activities logged yet.</p>
                    <Link to="/add-activity" className="text-primary font-medium hover:underline mt-2 inline-block">
                        Start your first session
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    <AnimatePresence>
                        {activities.map((activity, index) => (
                            <motion.div
                                key={activity._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -100 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group relative"
                            >
                                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                                    <div className="flex items-start gap-4">
                                        <div className={`p-3 rounded-xl ${activity.type === 'Meditation' ? 'bg-green-100 text-green-600' :
                                            activity.type === 'Yoga' ? 'bg-orange-100 text-orange-600' :
                                                'bg-blue-100 text-blue-600'
                                            }`}>
                                            {activity.type === 'Meditation' ? <span className="text-2xl">🧘</span> :
                                                activity.type === 'Yoga' ? <span className="text-2xl">🤸</span> :
                                                    <span className="text-2xl">🌬️</span>}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <h3 className="font-bold text-gray-800">{activity.type}</h3>
                                                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 font-medium flex items-center gap-1">
                                                    <Clock size={12} /> {activity.duration} min
                                                </span>
                                            </div>
                                            <p className="text-gray-500 text-sm mb-2">{new Date(activity.date).toLocaleDateString(undefined, {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}</p>
                                            {activity.notes && (
                                                <p className="opacity-75 bg-gray-100 dark:bg-gray-800 p-3 rounded-lg text-sm italic">
                                                    "{activity.notes}"
                                                </p>
                                            )}

                                            {/* Mood Display */}
                                            {(activity.moodBefore || activity.moodAfter) && (
                                                <div className="flex items-center gap-3 mt-3 p-3 bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 rounded-lg">
                                                    {activity.moodBefore && (
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm font-medium opacity-70">Before:</span>
                                                            <span className="text-xl">{moodEmojis[activity.moodBefore]?.emoji}</span>
                                                            <span className="text-sm font-bold">{activity.moodBefore}/10</span>
                                                        </div>
                                                    )}
                                                    {activity.moodBefore && activity.moodAfter && (
                                                        <span className="text-xl">→</span>
                                                    )}
                                                    {activity.moodAfter && (
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm font-medium opacity-70">After:</span>
                                                            <span className="text-xl">{moodEmojis[activity.moodAfter]?.emoji}</span>
                                                            <span className="text-sm font-bold">{activity.moodAfter}/10</span>
                                                        </div>
                                                    )}
                                                    {activity.moodBefore && activity.moodAfter && activity.moodAfter > activity.moodBefore && (
                                                        <span className="ml-auto px-2 py-1 bg-green-500 text-white text-xs rounded-full font-bold">
                                                            +{activity.moodAfter - activity.moodBefore}
                                                        </span>
                                                    )}
                                                </div>
                                            )}

                                            {/* Journal Entry Preview */}
                                            {activity.journalEntry && (
                                                <div className="mt-3">
                                                    <button
                                                        onClick={() => setExpandedJournal(expandedJournal === activity._id ? null : activity._id)}
                                                        className="flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                                                    >
                                                        <BookOpen size={16} />
                                                        {expandedJournal === activity._id ? 'Hide' : 'View'} Journal Entry
                                                    </button>
                                                    {expandedJournal === activity._id && (
                                                        <motion.div
                                                            initial={{ opacity: 0, height: 0 }}
                                                            animate={{ opacity: 1, height: 'auto' }}
                                                            exit={{ opacity: 0, height: 0 }}
                                                            className="mt-2 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border-l-4 border-yellow-500"
                                                        >
                                                            <p className="text-sm whitespace-pre-wrap">{activity.journalEntry}</p>
                                                        </motion.div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleDelete(activity._id)}
                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors sm:self-center self-end"
                                        title="Delete Entry"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
};

export default ActivityHistory;

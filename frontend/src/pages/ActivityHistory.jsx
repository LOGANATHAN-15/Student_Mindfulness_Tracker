import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Calendar, Clock, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const ActivityHistory = () => {
    const { user } = useContext(AuthContext);
    const [activities, setActivities] = useState([]);

    useEffect(() => {
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
                                                <p className="text-gray-600 bg-gray-50 p-3 rounded-lg text-sm italic">
                                                    "{activity.notes}"
                                                </p>
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

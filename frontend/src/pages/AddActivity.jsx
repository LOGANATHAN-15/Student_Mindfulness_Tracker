import { useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, AlignLeft, Save, X } from 'lucide-react';

const AddActivity = () => {
    const { user } = useContext(AuthContext);
    const [type, setType] = useState('Meditation');
    const [duration, setDuration] = useState('');
    const [notes, setNotes] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            await axios.post('http://localhost:5000/api/activities', { type, duration, notes }, config);
            navigate('/dashboard');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-xl overflow-hidden p-8"
            >
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-800">Log New Activity</h2>
                    <button onClick={() => navigate('/dashboard')} className="text-gray-400 hover:text-gray-600">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Activity Type</label>
                        <div className="grid grid-cols-3 gap-4">
                            {['Meditation', 'Yoga', 'Breathing'].map((t) => (
                                <button
                                    key={t}
                                    type="button"
                                    onClick={() => setType(t)}
                                    className={`py-3 px-4 rounded-xl border transition-all ${type === t
                                            ? 'bg-primary/10 border-primary text-primary-dark font-semibold'
                                            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Clock size={18} className="text-gray-400" />
                            </div>
                            <input
                                type="number"
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                                className="input-field pl-10"
                                placeholder="e.g. 15"
                                required
                                min="1"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                        <div className="relative">
                            <div className="absolute top-3 left-3 pointer-events-none">
                                <AlignLeft size={18} className="text-gray-400" />
                            </div>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="input-field pl-10 pt-3 h-32 resize-none"
                                placeholder="How did you feel?"
                            ></textarea>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button type="submit" className="flex-1 btn-primary py-3">
                            <Save size={18} /> Save Session
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/dashboard')}
                            className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default AddActivity;

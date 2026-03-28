import { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Plus, Search, Tag, Edit2, Trash2, Calendar } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import useAutoLogout from '../hooks/useAutoLogout';
import api from '../utils/api';
import MoodSelector, { moodEmojis } from '../components/MoodSelector';

const Journal = () => {
    const { user, logout } = useContext(AuthContext);
    useAutoLogout(logout);

    const [journals, setJournals] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingJournal, setEditingJournal] = useState(null);

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        mood: null,
        tags: []
    });
    const [tagInput, setTagInput] = useState('');

    useEffect(() => {
        fetchJournals();
    }, []);

    const fetchJournals = async () => {
        try {
            const { data } = await api.get('/journals');
            setJournals(data);
        } catch (error) {
            console.error('Error fetching journals:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingJournal) {
                await api.put(`/journals/${editingJournal._id}`, formData);
            } else {
                await api.post('/journals', formData);
            }

            fetchJournals();
            resetForm();
            setShowCreateModal(false);
        } catch (error) {
            console.error('Error saving journal:', error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this journal entry?')) return;

        try {
            await api.delete(`/journals/${id}`);
            fetchJournals();
        } catch (error) {
            console.error('Error deleting journal:', error);
        }
    };

    const resetForm = () => {
        setFormData({ title: '', content: '', mood: null, tags: [] });
        setTagInput('');
        setEditingJournal(null);
    };

    const addTag = () => {
        if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
            setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
            setTagInput('');
        }
    };

    const removeTag = (tagToRemove) => {
        setFormData({ ...formData, tags: formData.tags.filter(t => t !== tagToRemove) });
    };

    const filteredJournals = journals.filter(journal =>
        journal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        journal.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        journal.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pb-20">
            <div className="container mx-auto px-4 py-12 max-w-6xl">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-2">
                            Reflection Journal
                        </h1>
                        <p className="text-xl opacity-70 dark:text-gray-300">Your mindfulness journey in words</p>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowCreateModal(true)}
                        className="btn-primary"
                    >
                        <Plus size={20} />
                        New Entry
                    </motion.button>
                </div>

                {/* Search */}
                <div className="glass-panel card-bg p-4 mb-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search journals..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent dark:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-800 dark:text-gray-100 placeholder-gray-400"
                        />
                    </div>
                </div>

                {/* Journal Entries */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <AnimatePresence>
                        {filteredJournals.map((journal) => (
                            <motion.div
                                key={journal._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="glass-panel card-bg p-6 space-y-3 hover:shadow-2xl transition-shadow"
                            >
                                <div className="flex justify-between items-start">
                                    <h3 className="text-xl font-bold flex-1 dark:text-gray-100">{journal.title}</h3>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => {
                                                setEditingJournal(journal);
                                                setFormData({
                                                    title: journal.title,
                                                    content: journal.content,
                                                    mood: journal.mood,
                                                    tags: journal.tags || []
                                                });
                                                setShowCreateModal(true);
                                            }}
                                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(journal._id)}
                                            className="p-2 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg text-red-500"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                <p className="opacity-75 line-clamp-3">{journal.content}</p>

                                <div className="flex items-center gap-2 text-sm opacity-60">
                                    <Calendar size={14} />
                                    {new Date(journal.createdAt).toLocaleDateString()}
                                </div>

                                {journal.mood && (
                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl">{moodEmojis[journal.mood]?.emoji}</span>
                                        <span className="text-sm opacity-70">{moodEmojis[journal.mood]?.label}</span>
                                    </div>
                                )}

                                {journal.tags && journal.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {journal.tags.map((tag, idx) => (
                                            <span
                                                key={idx}
                                                className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs flex items-center gap-1"
                                            >
                                                <Tag size={12} />
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {filteredJournals.length === 0 && (
                    <div className="text-center py-20 opacity-70">
                        <BookOpen size={64} className="mx-auto mb-4" />
                        <p className="text-xl">No journal entries found</p>
                        <p className="text-sm mt-2">Start writing to capture your thoughts and reflections</p>
                    </div>
                )}

                {/* Create/Edit Modal */}
                <AnimatePresence>
                    {showCreateModal && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                            onClick={() => {
                                setShowCreateModal(false);
                                resetForm();
                            }}
                        >
                            <motion.div
                                initial={{ scale: 0.9, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0.9, y: 20 }}
                                className="glass-panel p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <h2 className="text-3xl font-bold mb-6">
                                    {editingJournal ? 'Edit Entry' : 'New Journal Entry'}
                                </h2>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="p-4 bg-primary/5 dark:bg-primary/10 rounded-xl border border-primary/20">
                                            <p className="text-sm font-medium opacity-70">Journaling helps track your emotional patterns over time.</p>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold mb-2">Title</label>
                                        <input
                                            type="text"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            className="input-field"
                                            required
                                            placeholder="Give your entry a title..."
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold mb-2">Content</label>
                                        <textarea
                                            value={formData.content}
                                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                            className="input-field min-h-[200px] resize-y"
                                            required
                                            placeholder="Write your thoughts..."
                                        />
                                    </div>

                                    <MoodSelector
                                        value={formData.mood}
                                        onChange={(mood) => setFormData({ ...formData, mood })}
                                        label="How are you feeling?"
                                    />

                                    <div>
                                        <label className="block text-sm font-semibold mb-2">Tags</label>
                                        <div className="flex gap-2 mb-2">
                                            <input
                                                type="text"
                                                value={tagInput}
                                                onChange={(e) => setTagInput(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                                className="input-field flex-1"
                                                placeholder="Add a tag..."
                                            />
                                            <button
                                                type="button"
                                                onClick={addTag}
                                                className="px-4 py-2 bg-primary text-white rounded-xl"
                                            >
                                                Add
                                            </button>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {formData.tags.map((tag, idx) => (
                                                <span
                                                    key={idx}
                                                    className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm flex items-center gap-2"
                                                >
                                                    {tag}
                                                    <button
                                                        type="button"
                                                        onClick={() => removeTag(tag)}
                                                        className="hover:text-red-500"
                                                    >
                                                        ×
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex gap-3 pt-4">
                                        <button type="submit" className="btn-primary flex-1">
                                            {editingJournal ? 'Update' : 'Save'} Entry
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowCreateModal(false);
                                                resetForm();
                                            }}
                                            className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-xl font-medium"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Journal;

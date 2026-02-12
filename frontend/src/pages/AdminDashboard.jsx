import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Users, BarChart as BarChartIcon, Activity } from 'lucide-react';

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };

                const usersRes = await axios.get('http://localhost:5000/api/admin/users', config);
                setUsers(usersRes.data);

                const statsRes = await axios.get('http://localhost:5000/api/admin/stats', config);
                setStats(statsRes.data);
            } catch (error) {
                console.error("Error fetching admin data", error);
            }
        };

        if (user && user.role === 'admin') {
            fetchData();
        }
    }, [user]);

    if (!user || user.role !== 'admin') {
        return <div className="p-8 text-center text-red-500">Access Denied. Admins Only.</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <h1 className="text-3xl font-bold mb-8 text-gray-800 flex items-center gap-3">
                <Users className="text-primary" /> Admin Portal
            </h1>

            {/* Stats Cards */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <p className="text-gray-500 mb-1">Total Users</p>
                        <h2 className="text-3xl font-bold text-gray-800">{stats.totalUsers}</h2>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <p className="text-gray-500 mb-1">Total Activities</p>
                        <h2 className="text-3xl font-bold text-blue-600">{stats.totalActivities}</h2>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <p className="text-gray-500 mb-1">Platform Engagement</p>
                        <h2 className="text-3xl font-bold text-green-600">
                            {stats.totalUsers > 0 ? (stats.totalActivities / stats.totalUsers).toFixed(1) : 0} avg/user
                        </h2>
                    </div>
                </div>
            )}

            {/* User List */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h3 className="text-xl font-semibold text-gray-700">Registered Users</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-gray-500 font-medium">Username</th>
                                <th className="px-6 py-4 text-gray-500 font-medium">Email</th>
                                <th className="px-6 py-4 text-gray-500 font-medium">Role</th>
                                <th className="px-6 py-4 text-gray-500 font-medium">Last Login</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {users.map((u) => (
                                <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900">{u.username}</td>
                                    <td className="px-6 py-4 text-gray-600">{u.email}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'
                                            }`}>
                                            {u.role.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 text-sm">
                                        {u.lastLogin ? new Date(u.lastLogin).toLocaleDateString() : 'Never'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;

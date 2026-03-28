import { Link, useLocation } from 'react-router-dom';
import { useContext, useState } from 'react';
import AuthContext from '../context/AuthContext';
import { Menu, X, LogOut, User, History, PlusCircle, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    const NavLink = ({ to, icon: Icon, children }) => (
        <Link
            to={to}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${isActive(to)
                    ? 'bg-primary/10 text-primary-dark font-medium'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-primary'
                }`}
            onClick={() => setIsOpen(false)}
        >
            {Icon && <Icon size={18} />}
            <span>{children}</span>
        </Link>
    );

    return (
        <nav className="sticky top-0 z-50 transition-all duration-500 border-b border-white/5" style={{ backgroundColor: 'var(--bg-glass)', backdropFilter: 'blur(16px)' }}>
            <div className="container mx-auto px-6">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-3 group">
                        <motion.div 
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.8 }}
                            className="w-10 h-10 bg-gradient-to-tr from-primary to-secondary rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-primary/20"
                        >
                            M
                        </motion.div>
                        <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-tighter">
                            MindfulTrack
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center space-x-2">
                        {user ? (
                            <>
                                <NavLink to="/dashboard" icon={LayoutDashboard}>Dashboard</NavLink>
                                <NavLink to="/add-activity" icon={PlusCircle}>Activity</NavLink>
                                <NavLink to="/history" icon={History}>History</NavLink>

                                <div className="h-8 w-px bg-border-color mx-4"></div>

                                <div className="flex items-center space-x-4 ml-2">
                                    <div className="flex flex-col text-right">
                                        <span className="text-xs font-black uppercase tracking-widest text-muted">Aura</span>
                                        <span className="text-sm font-bold text-primary">{user.username}</span>
                                    </div>
                                    <button
                                        onClick={logout}
                                        className="p-3 rounded-2xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300"
                                        title="Logout"
                                    >
                                        <LogOut size={20} />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="px-6 py-2 font-bold text-secondary hover:text-primary transition-all">
                                    Login
                                </Link>
                                <Link to="/register" className="btn-premium">
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 rounded-xl text-secondary hover:bg-primary/10 transition-colors"
                        >
                            {isOpen ? <X size={32} /> : <Menu size={32} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="md:hidden border-t border-border-color bg-surface overflow-hidden shadow-2xl m-4 rounded-3xl"
                    >
                        <div className="flex flex-col p-6 space-y-3">
                            {user ? (
                                <>
                                    <NavLink to="/dashboard" icon={LayoutDashboard}>Dashboard</NavLink>
                                    <NavLink to="/add-activity" icon={PlusCircle}>Log Activity</NavLink>
                                    <NavLink to="/history" icon={History}>History</NavLink>
                                    <hr className="border-border-color my-4" />
                                    <button
                                        onClick={() => { logout(); setIsOpen(false); }}
                                        className="flex items-center justify-center space-x-2 px-6 py-4 bg-red-500 text-white font-black rounded-2xl w-full shadow-lg shadow-red-500/20"
                                    >
                                        <LogOut size={20} />
                                        <span>SIGN OUT</span>
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        className="block px-6 py-4 text-center font-bold text-secondary hover:bg-primary/5 rounded-2xl"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="block px-6 py-4 btn-premium text-center"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Get Started
                                    </Link>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;

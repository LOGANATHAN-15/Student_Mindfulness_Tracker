import { Link, useLocation } from 'react-router-dom';
import { useContext, useState } from 'react';
import AuthContext from '../context/AuthContext';
import { Menu, X, LogOut, User, History, PlusCircle, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    const NavLink = ({ to, icon: Icon, children }) => (
        <Link
            to={to}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${isActive(to)
                    ? 'bg-primary/10 text-primary-dark dark:text-primary font-medium'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-primary'
                }`}
            onClick={() => setIsOpen(false)}
        >
            {Icon && <Icon size={18} />}
            <span>{children}</span>
        </Link>
    );

    return (
        <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-100 dark:border-slate-800 shadow-sm">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-tr from-primary to-secondary rounded-lg flex items-center justify-center text-white font-bold text-xl">
                            M
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-dark to-secondary font-sans tracking-tight">
                            MindfulTrack
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center space-x-4">
                        {user ? (
                            <>
                                <NavLink to="/dashboard" icon={LayoutDashboard}>Dashboard</NavLink>
                                <NavLink to="/add-activity" icon={PlusCircle}>Log Activity</NavLink>
                                <NavLink to="/history" icon={History}>History</NavLink>

                                <div className="h-6 w-px bg-gray-200 dark:bg-slate-700 mx-2"></div>
                                <ThemeToggle />

                                <div className="flex items-center space-x-3 ml-2">
                                    <div className="text-sm text-gray-500 dark:text-gray-400 font-medium hidden lg:block">
                                        Hi, {user.username}
                                    </div>
                                    <button
                                        onClick={logout}
                                        className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-red-500 transition-colors px-3 py-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20"
                                    >
                                        <LogOut size={18} />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <ThemeToggle />
                                <Link to="/login" className="text-gray-600 dark:text-gray-300 hover:text-primary font-medium px-4 py-2 transition-colors">
                                    Login
                                </Link>
                                <Link to="/register" className="btn-primary">
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center gap-2">
                        <ThemeToggle />
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-gray-500 dark:text-gray-400 hover:text-primary focus:outline-none"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden border-t border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden"
                    >
                        <div className="flex flex-col p-4 space-y-2">
                            {user ? (
                                <>
                                    <NavLink to="/dashboard" icon={LayoutDashboard}>Dashboard</NavLink>
                                    <NavLink to="/add-activity" icon={PlusCircle}>Log Activity</NavLink>
                                    <NavLink to="/history" icon={History}>History</NavLink>
                                    <hr className="border-gray-100 dark:border-slate-800 my-2" />
                                    <button
                                        onClick={() => { logout(); setIsOpen(false); }}
                                        className="flex items-center space-x-2 px-4 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg w-full text-left"
                                    >
                                        <LogOut size={18} />
                                        <span>Logout</span>
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        className="block px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-lg"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="block px-4 py-2 bg-primary text-white text-center rounded-lg mt-2"
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

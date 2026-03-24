import { useContext } from 'react';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import ThemeContext from '../context/ThemeContext';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useContext(ThemeContext);

    return (
        <motion.button
            onClick={toggleTheme}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 hover:from-primary/20 hover:to-secondary/20 transition-all shadow-lg"
            aria-label="Toggle theme"
        >
            <motion.div
                initial={false}
                animate={{ rotate: theme === 'dark' ? 180 : 0 }}
                transition={{ duration: 0.3 }}
            >
                {theme === 'light' ? (
                    <Moon size={24} className="text-primary" />
                ) : (
                    <Sun size={24} className="text-yellow-400" />
                )}
            </motion.div>
        </motion.button>
    );
};

export default ThemeToggle;

import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { AuthContext } from '../context/AuthContext';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useContext(ThemeContext);
    const { user } = useContext(AuthContext);

    if (!user) return null;

    return (
        <button 
            className="fixed top-4 right-4 p-2 rounded-full 
                       bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-100 
                       shadow-md hover:shadow-lg transition-all duration-300 z-50"
            onClick={toggleTheme}
            aria-label={`Toggle to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
        >
            {theme === 'light' ? '☀️' : '🌙'}
        </button>
    );
};

export default ThemeToggle;
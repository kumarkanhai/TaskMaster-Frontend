import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const RegisterForm = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);
        const success = await register(username, email, password);
        
        if (success) {
            navigate('/');
        } else {
            setError('Registration failed. Please try again.');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
            <form 
                onSubmit={handleSubmit} 
                className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md space-y-6"
            >
                <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white">Register</h2>

                {error && <p className="text-red-600 bg-red-100 dark:bg-red-900 p-3 rounded-md text-sm">{error}</p>}

                <label className="block">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">Username</span>
                    <input 
                        type="text" 
                        placeholder="Your Username" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        required 
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm 
                                   focus:ring-blue-500 focus:border-blue-500 bg-gray-50 dark:bg-gray-700 
                                   text-gray-900 dark:text-gray-100 p-3"
                    />
                </label>

                <label className="block">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">Email Address</span>
                    <input 
                        type="email" 
                        placeholder="your@example.com" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm 
                                   focus:ring-blue-500 focus:border-blue-500 bg-gray-50 dark:bg-gray-700 
                                   text-gray-900 dark:text-gray-100 p-3"
                    />
                </label>

                <label className="block">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">Password</span>
                    <input 
                        type="password" 
                        placeholder="••••••••" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm 
                                   focus:ring-blue-500 focus:border-blue-500 bg-gray-50 dark:bg-gray-700 
                                   text-gray-900 dark:text-gray-100 p-3"
                    />
                </label>

                <label className="block">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">Confirm Password</span>
                    <input 
                        type="password" 
                        placeholder="••••••••" 
                        value={confirmPassword} 
                        onChange={(e) => setConfirmPassword(e.target.value)} 
                        required 
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm 
                                   focus:ring-blue-500 focus:border-blue-500 bg-gray-50 dark:bg-gray-700 
                                   text-gray-900 dark:text-gray-100 p-3"
                    />
                </label>

                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full px-4 py-3 bg-green-600 text-white font-bold rounded-md 
                               hover:bg-green-700 disabled:bg-green-400 transition-colors shadow-md"
                >
                    {loading ? 'Registering...' : 'Register'}
                </button>

                <p className="text-center text-gray-600 dark:text-gray-400 text-sm">
                    Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Login here</Link>
                </p>
            </form>
        </div>
    );
};

export default RegisterForm;
import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        const success = await login(email, password);
        
        if (success) {
            navigate('/');
        } else {
            setError('Login failed. Please check your credentials.');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
            <form 
                onSubmit={handleSubmit} 
                className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md space-y-6"
            >
                <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white">Login</h2>

                {error && <p className="text-red-600 bg-red-100 dark:bg-red-900 p-3 rounded-md text-sm">{error}</p>}

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

                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full px-4 py-3 bg-blue-600 text-white font-bold rounded-md 
                               hover:bg-blue-700 disabled:bg-blue-400 transition-colors shadow-md"
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>

                <p className="text-center text-gray-600 dark:text-gray-400 text-sm">
                    Don't have an account? <Link to="/register" className="text-blue-600 hover:underline">Register here</Link>
                </p>
            </form>
        </div>
    );
};

export default LoginForm;
import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext();
const API_URL = 'https://taskmaster-backend-1y2z.onrender.com/api/auth'; 

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [loading, setLoading] = useState(true); 
    
    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete axios.defaults.headers.common['Authorization'];
        }
        setLoading(false); 
    }, [token]);

    useEffect(() => {
        if (token && !user) {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                try {
                    setUser(JSON.parse(storedUser));
                } catch (error) {
                    console.error("Failed to parse user from localStorage", error);
                    logout();
                }
            } else {
                logout(); 
            }
        }
    }, [token, user]);


    const login = useCallback(async (email, password) => {
        setLoading(true);
        try {
            const res = await axios.post(`${API_URL}/login`, { email, password });
            const { token: newToken, ...userData } = res.data;
            
            localStorage.setItem('token', newToken);
            localStorage.setItem('user', JSON.stringify(userData)); 
            setToken(newToken);
            setUser(userData);
            return true;
        } catch (error) {
            console.error("Login failed:", error.response?.data?.message || error.message);
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    const register = useCallback(async (username, email, password) => {
        setLoading(true);
        try {
            const res = await axios.post(`${API_URL}/register`, { username, email, password });
            const { token: newToken, ...userData } = res.data;
            
            localStorage.setItem('token', newToken);
            localStorage.setItem('user', JSON.stringify(userData));
            setToken(newToken);
            setUser(userData);
            return true;
        } catch (error) {
            console.error("Registration failed:", error.response?.data?.message || error.message);
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
        delete axios.defaults.headers.common['Authorization'];
    }, []);

    const contextValue = useMemo(() => ({
        user, 
        token, 
        loading, 
        login, 
        register, 
        logout
    }), [user, token, loading, login, register, logout]);

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };
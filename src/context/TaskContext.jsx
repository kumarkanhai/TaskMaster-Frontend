import React, { createContext, useState, useContext, useMemo, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext'; 

const TaskContext = createContext();
const API_URL = 'https://taskmaster-backend-1y2z.onrender.com/api/tasks'; 

const TaskProvider = ({ children }) => {
    const { token } = useContext(AuthContext);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchTasks = useCallback(async () => {
        if (!token) {
            setTasks([]);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const res = await axios.get(API_URL);
            setTasks(res.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch tasks.');
            console.error("Failed to fetch tasks:", err);
        } finally {
            setLoading(false);
        }
    }, [token]);

    const fetchTaskById = useCallback(async (taskId) => {
        if (!token) return null;
        setLoading(true);
        setError(null);
        try {
            const res = await axios.get(`${API_URL}/${taskId}`);
            return res.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch task.');
            console.error("Failed to fetch single task:", err);
            return null;
        } finally {
            setLoading(false);
        }
    }, [token]);

    const createTask = useCallback(async (taskData) => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.post(API_URL, taskData);
            setTasks(prevTasks => [...prevTasks, res.data]);
            return true;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create task.');
            console.error("Failed to create task:", err);
            return false;
        } finally {
            setLoading(false);
        }
    }, []);
    
    const updateTask = useCallback(async (taskId, updatedData) => {
        setLoading(true);
        setError(null);
        try {
            setTasks(prevTasks => prevTasks.map(task => 
                task._id === taskId ? { ...task, ...updatedData } : task
            ));

            const res = await axios.put(`${API_URL}/${taskId}`, updatedData);
            setTasks(prevTasks => prevTasks.map(task => 
                task._id === taskId ? res.data : task
            ));
            return true;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update task.');
            console.error("Failed to update task:", err);
            fetchTasks(); 
            return false;
        } finally {
            setLoading(false);
        }
    }, [fetchTasks]);

    const deleteTask = useCallback(async (taskId) => {
        setLoading(true);
        setError(null);
        try {
            await axios.delete(`${API_URL}/${taskId}`);
            setTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));
            return true;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete task.');
            console.error("Failed to delete task:", err);
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    const addComment = useCallback(async (taskId, content) => {
        setLoading(true); 
        setError(null);
        try {
            const res = await axios.post(`${API_URL}/${taskId}/comments`, { content });
            setTasks(prevTasks => prevTasks.map(task =>
                task._id === taskId
                    ? { ...task, comments: [...task.comments, res.data] }
                    : task
            ));
            return res.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add comment.');
            console.error("Failed to add comment:", err);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const contextValue = useMemo(() => ({ 
        tasks, 
        loading, 
        error,
        fetchTasks, 
        fetchTaskById,
        createTask, 
        updateTask, 
        deleteTask,
        addComment
    }), [tasks, loading, error, fetchTasks, fetchTaskById, createTask, updateTask, deleteTask, addComment]);

    return (
        <TaskContext.Provider value={contextValue}>
            {children}
        </TaskContext.Provider>
    );
};

export { TaskContext, TaskProvider };
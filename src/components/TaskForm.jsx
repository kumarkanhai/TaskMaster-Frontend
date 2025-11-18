import React, { useState, useContext, useEffect, useCallback } from 'react';
import { TaskContext } from '../context/TaskContext';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const API_USERS_URL = 'http://localhost:3000/api/users'; 

const TASK_STATUSES = ['To-Do', 'In Progress', 'Blocked', 'Completed'];
const TASK_PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'];

const TaskForm = ({ task = null, onClose }) => {
    const { createTask, updateTask } = useContext(TaskContext);
    const { user, token } = useContext(AuthContext); 
    
    const isEditMode = !!task;

    const [formData, setFormData] = useState({
        title: task?.title || '',
        description: task?.description || '',
        dueDate: task?.dueDate ? task.dueDate.split('T')[0] : '', 
        priority: task?.priority || 'Medium',
        status: task?.status || 'To-Do',
        assignedTo: [], 
    });
    
    const [allUsers, setAllUsers] = useState([]); 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchAllUsers = useCallback(async () => {
        if (!token) return;
        try {
            const res = await axios.get(API_USERS_URL, {
                headers: { Authorization: `Bearer ${token}` }
            }); 
            
            setAllUsers(res.data.map(u => ({ _id: u._id, username: u.username })));

            if (task?.assignedTo) {
                const assignedIds = task.assignedTo.map(u => u._id || u);
                setFormData(prev => ({ ...prev, assignedTo: assignedIds }));
            } else if (user?._id) {
                setFormData(prev => ({ ...prev, assignedTo: [user._id] }));
            }
        } catch (err) {
            console.error("Failed to fetch users for assignment. Using fallback.", err);
            if (user?._id && !task) {
                setFormData(prev => ({ ...prev, assignedTo: [user._id] }));
            }
        }
    }, [task, user, token]);

    useEffect(() => {
        if (user) { 
            fetchAllUsers();
        }
    }, [user, fetchAllUsers]);


    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        if (name === 'assignedTo') {
            setFormData(prev => {
                const updatedAssignments = checked
                    ? [...prev.assignedTo, value]
                    : prev.assignedTo.filter(id => id !== value);
                return { ...prev, assignedTo: updatedAssignments };
            });
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        
        try {
            let success;
            
            const submissionData = {
                ...formData,
                dueDate: formData.dueDate || undefined 
            };
            
            if (isEditMode) {
                success = await updateTask(task._id, submissionData); 
            } else {
                success = await createTask(submissionData);
            }
            
            if (success && onClose) {
                onClose();
            } else if (!success) {
                setError(`Failed to ${isEditMode ? 'update' : 'create'} task. Check console for details.`);
            }
            
        } catch (err) {
            setError(`An unexpected error occurred during submission.`);
            console.error("Submission Error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form 
            onSubmit={handleSubmit} 
            className="p-6 md:p-8 bg-white dark:bg-gray-800 rounded-lg shadow-2xl space-y-4 w-full max-w-lg mx-auto"
        >
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
                {isEditMode ? 'Edit Task' : 'Create New Task'}
            </h2>

            {error && (
                <p className="text-red-500 bg-red-100 dark:bg-red-900/50 p-3 rounded-md border border-red-500 text-sm">
                    {error}
                </p>
            )}

            <label className="block">
                <span className="text-gray-700 dark:text-gray-300 font-medium">Title</span>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 
                               bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-2"
                />
            </label>

            <label className="block">
                <span className="text-gray-700 dark:text-gray-300 font-medium">Description</span>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 
                               bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-2 resize-none"
                ></textarea>
            </label>
            
            <div className="flex flex-col sm:flex-row gap-4">
                
                <label className="block flex-1">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">Due Date</span>
                    <input
                        type="date"
                        name="dueDate"
                        value={formData.dueDate}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 
                                   bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-2"
                    />
                </label>

                <label className="block flex-1">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">Priority Level</span>
                    <select
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 
                                   bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-2"
                    >
                        {TASK_PRIORITIES.map(p => (
                            <option key={p} value={p}>{p}</option>
                        ))}
                    </select>
                </label>
            </div>

            <label className="block">
                <span className="text-gray-700 dark:text-gray-300 font-medium">Status</span>
                <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 
                               bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-2"
                >
                    {TASK_STATUSES.map(s => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </select>
            </label>
            
            <div className="pt-2">
                <span className="text-gray-700 dark:text-gray-300 font-medium block mb-2">Assign To:</span>
                <div className="flex flex-wrap gap-4 max-h-32 overflow-y-auto p-2 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-700/50">
                    {allUsers.length > 0 ? allUsers.map(u => (
                        <label key={u._id} className="inline-flex items-center text-gray-700 dark:text-gray-300">
                            <input
                                type="checkbox"
                                name="assignedTo"
                                value={u._id}
                                checked={formData.assignedTo.includes(u._id)}
                                onChange={handleChange}
                                className="rounded text-blue-600 dark:bg-gray-600 dark:border-gray-500 focus:ring-blue-500"
                            />
                            <span className="ml-2">{u.username}</span>
                        </label>
                    )) : (
                        <p className="text-sm text-gray-500 dark:text-gray-400">Loading users or none available.</p>
                    )}
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
                {onClose && (
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                    >
                        Cancel
                    </button>
                )}
                <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:bg-blue-400 dark:disabled:bg-blue-800 transition shadow-lg"
                >
                    {loading ? 'Saving...' : isEditMode ? 'Update Task' : 'Create Task'}
                </button>
            </div>
        </form>
    );
};

export default TaskForm;
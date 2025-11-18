import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { TaskContext } from '../context/TaskContext';
import { AuthContext } from '../context/AuthContext';
import CommentInput from './CommentInput'; 

const TaskDetail = () => {
    const { taskId } = useParams(); 
    
    const { fetchTaskById, addComment, loading: taskLoading } = useContext(TaskContext);
    const { user } = useContext(AuthContext); 

    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [commentLoading, setCommentLoading] = useState(false);
    const [error, setError] = useState(null);

    const loadTask = async () => {
        setLoading(true);
        setError(null);
        const data = await fetchTaskById(taskId);
        
        if (data) {
            setTask(data);
        } else {
            setError('Task not found or failed to load.');
        }
        setLoading(false);
    };

    useEffect(() => {
        // Only load if taskId is present and we're not globally loading
        if (taskId) {
            loadTask();
        }
    }, [taskId]); // Depend on taskId to reload if navigating between tasks

    // --- Comment Submission Handler ---
    const handleAddComment = async (content) => {
        setCommentLoading(true);
        const newComment = await addComment(taskId, content);
        
        if (newComment) {
            setTask(prevTask => ({
                ...prevTask,
                comments: [...(prevTask?.comments || []), { 
                    ...newComment, 
                    user: newComment.user || { _id: user._id, username: user.username } 
                }], 
            }));
        }
        setCommentLoading(false);
    };

    if (loading || taskLoading) {
        return <div className="p-8 text-center text-xl dark:text-white">Loading task details...</div>;
    }
    
    if (error) {
        return (
            <div className="p-8 text-center text-xl text-red-500">
                {error} 
                <p className='mt-4 text-gray-600 dark:text-gray-400 text-base'>
                    <Link to="/" className="text-blue-500 hover:underline">Go back to Kanban Board</Link>
                </p>
            </div>
        );
    }
    
    if (!task) return null;

    
    const assignedUsers = task.assignedTo.map(u => 
        (u?.username || u?._id || 'Unknown User')
    ).join(', ');

    const getPriorityClass = (priority) => {
        switch (priority) {
            case 'Urgent': return 'bg-red-500 text-white dark:bg-red-700';
            case 'High': return 'bg-yellow-500 text-black dark:bg-yellow-600';
            default: return 'bg-blue-500 text-white dark:bg-blue-700';
        }
    };

    return (
        <div className="p-4 md:p-8 max-w-6xl mx-auto min-h-screen">
            
            <Link to="/" className="inline-flex items-center text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-500 mb-6">
                &larr; Back to Board
            </Link>

            <div className="pb-4 border-b border-gray-200 dark:border-gray-700 mb-6">
                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-3 break-words">{task.title}</h1>
                
                <div className="flex flex-wrap gap-4 items-center">
                    <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full capitalize ${getPriorityClass(task.priority)}`}>
                        {task.priority} Priority
                    </span>
                    <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full capitalize 
                                     ${task.status === 'Completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 
                                       task.status === 'Blocked' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' : 
                                       'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'}`}>
                        Status: {task.status}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                <div className="lg:col-span-2 space-y-6">
                    
                    <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                        <h3 className="text-2xl font-semibold mb-4 dark:text-white border-b dark:border-gray-700 pb-2">Description</h3>
                        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                            {task.description || "No detailed description provided for this task."}
                        </p>
                    </section>

                    <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                        <h3 className="text-2xl font-semibold mb-4 dark:text-white border-b dark:border-gray-700 pb-2">Key Information</h3>
                        <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                            <p><strong>Owner:</strong> {task.owner?.username || 'N/A'}</p>
                            <p><strong>Assigned To:</strong> {assignedUsers || 'None'}</p>
                            <p><strong>Due Date:</strong> {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}</p>
                            <p><strong>Created On:</strong> {new Date(task.createdAt).toLocaleDateString()}</p>
                            <p><strong>Last Updated:</strong> {new Date(task.updatedAt).toLocaleDateString()}</p>
                        </div>
                    </section>

                </div>

                <div className="lg:col-span-1 bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-lg h-full">
                    <h3 className="text-2xl font-semibold mb-4 dark:text-white">Comments ({task.comments.length})</h3>
                    
                    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                        {task.comments.length > 0 ? (
                            task.comments.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)).map((comment, index) => (
                                <div key={comment._id || index} className="border-b border-gray-200 dark:border-gray-700 pb-3">
                                    <p className="text-sm font-bold text-gray-900 dark:text-gray-200">
                                        {comment.user?.username || 'System'}:
                                    </p>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                                        {comment.content}
                                    </p>
                                    <span className="text-xs text-gray-400 dark:text-gray-500 mt-1 block">
                                        {new Date(comment.createdAt).toLocaleString()}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 dark:text-gray-400 text-center py-4">No comments yet.</p>
                        )}
                    </div>
                    
                    <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                        <CommentInput onSubmit={handleAddComment} loading={commentLoading} />
                    </div>
                </div>
            </div>
            
             <div className="mt-8 text-right">
                <button className="px-6 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600">Edit Task</button>
            </div>
        </div>
    );
};

export default TaskDetail;
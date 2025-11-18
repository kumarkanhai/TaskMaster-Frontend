import React, { useState } from 'react';

const CommentInput = ({ onSubmit, loading }) => {
    const [content, setContent] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (content.trim()) {
            onSubmit(content.trim());
            setContent('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows="3"
                placeholder="Write a comment..."
                required
                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 
                           focus:ring-blue-500 focus:border-blue-500 
                           bg-gray-50 dark:bg-gray-700 
                           text-gray-900 dark:text-gray-100 resize-none 
                           shadow-sm"
                disabled={loading} 
            />
            <button
                type="submit"
                disabled={loading || !content.trim()}
                className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md 
                           hover:bg-blue-700 
                           disabled:bg-blue-400 dark:disabled:bg-blue-800 
                           transition duration-150 shadow-md"
            >
                {loading ? 'Posting...' : 'Post Comment'}
            </button>
        </form>
    );
};

export default CommentInput;
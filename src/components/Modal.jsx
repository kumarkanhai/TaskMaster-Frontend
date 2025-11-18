import React from 'react';

const Modal = ({ children, onClose }) => {
    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            onClick={onClose}
        >
            <div 
                className="relative bg-white dark:bg-gray-800 rounded-lg max-h-[90vh] overflow-y-auto"
                onClick={e => e.stopPropagation()} 
            >
                {children}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white text-xl"
                    aria-label="Close"
                >
                    &times;
                </button>
            </div>
        </div>
    );
};

export default Modal;
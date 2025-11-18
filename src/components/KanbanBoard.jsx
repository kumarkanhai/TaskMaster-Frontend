import React, { useContext, useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { TaskContext } from '../context/TaskContext';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import TaskForm from './TaskForm'; 
import Modal from './Modal'; 


const STATUS_COLUMNS = {
    'To-Do': { title: 'To Do', color: 'bg-gray-200 dark:bg-gray-700' },
    'In Progress': { title: 'In Progress', color: 'bg-blue-200 dark:bg-blue-700' },
    'Blocked': { title: 'Blocked', color: 'bg-red-200 dark:bg-red-700' },
    'Completed': { title: 'Completed', color: 'bg-green-200 dark:bg-green-700' },
};

const getGroupedTasks = (tasks) => {
    return tasks.reduce((acc, task) => {
        const status = task.status || 'To-Do';
        if (!acc[status]) {
            acc[status] = [];
        }
        acc[status].push(task);
        return acc;
    }, {});
};


const TaskCard = ({ task, index, onEdit }) => {
    const navigate = useNavigate();

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'Urgent': return 'text-red-600 dark:text-red-400 border-red-400';
            case 'High': return 'text-yellow-600 dark:text-yellow-400 border-yellow-400';
            case 'Medium': return 'text-blue-600 dark:text-blue-400 border-blue-400';
            default: return 'text-gray-600 dark:text-gray-400 border-gray-400';
        }
    };

    return (
        <Draggable draggableId={task._id} index={index}>
            {(provided) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="p-3 mb-3 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow border-t-4 border-blue-500 dark:border-blue-400"
                >
                    <div 
                        className="cursor-pointer" 
                        onClick={() => navigate(`/tasks/${task._id}`)}
                    >
                        <h4 className="font-semibold text-lg text-gray-900 dark:text-white truncate">
                            {task.title}
                        </h4>
                        <p className={`text-xs font-medium mt-1 inline-block px-2 py-0.5 rounded-full border ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                            Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-500">
                            Assigned: {task.assignedTo && task.assignedTo.length > 0 ? task.assignedTo.length : 1}
                        </p>
                    </div>
                    <button onClick={() => onEdit(task)} className="text-blue-500 text-xs mt-2 hover:text-blue-700">Edit</button>
                </div>
            )}
        </Draggable>
    );
};


const KanbanBoard = () => {
    const { tasks, fetchTasks, updateTask, loading, error } = useContext(TaskContext);
    const { logout } = useContext(AuthContext);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState(null); 

    const groupedTasks = getGroupedTasks(tasks);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const onDragEnd = (result) => {
        const { source, destination, draggableId } = result;

        if (!destination || (source.droppableId === destination.droppableId)) {
            return;
        }

       const newStatus = destination.droppableId;
        const taskId = draggableId;
        
        const task = tasks.find(t => t._id === taskId);
        
        if (task && task.status !== newStatus) {
             updateTask(taskId, { status: newStatus }); 
        }
    };

    const handleAddTask = () => {
        setTaskToEdit(null); 
        setIsModalOpen(true);
    };

    const handleEditTask = (task) => {
        setTaskToEdit(task);
        setIsModalOpen(true);
    };

    if (loading && tasks.length === 0) {
        return <div className="p-8 text-center text-xl dark:text-white">Loading tasks...</div>;
    }
    
    if (error) {
        return <div className="p-8 text-center text-xl text-red-500">Error: {error}</div>;
    }

    return (
        <div className="p-4 md:p-8">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-4 border-b dark:border-gray-700">
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4 md:mb-0">
                    Kanban Task Board
                </h1>
                <div className="flex gap-4">
                    <button 
                        onClick={handleAddTask}
                        className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition shadow-md"
                    >
                        + New Task
                    </button>
                    <button 
                        onClick={logout}
                        className="px-4 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition shadow-md"
                    >
                        Logout
                    </button>
                </div>
            </header>

            <DragDropContext onDragEnd={onDragEnd}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {Object.keys(STATUS_COLUMNS).map((columnKey) => (
                        <Droppable droppableId={columnKey} key={columnKey}>
                            {(provided, snapshot) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className={`p-4 rounded-lg shadow-inner min-h-[400px] 
                                                ${STATUS_COLUMNS[columnKey].color} 
                                                ${snapshot.isDraggingOver ? 'bg-opacity-80 dark:bg-opacity-80' : ''}`}
                                >
                                    <h3 className="text-xl font-bold mb-4 capitalize text-gray-900 dark:text-white border-b border-gray-400 dark:border-gray-500 pb-2">
                                        {STATUS_COLUMNS[columnKey].title} ({groupedTasks[columnKey]?.length || 0})
                                    </h3>
                                    
                                    {groupedTasks[columnKey]?.map((task, index) => (
                                        <TaskCard 
                                            key={task._id} 
                                            task={task} 
                                            index={index} 
                                            onEdit={handleEditTask} 
                                        />
                                    ))}
                                    
                                    {provided.placeholder}
                                    
                                    {groupedTasks[columnKey]?.length === 0 && !snapshot.isDraggingOver && (
                                        <p className="text-gray-500 dark:text-gray-400 text-sm text-center pt-4">No tasks here.</p>
                                    )}
                                </div>
                            )}
                        </Droppable>
                    ))}
                </div>
            </DragDropContext>

            {isModalOpen && (
                <Modal onClose={() => { setIsModalOpen(false); setTaskToEdit(null); }}>
                    <TaskForm 
                        task={taskToEdit} 
                        onClose={() => { 
                            setIsModalOpen(false); 
                            setTaskToEdit(null); 
                            fetchTasks(); 
                        }} 
                    />
                </Modal>
            )}
        </div>
    );
};

export default KanbanBoard;
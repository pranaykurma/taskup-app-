import React from 'react';
import type { Task } from '../types';
import { Priority } from '../types';
import { EditIcon, TrashIcon, ClockIcon } from './icons';

interface TaskCardProps {
  task: Task;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const priorityStyles: { [key in Priority]: string } = {
  [Priority.High]: 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300 border-red-500',
  [Priority.Medium]: 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300 border-yellow-500',
  [Priority.Low]: 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 border-green-500',
};

export const TaskCard: React.FC<TaskCardProps> = ({ task, onToggle, onEdit, onDelete }) => {
  return (
    <div className={`flex items-center p-4 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-xl shadow-md transition-all duration-300 ${task.completed ? 'opacity-50' : ''}`}>
      <button onClick={onToggle} className="flex-shrink-0" aria-label={task.completed ? 'Mark task as incomplete' : 'Mark task as complete'}>
        <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all duration-300 ${task.completed ? 'bg-blue-600 border-blue-600' : 'border-gray-300 dark:border-gray-600 hover:border-blue-500'}`}>
          {task.completed && (
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      </button>

      <div className="flex-grow mx-4">
        <p className={`font-medium transition-all duration-300 ${task.completed ? 'line-through text-gray-500' : 'text-gray-800 dark:text-gray-200'}`}>{task.title}</p>
        {task.time && (
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
            <ClockIcon className="w-3 h-3 mr-1.5" />
            <span>{task.time}</span>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-3">
        <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${priorityStyles[task.priority]}`}>
          {task.priority}
        </span>
        <button onClick={onEdit} className="text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors" aria-label="Edit task">
          <EditIcon className="w-5 h-5" />
        </button>
        <button onClick={onDelete} className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors" aria-label="Delete task">
          <TrashIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
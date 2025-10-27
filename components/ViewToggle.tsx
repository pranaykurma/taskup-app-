import React from 'react';
import { DisplayMode } from '../types';
import { ListIcon, CalendarIcon } from './icons';

interface ViewToggleProps {
  displayMode: DisplayMode;
  setDisplayMode: (mode: DisplayMode) => void;
}

export const ViewToggle: React.FC<ViewToggleProps> = ({ displayMode, setDisplayMode }) => {
  const options: { label: string; value: DisplayMode; icon: React.ReactNode }[] = [
    { label: 'List', value: 'list', icon: <ListIcon className="w-5 h-5 mr-2" /> },
    { label: 'Calendar', value: 'calendar', icon: <CalendarIcon className="w-5 h-5 mr-2" /> },
  ];

  return (
    <div className="flex items-center justify-center my-6 animate-fade-in">
      <div className="flex items-center space-x-2 bg-gray-200/50 dark:bg-gray-900/50 p-1 rounded-lg">
        {options.map(({ label, value, icon }) => (
          <button
            key={value}
            onClick={() => setDisplayMode(value)}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-all duration-300 flex items-center ${
              displayMode === value
                ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-indigo-400 shadow-md'
                : 'text-gray-500 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-700/50'
            }`}
          >
            {icon}
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};

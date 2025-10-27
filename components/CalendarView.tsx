import React, { useState } from 'react';
import { Task, Priority } from '../types';
import { ChevronLeftIcon } from './icons';

interface CalendarViewProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

const priorityDotColor: { [key in Priority]: string } = {
  [Priority.High]: 'bg-red-500',
  [Priority.Medium]: 'bg-yellow-500',
  [Priority.Low]: 'bg-green-500',
};

export const CalendarView: React.FC<CalendarViewProps> = ({ tasks, onTaskClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const startDate = new Date(startOfMonth);
  startDate.setDate(startDate.getDate() - startOfMonth.getDay());
  const endDate = new Date(endOfMonth);
  endDate.setDate(endDate.getDate() + (6 - endOfMonth.getDay()));

  const calendarDays: { date: Date; isCurrentMonth: boolean }[] = [];
  let day = new Date(startDate);
  while (day <= endDate) {
    calendarDays.push({
      date: new Date(day),
      isCurrentMonth: day.getMonth() === currentDate.getMonth(),
    });
    day.setDate(day.getDate() + 1);
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };
  
  const today = new Date();
  const isSameDay = (d1: Date, d2: Date) => 
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  return (
    <div className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-xl p-6 rounded-2xl shadow-lg animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-gray-500/10 transition-colors">
          <ChevronLeftIcon className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-bold">
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
        <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-gray-500/10 transition-colors">
          <ChevronLeftIcon className="w-6 h-6 transform rotate-180" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center font-semibold text-gray-600 dark:text-gray-400">
        {daysOfWeek.map(day => <div key={day} className="py-2">{day}</div>)}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {calendarDays.map(({ date, isCurrentMonth }, index) => {
          const dateString = date.toISOString().split('T')[0];
          const tasksForDay = tasks.filter(task => task.date === dateString);
          return (
            <div
              key={index}
              className={`h-24 p-2 rounded-lg transition-colors ${
                isCurrentMonth ? 'bg-white/40 dark:bg-gray-800/40' : 'bg-gray-500/10 dark:bg-gray-900/20'
              } ${isSameDay(date, today) ? 'ring-2 ring-blue-500' : ''}`}
            >
              <span className={`font-medium ${isCurrentMonth ? 'text-gray-800 dark:text-gray-200' : 'text-gray-400 dark:text-gray-600'}`}>
                {date.getDate()}
              </span>
              <div className="mt-1 space-y-1">
                {tasksForDay.slice(0, 3).map(task => (
                  <div 
                    key={task.id}
                    onClick={() => onTaskClick(task)}
                    className="flex items-center cursor-pointer group"
                    >
                    <div className={`w-2 h-2 rounded-full ${priorityDotColor[task.priority]} flex-shrink-0`}></div>
                    <p className="text-xs ml-1.5 truncate text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-indigo-400">{task.title}</p>
                  </div>
                ))}
                {tasksForDay.length > 3 && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        + {tasksForDay.length - 3} more
                    </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

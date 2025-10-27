import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { ProgressBar } from './components/ProgressBar';
import { FilterControls } from './components/FilterControls';
import { TaskCard } from './components/TaskCard';
import { AddTaskModal } from './components/AddTaskModal';
import { PlusIcon } from './components/icons';
import type { Task, DisplayMode } from './types';
import { Priority } from './types';
import { useTasks } from './hooks/useTasks';
import { SettingsPage } from './components/SettingsPage';
import { CalendarView } from './components/CalendarView';
import { ViewToggle } from './components/ViewToggle';

type View = 'tasks' | 'settings';

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedTheme = window.localStorage.getItem('TASKUP_theme');
      if (storedTheme === 'dark' || storedTheme === 'light') {
        return storedTheme;
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });
  
  const {
    tasks,
    allTasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
    clearAllTasks,
    exportTasks,
    filter,
    setFilter,
    sort,
    setSort,
    searchTerm,
    setSearchTerm,
  } = useTasks();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [view, setView] = useState<View>('tasks');
  const [displayMode, setDisplayMode] = useState<DisplayMode>('list');
  
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('TASKUP_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const handleOpenModal = (task: Task | null = null) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleSaveTask = (taskData: { title: string; priority: Priority; time?: string }) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData);
    } else {
      addTask(taskData);
    }
    handleCloseModal();
  };
  
  const today = new Date().toISOString().split('T')[0];
  const todayTasks = useMemo(() => allTasks.filter(t => t.date === today), [allTasks, today]);
  const completedTasksCount = useMemo(() => todayTasks.filter(t => t.completed).length, [todayTasks]);

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 dark:from-gray-900 dark:to-indigo-900 text-gray-900 dark:text-gray-100 font-sans transition-colors duration-500`}>
      <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
        
        <Header 
          theme={theme}
          toggleTheme={toggleTheme}
          onSettingsClick={() => setView('settings')}
        />
        
        {view === 'tasks' && (
          <main className="mt-8">
            <div className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-xl p-6 rounded-2xl shadow-lg animate-fade-in">
              <h2 className="text-xl font-semibold">Today's Progress</h2>
              <ProgressBar current={completedTasksCount} total={todayTasks.length} />
            </div>
            
            <ViewToggle displayMode={displayMode} setDisplayMode={setDisplayMode} />

            {displayMode === 'list' && (
              <>
                <FilterControls
                  filter={filter}
                  setFilter={setFilter}
                  sort={sort}
                  setSort={setSort}
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  taskCount={tasks.length}
                />

                <div className="space-y-4 animate-slide-up">
                  {tasks.map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onToggle={() => toggleTaskCompletion(task.id)}
                      onEdit={() => handleOpenModal(task)}
                      onDelete={() => deleteTask(task.id)}
                    />
                  ))}
                  {tasks.length === 0 && (
                    <div className="text-center py-12 px-6 bg-white/30 dark:bg-gray-800/30 backdrop-blur-xl rounded-2xl shadow-lg">
                      <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">All clear!</h3>
                      <p className="text-gray-500 dark:text-gray-400 mt-2">You have no tasks for today. Add one to get started!</p>
                    </div>
                  )}
                </div>
              </>
            )}

            {displayMode === 'calendar' && (
              <CalendarView tasks={allTasks} onTaskClick={handleOpenModal} />
            )}

          </main>
        )}

        {view === 'settings' && (
          <SettingsPage 
            onBack={() => setView('tasks')}
            theme={theme}
            toggleTheme={toggleTheme}
            allTasks={allTasks}
            exportTasks={exportTasks}
            clearAllTasks={clearAllTasks}
          />
        )}
        
        {view === 'tasks' && (
            <button
            onClick={() => handleOpenModal()}
            className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full text-white shadow-lg flex items-center justify-center transform hover:scale-110 hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-indigo-800 animate-fade-in"
            aria-label="Add new task"
            >
                <PlusIcon className="w-8 h-8"/>
            </button>
        )}

        <AddTaskModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveTask}
          task={editingTask}
        />
      </div>
    </div>
  );
}

export default App;
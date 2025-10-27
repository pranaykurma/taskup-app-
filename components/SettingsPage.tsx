import React, { useState } from 'react';
import { ChevronLeftIcon, SunIcon, MoonIcon, DownloadIcon, TrashIcon, SyncIcon } from './icons';
import { Task } from '../types';

interface SettingsPageProps {
  onBack: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  allTasks: Task[];
  exportTasks: () => void;
  clearAllTasks: () => void;
}

const SettingsCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl shadow-lg">
    <h3 className="text-lg font-bold mb-4">{title}</h3>
    {children}
  </div>
);

export const SettingsPage: React.FC<SettingsPageProps> = ({ onBack, theme, toggleTheme, allTasks, exportTasks, clearAllTasks }) => {
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to delete all tasks? This action cannot be undone.')) {
      clearAllTasks();
      alert('All tasks have been deleted.');
    }
  };

  const handleSyncWithArduino = async () => {
    if (!('serial' in navigator)) {
        alert('Web Serial API not supported by your browser. Please use Chrome, Edge, or Opera.');
        return;
    }

    setSyncStatus('syncing');

    try {
        const port = await (navigator as any).serial.requestPort();
        await port.open({ baudRate: 9600 });
        const writer = port.writable.getWriter();
        
        const today = new Date().toISOString().split('T')[0];
        const tasksToSync = allTasks.filter(task => task.date === today && !task.completed);

        if (tasksToSync.length === 0) {
            const message = `TASK: No new tasks\nSTATUS: \nTIME: \n`;
            await writer.write(new TextEncoder().encode(message));
        } else {
            for (const task of tasksToSync) {
                const message = `TASK: ${task.title}\nSTATUS: Pending\nTIME: ${task.time || ''}\n`;
                await writer.write(new TextEncoder().encode(message));
                // Wait for the Arduino to process and display the task
                await new Promise(resolve => setTimeout(resolve, 3000)); 
            }
        }
        
        await writer.close();
        await port.close();
        alert('Tasks successfully synced with Arduino!');
        setSyncStatus('success');

    } catch (error) {
        console.error('Error syncing with Arduino:', error);
        alert(`Failed to sync with Arduino. Please check the console for details.`);
        setSyncStatus('error');
    } finally {
        setTimeout(() => setSyncStatus('idle'), 2000);
    }
  };

  const getSyncButtonText = () => {
    switch (syncStatus) {
        case 'syncing': return 'Syncing...';
        case 'success': return 'Synced!';
        case 'error': return 'Sync Failed';
        default: return 'Sync with Arduino';
    }
  };

  return (
    <main className="mt-8 animate-fade-in space-y-6">
      <div className="flex items-center space-x-4">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-500/10 transition-colors">
          <ChevronLeftIcon className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold">Settings</h2>
      </div>

      <SettingsCard title="Appearance">
        <div className="flex justify-between items-center">
          <p className="font-medium">Theme</p>
          <div className="relative inline-flex items-center cursor-pointer" onClick={toggleTheme} aria-label="Toggle theme">
            <div className="flex items-center p-1 rounded-full bg-gray-200 dark:bg-gray-700">
                <div className={`p-2 rounded-full transition-colors ${theme === 'light' ? 'bg-white shadow' : 'text-gray-400'}`}>
                    <SunIcon className="w-5 h-5"/>
                </div>
                <div className={`p-2 rounded-full transition-colors ${theme === 'dark' ? 'bg-gray-900 shadow' : 'text-gray-500'}`}>
                    <MoonIcon className="w-5 h-5"/>
                </div>
            </div>
          </div>
        </div>
      </SettingsCard>
      
      <SettingsCard title="Data Management">
        <div className="space-y-4">
            <button onClick={exportTasks} className="w-full flex items-center justify-center space-x-2 text-left px-4 py-3 rounded-lg bg-blue-50 dark:bg-indigo-900/50 text-blue-700 dark:text-indigo-300 hover:bg-blue-100 dark:hover:bg-indigo-900 transition-colors">
                <DownloadIcon className="w-5 h-5"/>
                <span className="font-semibold">Export Tasks to CSV</span>
            </button>
             <button onClick={handleSyncWithArduino} disabled={syncStatus === 'syncing'} className="w-full flex items-center justify-center space-x-2 text-left px-4 py-3 rounded-lg bg-purple-50 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                <SyncIcon className={`w-5 h-5 ${syncStatus === 'syncing' ? 'animate-spin' : ''}`}/>
                <span className="font-semibold">{getSyncButtonText()}</span>
            </button>
            <button onClick={handleClearData} className="w-full flex items-center justify-center space-x-2 text-left px-4 py-3 rounded-lg bg-red-50 dark:bg-red-900/50 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900 transition-colors">
                <TrashIcon className="w-5 h-5"/>
                <span className="font-semibold">Clear All Tasks</span>
            </button>
        </div>
      </SettingsCard>

      <div className="text-center text-xs text-gray-400 dark:text-gray-500 pt-4">
        <p>TASKUP v1.1.0</p>
      </div>

    </main>
  );
};
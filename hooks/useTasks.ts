import { useState, useEffect, useMemo, useCallback } from 'react';
import { Task, Priority, FilterType, SortType } from '../types';

const STORAGE_KEY = 'TASKUP_tasks';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [sort, setSort] = useState<SortType>('priority');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    try {
      const storedTasks = localStorage.getItem(STORAGE_KEY);
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      } else {
        setTasks([]);
      }
    } catch (e) {
      console.error("Failed to load tasks from localStorage", e);
      setTasks([]);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (e) {
      console.error("Failed to save tasks to localStorage", e);
    }
  }, [tasks]);

  const addTask = useCallback((taskData: { title: string; priority: Priority; time?: string }) => {
    const newTask: Task = {
      id: Date.now().toString(),
      ...taskData,
      completed: false,
      date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
    };
    setTasks(prevTasks => [...prevTasks, newTask]);
  }, []);

  const updateTask = useCallback((taskId: string, taskData: { title: string; priority: Priority; time?: string }) => {
    setTasks(prevTasks =>
      prevTasks.map(task => (task.id === taskId ? { ...task, ...taskData } : task))
    );
  }, []);

  const deleteTask = useCallback((taskId: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  }, []);

  const toggleTaskCompletion = useCallback((taskId: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  }, []);

  const clearAllTasks = useCallback(() => {
    setTasks([]);
  }, []);

  const exportTasks = useCallback(() => {
    if (tasks.length === 0) {
      alert("No tasks to export.");
      return;
    }
    const headers = ["id", "title", "completed", "priority", "time", "date"];
    const csvContent = [
      headers.join(','),
      ...tasks.map(t => [t.id, `"${t.title.replace(/"/g, '""')}"`, t.completed, t.priority, t.time || '', t.date].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `taskup_export_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [tasks]);

  const filteredAndSortedTasks = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    let result = tasks.filter(task => task.date === today);

    if (filter === 'completed') {
      result = result.filter(task => task.completed);
    } else if (filter === 'active') {
      result = result.filter(task => !task.completed);
    }
    
    if (searchTerm) {
        result = result.filter(task => task.title.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    const priorityOrder: { [key in Priority]: number } = {
      [Priority.High]: 1,
      [Priority.Medium]: 2,
      [Priority.Low]: 3,
    };

    result.sort((a, b) => {
      if (sort === 'priority') {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      if (sort === 'time') {
        if (!a.time) return 1;
        if (!b.time) return -1;
        return a.time.localeCompare(b.time);
      }
      if (sort === 'title') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

    return result;
  }, [tasks, filter, sort, searchTerm]);

  return {
    tasks: filteredAndSortedTasks,
    allTasks: tasks,
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
  };
};
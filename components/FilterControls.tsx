import React from 'react';
import { FilterType, SortType } from '../types';

interface FilterControlsProps {
  filter: FilterType;
  setFilter: (filter: FilterType) => void;
  sort: SortType;
  setSort: (sort: SortType) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  taskCount: number;
}

export const FilterControls: React.FC<FilterControlsProps> = ({
  filter,
  setFilter,
  sort,
  setSort,
  searchTerm,
  setSearchTerm,
  taskCount
}) => {
  const filterOptions: { label: string; value: FilterType }[] = [
    { label: `All (${taskCount})`, value: 'all' },
    { label: 'Active', value: 'active' },
    { label: 'Completed', value: 'completed' },
  ];

  const sortOptions: { label: string; value: SortType }[] = [
    { label: 'Priority', value: 'priority' },
    { label: 'Time', value: 'time' },
    { label: 'Title', value: 'title' },
  ];

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4 my-6 animate-fade-in">
      <div className="w-full sm:w-1/3">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white/50 dark:bg-gray-700/50 focus:ring-2 focus:ring-blue-500 dark:focus:ring-indigo-500 outline-none transition"
        />
      </div>
      <div className="flex items-center space-x-2 bg-gray-200/50 dark:bg-gray-900/50 p-1 rounded-lg">
        {filterOptions.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${
              filter === value
                ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-indigo-400 shadow'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <div>
        <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortType)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white/50 dark:bg-gray-700/50 focus:ring-2 focus:ring-blue-500 dark:focus:ring-indigo-500 outline-none transition"
        >
            {sortOptions.map(({ label, value }) => (
                <option key={value} value={value}>
                    Sort by {label}
                </option>
            ))}
        </select>
      </div>
    </div>
  );
};

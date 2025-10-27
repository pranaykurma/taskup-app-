export enum Priority {
  High = 'High',
  Medium = 'Medium',
  Low = 'Low',
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: Priority;
  time?: string;
  date: string;
}

export type FilterType = 'all' | 'completed' | 'active';

export type SortType = 'priority' | 'time' | 'title';

export type DisplayMode = 'list' | 'calendar';

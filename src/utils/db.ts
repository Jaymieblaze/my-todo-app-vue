// Defines the possible priority levels for a task.
export type Priority = 'low' | 'medium' | 'high';

// Defines the shape of a single to-do item.
export interface Todo {
  id: string;
  userId: number;
  title: string;
  completed: boolean;
  createdAt?: string;
  updatedAt?: string;
  isSynced?: 0 | 1;
  isDeleted?: 0 | 1;
  dueDate?: string;
  priority?: Priority;
}


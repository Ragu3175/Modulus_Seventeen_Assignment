export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export type TaskCategory =
  | 'work'
  | 'personal'
  | 'study'
  | 'health'
  | 'finance'
  | 'project'
  | 'other';

export interface Subtask {
  id: string;
  title: string;
  isCompleted: boolean;
}

export interface SmartScoreMeta {
  score: number;
  urgencyLevel: 'OVERDUE' | 'CRITICAL' | 'NEAR_DEADLINE' | 'UPCOMING' | 'ON_TRACK' | 'COMPLETED';
  urgencyLabel: string;
  hoursRemaining: number | null;
  overdue: boolean;
}

export interface Task {
  _id: string;
  id?: string;
  user: string;
  title: string;
  description?: string;
  dateTime?: string | null;
  deadline?: string | null;
  priority: TaskPriority;
  category: TaskCategory;
  tags: string[];
  isCompleted: boolean;
  completedAt?: string | null;
  subtasks: Subtask[];
  reminderEnabled: boolean;
  color?: string;
  smartScoreMeta?: SmartScoreMeta;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskPayload {
  title: string;
  description?: string;
  dateTime?: string | null;
  deadline?: string | null;
  priority: TaskPriority;
  category: TaskCategory;
  tags?: string[];
  subtasks?: Subtask[];
  reminderEnabled?: boolean;
  color?: string;
}

export interface UpdateTaskPayload extends Partial<CreateTaskPayload> {
  isCompleted?: boolean;
}

export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  dueToday: number;
  completionRate: number;
  priorityCounts: {
    urgent: number;
    high: number;
    medium: number;
    low: number;
  };
  categoryCounts: Record<string, number>;
}

export type TaskSortOption =
  | 'smart'
  | 'deadline_asc'
  | 'deadline_desc'
  | 'priority_desc'
  | 'created_desc'
  | 'title_asc';

export interface FilterOptions {
  status: 'all' | 'pending' | 'completed';
  priority: 'all' | TaskPriority;
  category: 'all' | TaskCategory | string;
  search: string;
  sort: TaskSortOption;
}

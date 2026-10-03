import { create } from 'zustand';
import {
  Task,
  CreateTaskPayload,
  UpdateTaskPayload,
  TaskStats,
  FilterOptions,
  TaskSortOption,
  TaskCategory,
  TaskPriority,
} from '../types/task.types';
import { taskApi } from '../api/taskApi';
import { storage } from '../utils/storage';
import { calculateClientSmartScore } from '../utils/priorityAlgorithm';

interface TaskStoreState {
  tasks: Task[];
  stats: TaskStats | null;
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;

  // Filter and Search States
  filters: FilterOptions;

  // Actions
  fetchTasks: () => Promise<void>;
  refreshTasks: () => Promise<void>;
  createTask: (payload: CreateTaskPayload) => Promise<boolean>;
  updateTask: (id: string, payload: UpdateTaskPayload) => Promise<boolean>;
  toggleTask: (id: string) => Promise<void>;
  toggleSubtask: (taskId: string, subtaskId: string) => Promise<void>;
  deleteTask: (id: string) => Promise<boolean>;
  fetchStats: () => Promise<void>;

  // Filter setters
  setStatusFilter: (status: FilterOptions['status']) => void;
  setPriorityFilter: (priority: FilterOptions['priority']) => void;
  setCategoryFilter: (category: FilterOptions['category']) => void;
  setSearchQuery: (query: string) => void;
  setSortOption: (sort: TaskSortOption) => void;
  resetFilters: () => void;
  getFilteredTasks: () => Task[];
}

const initialFilters: FilterOptions = {
  status: 'all',
  priority: 'all',
  category: 'all',
  search: '',
  sort: 'smart',
};

export const useTaskStore = create<TaskStoreState>((set, get) => ({
  tasks: [],
  stats: null,
  isLoading: false,
  isRefreshing: false,
  error: null,
  filters: initialFilters,

  fetchTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const { filters } = get();
      const serverTasks = await taskApi.getTasks(filters);

      // Enhance with client smart score metadata
      const enhancedTasks = serverTasks.map((t) => ({
        ...t,
        smartScoreMeta: t.smartScoreMeta || calculateClientSmartScore(t),
      }));

      set({ tasks: enhancedTasks, isLoading: false });
      await storage.setObject('cached_tasks', enhancedTasks);
    } catch (err: any) {
      // Offline fallback: load from cached storage
      const cached = await storage.getObject<Task[]>('cached_tasks');
      if (cached && cached.length > 0) {
        set({ tasks: cached, isLoading: false, error: null });
      } else {
        // Provide mock initial tasks if first time offline
        const initialMockTasks = getMockInitialTasks();
        set({ tasks: initialMockTasks, isLoading: false, error: null });
      }
    }
  },

  refreshTasks: async () => {
    set({ isRefreshing: true });
    try {
      const { filters } = get();
      const serverTasks = await taskApi.getTasks(filters);
      const enhanced = serverTasks.map((t) => ({
        ...t,
        smartScoreMeta: t.smartScoreMeta || calculateClientSmartScore(t),
      }));
      set({ tasks: enhanced, isRefreshing: false });
      await storage.setObject('cached_tasks', enhanced);
    } catch {
      set({ isRefreshing: false });
    }
  },

  createTask: async (payload: CreateTaskPayload) => {
    set({ isLoading: true, error: null });
    try {
      const newTask = await taskApi.createTask(payload);
      const enhanced = {
        ...newTask,
        smartScoreMeta: calculateClientSmartScore(newTask),
      };

      set((state) => ({
        tasks: [enhanced, ...state.tasks],
        isLoading: false,
      }));

      get().fetchStats();
      return true;
    } catch (err: any) {
      // Offline local optimistic fallback
      const localTask: Task = {
        _id: 'local_' + Date.now(),
        user: 'current_user',
        title: payload.title,
        description: payload.description,
        dateTime: payload.dateTime,
        deadline: payload.deadline,
        priority: payload.priority,
        category: payload.category,
        tags: payload.tags || [],
        subtasks: payload.subtasks || [],
        reminderEnabled: !!payload.reminderEnabled,
        color: payload.color || '#6366F1',
        isCompleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      localTask.smartScoreMeta = calculateClientSmartScore(localTask);

      set((state) => ({
        tasks: [localTask, ...state.tasks],
        isLoading: false,
      }));

      await storage.setObject('cached_tasks', get().tasks);
      return true;
    }
  },

  updateTask: async (id: string, payload: UpdateTaskPayload) => {
    try {
      const updated = await taskApi.updateTask(id, payload);
      const enhanced = {
        ...updated,
        smartScoreMeta: calculateClientSmartScore(updated),
      };

      set((state) => ({
        tasks: state.tasks.map((t) => (t._id === id ? enhanced : t)),
      }));

      get().fetchStats();
      return true;
    } catch {
      // Local optimistic update
      set((state) => {
        const updatedList = state.tasks.map((t) => {
          if (t._id === id) {
            const merged = { ...t, ...payload, updatedAt: new Date().toISOString() };
            return {
              ...merged,
              smartScoreMeta: calculateClientSmartScore(merged),
            };
          }
          return t;
        });
        return { tasks: updatedList };
      });
      await storage.setObject('cached_tasks', get().tasks);
      return true;
    }
  },

  toggleTask: async (id: string) => {
    // 1. Optimistic UI update immediately
    set((state) => {
      const updatedTasks = state.tasks.map((task) => {
        if (task._id === id) {
          const nextCompleted = !task.isCompleted;
          const updated = {
            ...task,
            isCompleted: nextCompleted,
            completedAt: nextCompleted ? new Date().toISOString() : null,
          };
          return {
            ...updated,
            smartScoreMeta: calculateClientSmartScore(updated),
          };
        }
        return task;
      });
      return { tasks: updatedTasks };
    });

    // 2. Sync with API in background
    try {
      await taskApi.toggleTask(id);
      get().fetchStats();
    } catch {
      // Keep optimistic state locally
      await storage.setObject('cached_tasks', get().tasks);
    }
  },

  toggleSubtask: async (taskId: string, subtaskId: string) => {
    const task = get().tasks.find((t) => t._id === taskId);
    if (!task) return;

    const nextSubtasks = task.subtasks.map((st) =>
      st.id === subtaskId ? { ...st, isCompleted: !st.isCompleted } : st
    );

    await get().updateTask(taskId, { subtasks: nextSubtasks });
  },

  deleteTask: async (id: string) => {
    // Optimistic removal
    set((state) => ({
      tasks: state.tasks.filter((t) => t._id !== id),
    }));

    try {
      await taskApi.deleteTask(id);
      get().fetchStats();
      return true;
    } catch {
      await storage.setObject('cached_tasks', get().tasks);
      return true;
    }
  },

  fetchStats: async () => {
    try {
      const stats = await taskApi.getStats();
      set({ stats });
    } catch {
      // Compute local stats from current task state
      const tasks = get().tasks;
      const total = tasks.length;
      const completed = tasks.filter((t) => t.isCompleted).length;
      const pending = total - completed;
      const now = new Date();

      const overdue = tasks.filter(
        (t) => !t.isCompleted && t.deadline && new Date(t.deadline) < now
      ).length;

      const dueToday = tasks.filter((t) => {
        if (t.isCompleted || !t.deadline) return false;
        const d = new Date(t.deadline);
        return (
          d.getDate() === now.getDate() &&
          d.getMonth() === now.getMonth() &&
          d.getFullYear() === now.getFullYear()
        );
      }).length;

      const priorityCounts = {
        urgent: tasks.filter((t) => !t.isCompleted && t.priority === 'urgent').length,
        high: tasks.filter((t) => !t.isCompleted && t.priority === 'high').length,
        medium: tasks.filter((t) => !t.isCompleted && t.priority === 'medium').length,
        low: tasks.filter((t) => !t.isCompleted && t.priority === 'low').length,
      };

      const categoryCounts: Record<string, number> = {};
      tasks.forEach((t) => {
        categoryCounts[t.category] = (categoryCounts[t.category] || 0) + 1;
      });

      set({
        stats: {
          total,
          completed,
          pending,
          overdue,
          dueToday,
          completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
          priorityCounts,
          categoryCounts,
        },
      });
    }
  },

  // Filter setters
  setStatusFilter: (status) =>
    set((state) => ({ filters: { ...state.filters, status } })),

  setPriorityFilter: (priority) =>
    set((state) => ({ filters: { ...state.filters, priority } })),

  setCategoryFilter: (category) =>
    set((state) => ({ filters: { ...state.filters, category } })),

  setSearchQuery: (search) =>
    set((state) => ({ filters: { ...state.filters, search } })),

  setSortOption: (sort) =>
    set((state) => ({ filters: { ...state.filters, sort } })),

  resetFilters: () => set({ filters: initialFilters }),

  getFilteredTasks: () => {
    const { tasks, filters } = get();

    return tasks
      .filter((task) => {
        // Status filter
        if (filters.status === 'pending' && task.isCompleted) return false;
        if (filters.status === 'completed' && !task.isCompleted) return false;

        // Priority filter
        if (filters.priority !== 'all' && task.priority !== filters.priority) return false;

        // Category filter
        if (filters.category !== 'all' && task.category !== filters.category) return false;

        // Search query
        if (filters.search.trim()) {
          const query = filters.search.toLowerCase();
          const matchTitle = task.title.toLowerCase().includes(query);
          const matchDesc = task.description?.toLowerCase().includes(query);
          const matchTags = task.tags?.some((tag) => tag.toLowerCase().includes(query));
          if (!matchTitle && !matchDesc && !matchTags) return false;
        }

        return true;
      })
      .sort((a, b) => {
        switch (filters.sort) {
          case 'smart': {
            const scoreA = a.smartScoreMeta?.score ?? calculateClientSmartScore(a).score;
            const scoreB = b.smartScoreMeta?.score ?? calculateClientSmartScore(b).score;
            return scoreB - scoreA;
          }
          case 'deadline_asc': {
            if (!a.deadline) return 1;
            if (!b.deadline) return -1;
            return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
          }
          case 'deadline_desc': {
            if (!a.deadline) return 1;
            if (!b.deadline) return -1;
            return new Date(b.deadline).getTime() - new Date(a.deadline).getTime();
          }
          case 'priority_desc': {
            const pMap: Record<TaskPriority, number> = { urgent: 4, high: 3, medium: 2, low: 1 };
            return pMap[b.priority] - pMap[a.priority];
          }
          case 'created_desc': {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          }
          case 'title_asc': {
            return a.title.localeCompare(b.title);
          }
          default:
            return 0;
        }
      });
  },
}));

function getMockInitialTasks(): Task[] {
  const now = new Date();
  return [
    {
      _id: 'sample_task_1',
      user: 'demo-user',
      title: 'Submit React Native Assignment to Modulus Seventeen',
      description: 'Complete the React Native CLI To-Do application with MongoDB backend, JWT auth, and Smart Urgency algorithm.',
      dateTime: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
      deadline: new Date(now.getTime() + 4 * 60 * 60 * 1000).toISOString(), // Due in 4h
      priority: 'urgent',
      category: 'work',
      tags: ['Interview', 'Assignment', 'React Native'],
      isCompleted: false,
      color: '#EF4444',
      reminderEnabled: true,
      subtasks: [
        { id: 'st-1', title: 'Implement Auth with JWT', isCompleted: true },
        { id: 'st-2', title: 'Build UI with Dark Glassmorphism', isCompleted: true },
        { id: 'st-3', title: 'Verify Smart Urgency Algorithm', isCompleted: false },
      ],
      smartScoreMeta: {
        score: 95,
        urgencyLevel: 'CRITICAL',
        urgencyLabel: 'Due in 4h',
        hoursRemaining: 4,
        overdue: false,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: 'sample_task_2',
      user: 'demo-user',
      title: 'Complete Mobile UI Design Review',
      description: 'Check typography hierarchy, neon accents, and smooth animations across Android viewports.',
      dateTime: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(),
      deadline: new Date(now.getTime() - 3 * 60 * 60 * 1000).toISOString(), // Overdue by 3h
      priority: 'high',
      category: 'project',
      tags: ['UI/UX', 'Design', 'Mobile'],
      isCompleted: false,
      color: '#F59E0B',
      reminderEnabled: true,
      subtasks: [
        { id: 'st-4', title: 'Verify responsive paddings', isCompleted: true },
        { id: 'st-5', title: 'Check contrast ratios', isCompleted: false },
      ],
      smartScoreMeta: {
        score: 89,
        urgencyLevel: 'OVERDUE',
        urgencyLabel: 'Overdue by 3h',
        hoursRemaining: -3,
        overdue: true,
      },
      createdAt: new Date(now.getTime() - 36 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: 'sample_task_3',
      user: 'demo-user',
      title: 'Gym Workout - Upper Body & Cardio',
      description: '45 mins chest and back supersets followed by 20 mins HIIT cardio session.',
      dateTime: new Date(now.getTime() + 8 * 60 * 60 * 1000).toISOString(),
      deadline: new Date(now.getTime() + 10 * 60 * 60 * 1000).toISOString(),
      priority: 'medium',
      category: 'health',
      tags: ['Fitness', 'Workout'],
      isCompleted: false,
      color: '#10B981',
      reminderEnabled: false,
      subtasks: [],
      smartScoreMeta: {
        score: 42,
        urgencyLevel: 'CRITICAL',
        urgencyLabel: 'Due in 10h',
        hoursRemaining: 10,
        overdue: false,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: 'sample_task_4',
      user: 'demo-user',
      title: 'Study TypeScript Generics & Advanced Patterns',
      description: 'Read documentation on Conditional Types, Mapped Types, and Template Literal Types.',
      dateTime: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(),
      deadline: new Date(now.getTime() + 48 * 60 * 60 * 1000).toISOString(),
      priority: 'low',
      category: 'study',
      tags: ['TypeScript', 'Learning'],
      isCompleted: false,
      color: '#6366F1',
      reminderEnabled: false,
      subtasks: [],
      smartScoreMeta: {
        score: 22,
        urgencyLevel: 'NEAR_DEADLINE',
        urgencyLabel: 'Due in 2 days',
        hoursRemaining: 48,
        overdue: false,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: 'sample_task_5',
      user: 'demo-user',
      title: 'Monthly Cloud Infrastructure Review & Budgeting',
      description: 'Audit AWS / MongoDB Atlas clusters and adjust auto-scaling thresholds.',
      dateTime: new Date(now.getTime() - 48 * 60 * 60 * 1000).toISOString(),
      deadline: new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString(),
      priority: 'medium',
      category: 'finance',
      tags: ['DevOps', 'Cloud', 'Finance'],
      isCompleted: true,
      completedAt: new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString(),
      color: '#8B5CF6',
      reminderEnabled: false,
      subtasks: [],
      smartScoreMeta: {
        score: -1000,
        urgencyLevel: 'COMPLETED',
        urgencyLabel: 'Completed',
        hoursRemaining: null,
        overdue: false,
      },
      createdAt: new Date(now.getTime() - 48 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
}

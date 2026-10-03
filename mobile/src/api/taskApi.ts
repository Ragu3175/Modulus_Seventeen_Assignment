import { apiClient } from './client';
import {
  Task,
  CreateTaskPayload,
  UpdateTaskPayload,
  TaskStats,
  FilterOptions,
} from '../types/task.types';

export const taskApi = {
  async getTasks(filters?: Partial<FilterOptions>): Promise<Task[]> {
    const params: any = {};
    if (filters?.status && filters.status !== 'all') params.status = filters.status;
    if (filters?.priority && filters.priority !== 'all') params.priority = filters.priority;
    if (filters?.category && filters.category !== 'all') params.category = filters.category;
    if (filters?.search) params.search = filters.search;
    if (filters?.sort) params.sort = filters.sort;

    const res = await apiClient.get<{ success: boolean; data: Task[] }>('/tasks', {
      params,
    });
    return res.data.data;
  },

  async getTaskById(id: string): Promise<Task> {
    const res = await apiClient.get<{ success: boolean; data: Task }>(`/tasks/${id}`);
    return res.data.data;
  },

  async createTask(payload: CreateTaskPayload): Promise<Task> {
    const res = await apiClient.post<{ success: boolean; data: Task }>('/tasks', payload);
    return res.data.data;
  },

  async updateTask(id: string, payload: UpdateTaskPayload): Promise<Task> {
    const res = await apiClient.patch<{ success: boolean; data: Task }>(`/tasks/${id}`, payload);
    return res.data.data;
  },

  async toggleTask(id: string): Promise<Task> {
    const res = await apiClient.patch<{ success: boolean; data: Task }>(`/tasks/${id}/toggle`);
    return res.data.data;
  },

  async deleteTask(id: string): Promise<void> {
    await apiClient.delete(`/tasks/${id}`);
  },

  async getStats(): Promise<TaskStats> {
    const res = await apiClient.get<{ success: boolean; data: TaskStats }>('/tasks/stats/summary');
    return res.data.data;
  },
};

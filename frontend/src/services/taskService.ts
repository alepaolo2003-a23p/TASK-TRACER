import api from './api';
import type { Task, TaskRequest, TaskStatus, Priority } from '../types';

export const taskService = {
  async getAll(params?: {
    status?: TaskStatus;
    priority?: Priority;
    categoryId?: string;
    search?: string;
  }): Promise<Task[]> {
    const res = await api.get<Task[]>('/tasks', { params });
    return res.data;
  },

  async getById(id: string): Promise<Task> {
    const res = await api.get<Task>(`/tasks/${id}`);
    return res.data;
  },

  async create(data: TaskRequest): Promise<Task> {
    const res = await api.post<Task>('/tasks', data);
    return res.data;
  },

  async update(id: string, data: TaskRequest): Promise<Task> {
    const res = await api.put<Task>(`/tasks/${id}`, data);
    return res.data;
  },

  async updateStatus(id: string, status: TaskStatus): Promise<Task> {
    const res = await api.patch<Task>(`/tasks/${id}/status`, { status });
    return res.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/tasks/${id}`);
  },
};

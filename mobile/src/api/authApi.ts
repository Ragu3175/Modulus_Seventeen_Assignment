import { apiClient } from './client';
import { AuthResponse, LoginCredentials, RegisterData, User } from '../types/auth.types';

export const authApi = {
  async register(data: RegisterData): Promise<{ user: User; token: string }> {
    const res = await apiClient.post<AuthResponse>('/auth/register', data);
    return res.data.data;
  },

  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    const res = await apiClient.post<AuthResponse>('/auth/login', credentials);
    return res.data.data;
  },

  async getProfile(): Promise<User> {
    const res = await apiClient.get<{ success: boolean; data: { user: User } }>('/auth/me');
    return res.data.data.user;
  },

  async updateProfile(data: Partial<RegisterData>): Promise<User> {
    const res = await apiClient.put<{ success: boolean; data: { user: User } }>('/auth/profile', data);
    return res.data.data.user;
  },
};

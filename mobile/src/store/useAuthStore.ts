import { create } from 'zustand';
import { User, LoginCredentials, RegisterData } from '../types/auth.types';
import { authApi } from '../api/authApi';
import { storage } from '../utils/storage';

interface AuthStoreState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitializing: boolean;
  error: string | null;

  // Actions
  initializeAuth: () => Promise<void>;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<RegisterData>) => Promise<boolean>;
  clearError: () => void;
  setDemoUser: () => Promise<void>;
}

export const useAuthStore = create<AuthStoreState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  isInitializing: true,
  error: null,

  initializeAuth: async () => {
    try {
      set({ isInitializing: true });
      const storedToken = await storage.getItem('auth_token');
      const storedUser = await storage.getObject<User>('auth_user');

      if (storedToken && storedUser) {
        set({
          token: storedToken,
          user: storedUser,
          isAuthenticated: true,
          isInitializing: false,
        });

        // Silently verify token in background
        try {
          const freshUser = await authApi.getProfile();
          set({ user: freshUser });
          await storage.setObject('auth_user', freshUser);
        } catch {
          // Token expired or server offline; preserve cached user
        }
      } else {
        set({ isInitializing: false });
      }
    } catch {
      set({ isInitializing: false });
    }
  },

  login: async (credentials: LoginCredentials) => {
    set({ isLoading: true, error: null });
    try {
      const { user, token } = await authApi.login(credentials);
      await storage.setItem('auth_token', token);
      await storage.setObject('auth_user', user);

      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      return true;
    } catch (err: any) {
      set({
        isLoading: false,
        error: err.message || 'Login failed. Please check your credentials.',
      });
      return false;
    }
  },

  register: async (data: RegisterData) => {
    set({ isLoading: true, error: null });
    try {
      const { user, token } = await authApi.register(data);
      await storage.setItem('auth_token', token);
      await storage.setObject('auth_user', user);

      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      return true;
    } catch (err: any) {
      set({
        isLoading: false,
        error: err.message || 'Registration failed. Please try again.',
      });
      return false;
    }
  },

  logout: async () => {
    await storage.removeItem('auth_token');
    await storage.removeItem('auth_user');
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,
    });
  },

  updateUser: async (data: Partial<RegisterData>) => {
    set({ isLoading: true, error: null });
    try {
      const updatedUser = await authApi.updateProfile(data);
      await storage.setObject('auth_user', updatedUser);
      set({ user: updatedUser, isLoading: false });
      return true;
    } catch (err: any) {
      set({ isLoading: false, error: err.message || 'Update profile failed' });
      return false;
    }
  },

  clearError: () => set({ error: null }),

  setDemoUser: async () => {
    const demoUser: User = {
      id: 'demo-user-123',
      name: 'Alex Vance',
      email: 'alex@example.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      createdAt: new Date().toISOString(),
    };
    const demoToken = 'mock_jwt_demo_token_123';
    await storage.setItem('auth_token', demoToken);
    await storage.setObject('auth_user', demoUser);
    set({
      user: demoUser,
      token: demoToken,
      isAuthenticated: true,
      isLoading: false,
      error: null,
    });
  },
}));

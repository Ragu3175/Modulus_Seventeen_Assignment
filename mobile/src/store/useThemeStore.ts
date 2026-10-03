import { create } from 'zustand';
import { createTheme, Theme } from '../theme';
import { storage } from '../utils/storage';

interface ThemeStoreState {
  isDark: boolean;
  theme: Theme;
  toggleTheme: () => Promise<void>;
  initializeTheme: () => Promise<void>;
}

export const useThemeStore = create<ThemeStoreState>((set, get) => ({
  isDark: true,
  theme: createTheme(true),

  initializeTheme: async () => {
    const saved = await storage.getItem('app_theme');
    const isDark = saved === null ? true : saved === 'dark';
    set({ isDark, theme: createTheme(isDark) });
  },

  toggleTheme: async () => {
    const nextState = !get().isDark;
    await storage.setItem('app_theme', nextState ? 'dark' : 'light');
    set({ isDark: nextState, theme: createTheme(nextState) });
  },
}));

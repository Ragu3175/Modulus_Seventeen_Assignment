export const darkTheme = {
  // Backgrounds
  background: '#090D16',
  surface: '#0F172A',
  surfaceCard: 'rgba(30, 41, 59, 0.75)',
  surfaceSecondary: '#1E293B',
  surfaceTertiary: '#334155',

  // Borders & Dividers
  border: 'rgba(148, 163, 184, 0.15)',
  borderActive: 'rgba(99, 102, 241, 0.5)',
  divider: 'rgba(148, 163, 184, 0.1)',

  // Primary Brand & Accents
  primary: '#6366F1', // Electric Indigo
  primaryGlow: 'rgba(99, 102, 241, 0.25)',
  primaryLight: '#818CF8',
  secondary: '#8B5CF6', // Cyber Violet
  accent: '#06B6D4', // Cyan
  
  // Status & Priorities
  urgent: '#EF4444',
  urgentBg: 'rgba(239, 68, 68, 0.15)',
  urgentBorder: 'rgba(239, 68, 68, 0.35)',

  high: '#F59E0B',
  highBg: 'rgba(245, 158, 11, 0.15)',
  highBorder: 'rgba(245, 158, 11, 0.35)',

  medium: '#3B82F6',
  mediumBg: 'rgba(59, 130, 246, 0.15)',
  mediumBorder: 'rgba(59, 130, 246, 0.35)',

  low: '#10B981',
  lowBg: 'rgba(16, 185, 129, 0.15)',
  lowBorder: 'rgba(16, 185, 129, 0.35)',

  // Categories Colors
  categories: {
    work: '#6366F1',
    personal: '#EC4899',
    study: '#8B5CF6',
    health: '#10B981',
    finance: '#F59E0B',
    project: '#06B6D4',
    other: '#94A3B8',
  },

  // Text Colors
  text: '#F8FAFC',
  textSecondary: '#94A3B8',
  textTertiary: '#64748B',
  textMuted: '#475569',
  textInverse: '#090D16',

  // Feedback
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
};

export const lightTheme = {
  // Backgrounds
  background: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceCard: '#FFFFFF',
  surfaceSecondary: '#F1F5F9',
  surfaceTertiary: '#E2E8F0',

  // Borders & Dividers
  border: 'rgba(148, 163, 184, 0.25)',
  borderActive: '#6366F1',
  divider: 'rgba(148, 163, 184, 0.15)',

  // Primary Brand & Accents
  primary: '#4F46E5',
  primaryGlow: 'rgba(79, 70, 229, 0.15)',
  primaryLight: '#6366F1',
  secondary: '#7C3AED',
  accent: '#0891B2',

  // Status & Priorities
  urgent: '#DC2626',
  urgentBg: '#FEE2E2',
  urgentBorder: '#FCA5A5',

  high: '#D97706',
  highBg: '#FEF3C7',
  highBorder: '#FCD34D',

  medium: '#2563EB',
  mediumBg: '#DBEAFE',
  mediumBorder: '#93C5FD',

  low: '#059669',
  lowBg: '#D1FAE5',
  lowBorder: '#6EE7B7',

  // Categories Colors
  categories: {
    work: '#4F46E5',
    personal: '#DB2777',
    study: '#7C3AED',
    health: '#059669',
    finance: '#D97706',
    project: '#0891B2',
    other: '#64748B',
  },

  // Text Colors
  text: '#0F172A',
  textSecondary: '#475569',
  textTertiary: '#64748B',
  textMuted: '#94A3B8',
  textInverse: '#FFFFFF',

  // Feedback
  success: '#059669',
  warning: '#D97706',
  error: '#DC2626',
  info: '#2563EB',
};

export type ThemeColors = typeof darkTheme;

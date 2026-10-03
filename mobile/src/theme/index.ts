import { darkTheme, lightTheme, ThemeColors } from './colors';
import { typography } from './typography';
import { spacing, borderRadius, shadows } from './spacing';

export interface Theme {
  isDark: boolean;
  colors: ThemeColors;
  typography: typeof typography;
  spacing: typeof spacing;
  borderRadius: typeof borderRadius;
  shadows: typeof shadows;
}

export const createTheme = (isDark: boolean = true): Theme => ({
  isDark,
  colors: isDark ? darkTheme : lightTheme,
  typography,
  spacing,
  borderRadius,
  shadows,
});

export * from './colors';
export * from './typography';
export * from './spacing';

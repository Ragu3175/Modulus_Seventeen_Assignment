import { Platform, TextStyle } from 'react-native';

const fontFamily = Platform.select({
  ios: 'System',
  android: 'Roboto',
  default: 'System',
});

export const typography: Record<string, TextStyle> = {
  h1: {
    fontFamily,
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 34,
    letterSpacing: -0.5,
  },
  h2: {
    fontFamily,
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 28,
    letterSpacing: -0.3,
  },
  h3: {
    fontFamily,
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 24,
    letterSpacing: -0.2,
  },
  bodyLarge: {
    fontFamily,
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 22,
  },
  bodyMedium: {
    fontFamily,
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
  bodySmall: {
    fontFamily,
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
  },
  caption: {
    fontFamily,
    fontSize: 11,
    fontWeight: '500',
    lineHeight: 14,
    letterSpacing: 0.2,
  },
  button: {
    fontFamily,
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
};

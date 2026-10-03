import React, { useEffect } from 'react';
import { StatusBar, LogBox } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { RootNavigator } from './src/navigation/RootNavigator';
import { useAuthStore } from './src/store/useAuthStore';
import { useThemeStore } from './src/store/useThemeStore';

// Ignore non-critical warnings
LogBox.ignoreLogs(['ViewPropTypes will be removed', 'Sending...']);

const App: React.FC = () => {
  const { initializeAuth } = useAuthStore();
  const { isDark, initializeTheme, theme } = useThemeStore();

  useEffect(() => {
    initializeTheme();
    initializeAuth();
  }, []);

  const navTheme = isDark
    ? {
        ...DarkTheme,
        colors: {
          ...DarkTheme.colors,
          background: theme.colors.background,
          card: theme.colors.surface,
          text: theme.colors.text,
          border: theme.colors.border,
          primary: theme.colors.primary,
        },
      }
    : {
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          background: theme.colors.background,
          card: theme.colors.surface,
          text: theme.colors.text,
          border: theme.colors.border,
          primary: theme.colors.primary,
        },
      };

  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
        translucent={false}
      />
      <NavigationContainer theme={navTheme}>
        <RootNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;

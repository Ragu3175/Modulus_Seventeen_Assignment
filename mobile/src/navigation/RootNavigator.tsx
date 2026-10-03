import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation.types';
import { useAuthStore } from '../store/useAuthStore';
import { AuthNavigator } from './AuthNavigator';
import { MainTabNavigator } from './MainTabNavigator';
import { CreateTaskScreen } from '../screens/main/CreateTaskScreen';
import { TaskDetailScreen } from '../screens/main/TaskDetailScreen';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { useThemeStore } from '../store/useThemeStore';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  const { isAuthenticated, isInitializing } = useAuthStore();
  const { theme } = useThemeStore();
  const colors = theme.colors;

  if (isInitializing) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      {!isAuthenticated ? (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      ) : (
        <>
          <Stack.Screen name="Main" component={MainTabNavigator} />
          <Stack.Screen
            name="CreateTask"
            component={CreateTaskScreen}
            options={{
              presentation: 'modal',
              animation: 'slide_from_bottom',
            }}
          />
          <Stack.Screen name="TaskDetail" component={TaskDetailScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

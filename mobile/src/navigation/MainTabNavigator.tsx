import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from '../types/navigation.types';
import { HomeScreen } from '../screens/main/HomeScreen';
import { AnalyticsScreen } from '../screens/main/AnalyticsScreen';
import { ProfileScreen } from '../screens/main/ProfileScreen';
import { useThemeStore } from '../store/useThemeStore';
import { ListTodoIcon, ChartIcon, UserIcon } from '../components/common/Icons';
import { StyleSheet, View } from 'react-native';

const Tab = createBottomTabNavigator<MainTabParamList>();

export const MainTabNavigator: React.FC = () => {
  const { theme } = useThemeStore();
  const colors = theme.colors;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.15,
          shadowRadius: 6,
        },
        tabBarActiveTintColor: colors.primaryLight,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 2,
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Tasks',
          tabBarIcon: ({ color, size }) => (
            <ListTodoIcon size={size || 22} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="AnalyticsTab"
        component={AnalyticsScreen}
        options={{
          tabBarLabel: 'Analytics',
          tabBarIcon: ({ color, size }) => (
            <ChartIcon size={size || 22} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <UserIcon size={size || 22} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

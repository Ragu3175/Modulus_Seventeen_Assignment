import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useThemeStore } from '../../store/useThemeStore';

export interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  glowingColor?: string;
}

export const Card: React.FC<CardProps> = ({ children, style, glowingColor }) => {
  const { theme } = useThemeStore();
  const colors = theme.colors;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surfaceCard,
          borderColor: glowingColor ? `${glowingColor}60` : colors.border,
          shadowColor: glowingColor || '#000000',
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginVertical: 6,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
});

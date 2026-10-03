import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useThemeStore } from '../../store/useThemeStore';

export interface ProgressBarProps {
  progress: number; // 0 to 1
  color?: string;
  height?: number;
  style?: ViewStyle;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  color,
  height = 6,
  style,
}) => {
  const { theme } = useThemeStore();
  const colors = theme.colors;

  const clamped = Math.min(Math.max(progress, 0), 1);
  const barColor = color || colors.primary;

  return (
    <View
      style={[
        styles.track,
        {
          height,
          backgroundColor: colors.surfaceTertiary,
          borderRadius: height / 2,
        },
        style,
      ]}
    >
      <View
        style={[
          styles.fill,
          {
            width: `${clamped * 100}%`,
            height,
            backgroundColor: barColor,
            borderRadius: height / 2,
            shadowColor: barColor,
            shadowOpacity: 0.5,
            shadowRadius: 4,
            elevation: 2,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  track: {
    width: '100%',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
  },
});

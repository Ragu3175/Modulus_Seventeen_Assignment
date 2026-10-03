import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { useThemeStore } from '../../store/useThemeStore';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  isLoading?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  isLoading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  style,
  textStyle,
}) => {
  const { theme } = useThemeStore();
  const colors = theme.colors;

  const getVariantStyles = (): { container: ViewStyle; text: TextStyle } => {
    switch (variant) {
      case 'primary':
        return {
          container: {
            backgroundColor: colors.primary,
            borderWidth: 0,
            shadowColor: colors.primary,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.35,
            shadowRadius: 8,
            elevation: 4,
          },
          text: { color: '#FFFFFF' },
        };
      case 'secondary':
        return {
          container: {
            backgroundColor: colors.surfaceSecondary,
            borderWidth: 1,
            borderColor: colors.border,
          },
          text: { color: colors.text },
        };
      case 'outline':
        return {
          container: {
            backgroundColor: 'transparent',
            borderWidth: 1.5,
            borderColor: colors.primary,
          },
          text: { color: colors.primary },
        };
      case 'danger':
        return {
          container: {
            backgroundColor: colors.urgent,
            shadowColor: colors.urgent,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.35,
            shadowRadius: 8,
            elevation: 4,
          },
          text: { color: '#FFFFFF' },
        };
      case 'ghost':
        return {
          container: {
            backgroundColor: 'transparent',
          },
          text: { color: colors.textSecondary },
        };
      default:
        return { container: {}, text: {} };
    }
  };

  const getSizeStyles = (): { container: ViewStyle; text: TextStyle } => {
    switch (size) {
      case 'small':
        return {
          container: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 8 },
          text: { fontSize: 13, fontWeight: '600' },
        };
      case 'large':
        return {
          container: { paddingVertical: 16, paddingHorizontal: 24, borderRadius: 14 },
          text: { fontSize: 16, fontWeight: '700' },
        };
      case 'medium':
      default:
        return {
          container: { paddingVertical: 12, paddingHorizontal: 20, borderRadius: 12 },
          text: { fontSize: 14, fontWeight: '600' },
        };
    }
  };

  const vStyle = getVariantStyles();
  const sStyle = getSizeStyles();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || isLoading}
      style={[
        styles.baseButton,
        vStyle.container,
        sStyle.container,
        disabled && styles.disabled,
        style,
      ]}
    >
      {isLoading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' || variant === 'ghost' ? colors.primary : '#FFFFFF'}
        />
      ) : (
        <View style={styles.contentRow}>
          {leftIcon && <View style={styles.leftIconWrapper}>{leftIcon}</View>}
          <Text style={[styles.baseText, vStyle.text, sStyle.text, textStyle]}>
            {title}
          </Text>
          {rightIcon && <View style={styles.rightIconWrapper}>{rightIcon}</View>}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  baseButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  baseText: {
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  leftIconWrapper: {
    marginRight: 8,
  },
  rightIconWrapper: {
    marginLeft: 8,
  },
  disabled: {
    opacity: 0.5,
  },
});

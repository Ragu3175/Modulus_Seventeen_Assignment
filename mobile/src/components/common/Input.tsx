import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import { useThemeStore } from '../../store/useThemeStore';
import { EyeIcon, EyeOffIcon } from './Icons';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isPassword?: boolean;
  containerStyle?: ViewStyle;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  isPassword = false,
  containerStyle,
  ...rest
}) => {
  const { theme } = useThemeStore();
  const colors = theme.colors;

  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label && <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>}

      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: colors.surfaceSecondary,
            borderColor: error
              ? colors.urgent
              : isFocused
              ? colors.primary
              : colors.border,
          },
        ]}
      >
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}

        <TextInput
          style={[styles.input, { color: colors.text }]}
          placeholderTextColor={colors.textTertiary}
          secureTextEntry={isPassword && !showPassword}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...rest}
        />

        {isPassword ? (
          <TouchableOpacity
            style={styles.rightAction}
            onPress={() => setShowPassword(!showPassword)}
            activeOpacity={0.7}
          >
            {showPassword ? (
              <EyeOffIcon size={18} color={colors.textSecondary} />
            ) : (
              <EyeIcon size={18} color={colors.textSecondary} />
            )}
          </TouchableOpacity>
        ) : rightIcon ? (
          <View style={styles.rightAction}>{rightIcon}</View>
        ) : null}
      </View>

      {error ? (
        <Text style={[styles.errorText, { color: colors.urgent }]}>{error}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1.5,
    paddingHorizontal: 12,
    height: 48,
  },
  input: {
    flex: 1,
    fontSize: 14,
    height: '100%',
    paddingVertical: 0,
  },
  leftIcon: {
    marginRight: 8,
  },
  rightAction: {
    marginLeft: 8,
    padding: 4,
  },
  errorText: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 4,
    marginLeft: 4,
  },
});

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeStore } from '../../store/useThemeStore';
import { ListTodoIcon } from './Icons';
import { Button } from './Button';

export interface EmptyStateProps {
  title?: string;
  description?: string;
  actionTitle?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No tasks found',
  description = 'Add a new task or adjust your active filters to see items here.',
  actionTitle,
  onAction,
  icon,
}) => {
  const { theme } = useThemeStore();
  const colors = theme.colors;

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.iconCircle,
          {
            backgroundColor: `${colors.primary}15`,
            borderColor: `${colors.primary}30`,
          },
        ]}
      >
        {icon || <ListTodoIcon size={40} color={colors.primary} />}
      </View>

      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.description, { color: colors.textSecondary }]}>
        {description}
      </Text>

      {actionTitle && onAction ? (
        <Button
          title={actionTitle}
          onPress={onAction}
          variant="primary"
          size="medium"
          style={styles.actionBtn}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  actionBtn: {
    marginTop: 8,
  },
});

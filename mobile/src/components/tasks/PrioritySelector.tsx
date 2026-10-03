import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { TaskPriority } from '../../types/task.types';
import { useThemeStore } from '../../store/useThemeStore';

export interface PrioritySelectorProps {
  selected: TaskPriority;
  onSelect: (priority: TaskPriority) => void;
}

const PRIORITIES: { id: TaskPriority; label: string; icon: string }[] = [
  { id: 'low', label: 'Low', icon: '🟢' },
  { id: 'medium', label: 'Medium', icon: '🔵' },
  { id: 'high', label: 'High', icon: '🟠' },
  { id: 'urgent', label: 'Urgent', icon: '🔴' },
];

export const PrioritySelector: React.FC<PrioritySelectorProps> = ({
  selected,
  onSelect,
}) => {
  const { theme } = useThemeStore();
  const colors = theme.colors;

  const getColorForPriority = (priority: TaskPriority) => {
    switch (priority) {
      case 'urgent':
        return colors.urgent;
      case 'high':
        return colors.high;
      case 'medium':
        return colors.medium;
      case 'low':
      default:
        return colors.low;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>Priority Level</Text>
      <View style={styles.row}>
        {PRIORITIES.map((p) => {
          const isSelected = selected === p.id;
          const pColor = getColorForPriority(p.id);

          return (
            <TouchableOpacity
              key={p.id}
              activeOpacity={0.7}
              onPress={() => onSelect(p.id)}
              style={[
                styles.option,
                {
                  backgroundColor: isSelected ? `${pColor}25` : colors.surfaceSecondary,
                  borderColor: isSelected ? pColor : colors.border,
                },
              ]}
            >
              <Text style={styles.icon}>{p.icon}</Text>
              <Text
                style={[
                  styles.optionText,
                  {
                    color: isSelected ? pColor : colors.textSecondary,
                    fontWeight: isSelected ? '700' : '500',
                  },
                ]}
              >
                {p.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  option: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    gap: 4,
  },
  icon: {
    fontSize: 12,
  },
  optionText: {
    fontSize: 12,
  },
});

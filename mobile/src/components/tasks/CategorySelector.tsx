import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { TaskCategory } from '../../types/task.types';
import { useThemeStore } from '../../store/useThemeStore';

export interface CategorySelectorProps {
  selected: TaskCategory;
  onSelect: (category: TaskCategory) => void;
}

const CATEGORIES: { id: TaskCategory; label: string; icon: string }[] = [
  { id: 'work', label: 'Work', icon: '💼' },
  { id: 'personal', label: 'Personal', icon: '🧘' },
  { id: 'study', label: 'Study', icon: '📚' },
  { id: 'health', label: 'Health', icon: '🏃' },
  { id: 'finance', label: 'Finance', icon: '💰' },
  { id: 'project', label: 'Project', icon: '🚀' },
  { id: 'other', label: 'Other', icon: '📌' },
];

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  selected,
  onSelect,
}) => {
  const { theme } = useThemeStore();
  const colors = theme.colors;

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>Category Tag</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollList}
      >
        {CATEGORIES.map((cat) => {
          const isSelected = selected === cat.id;
          const catColor = (colors.categories as any)[cat.id] || colors.primary;

          return (
            <TouchableOpacity
              key={cat.id}
              activeOpacity={0.7}
              onPress={() => onSelect(cat.id)}
              style={[
                styles.chip,
                {
                  backgroundColor: isSelected ? `${catColor}25` : colors.surfaceSecondary,
                  borderColor: isSelected ? catColor : colors.border,
                },
              ]}
            >
              <Text style={styles.icon}>{cat.icon}</Text>
              <Text
                style={[
                  styles.chipText,
                  {
                    color: isSelected ? catColor : colors.textSecondary,
                    fontWeight: isSelected ? '700' : '500',
                  },
                ]}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
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
  scrollList: {
    flexDirection: 'row',
    gap: 8,
    paddingRight: 16,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1.5,
    gap: 6,
  },
  icon: {
    fontSize: 14,
  },
  chipText: {
    fontSize: 13,
  },
});

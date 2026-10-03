import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useThemeStore } from '../../store/useThemeStore';
import { TaskPriority, SmartScoreMeta } from '../../types/task.types';

export interface PriorityBadgeProps {
  priority: TaskPriority;
  size?: 'small' | 'medium';
  style?: ViewStyle;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({
  priority,
  size = 'small',
  style,
}) => {
  const { theme } = useThemeStore();
  const colors = theme.colors;

  const getConfig = () => {
    switch (priority) {
      case 'urgent':
        return { bg: colors.urgentBg, border: colors.urgentBorder, text: colors.urgent, label: 'Urgent' };
      case 'high':
        return { bg: colors.highBg, border: colors.highBorder, text: colors.high, label: 'High' };
      case 'medium':
        return { bg: colors.mediumBg, border: colors.mediumBorder, text: colors.medium, label: 'Medium' };
      case 'low':
      default:
        return { bg: colors.lowBg, border: colors.lowBorder, text: colors.low, label: 'Low' };
    }
  };

  const config = getConfig();
  const isSmall = size === 'small';

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: config.bg,
          borderColor: config.border,
          paddingVertical: isSmall ? 2 : 4,
          paddingHorizontal: isSmall ? 8 : 12,
        },
        style,
      ]}
    >
      <View style={[styles.dot, { backgroundColor: config.text }]} />
      <Text
        style={[
          styles.text,
          {
            color: config.text,
            fontSize: isSmall ? 10 : 12,
          },
        ]}
      >
        {config.label}
      </Text>
    </View>
  );
};

export interface UrgencyBadgeProps {
  meta?: SmartScoreMeta;
  style?: ViewStyle;
}

export const UrgencyBadge: React.FC<UrgencyBadgeProps> = ({ meta, style }) => {
  const { theme } = useThemeStore();
  const colors = theme.colors;

  if (!meta) return null;

  const getUrgencyConfig = () => {
    switch (meta.urgencyLevel) {
      case 'OVERDUE':
        return { bg: colors.urgentBg, text: colors.urgent, border: colors.urgentBorder };
      case 'CRITICAL':
        return { bg: 'rgba(244, 63, 94, 0.15)', text: '#F43F5E', border: 'rgba(244, 63, 94, 0.3)' };
      case 'NEAR_DEADLINE':
        return { bg: colors.highBg, text: colors.high, border: colors.highBorder };
      case 'UPCOMING':
        return { bg: colors.mediumBg, text: colors.medium, border: colors.mediumBorder };
      case 'COMPLETED':
        return { bg: colors.lowBg, text: colors.low, border: colors.lowBorder };
      case 'ON_TRACK':
      default:
        return { bg: 'rgba(148, 163, 184, 0.15)', text: colors.textSecondary, border: colors.border };
    }
  };

  const conf = getUrgencyConfig();

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: conf.bg,
          borderColor: conf.border,
        },
        style,
      ]}
    >
      <Text style={[styles.text, { color: conf.text, fontSize: 10 }]}>
        {meta.urgencyLabel}
      </Text>
    </View>
  );
};

export interface CategoryBadgeProps {
  category: string;
  style?: ViewStyle;
}

const CATEGORY_EMOJIS: Record<string, string> = {
  work: '💼 Work',
  personal: '🧘 Personal',
  study: '📚 Study',
  health: '🏃 Health',
  finance: '💰 Finance',
  project: '🚀 Project',
  other: '📌 Other',
};

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category, style }) => {
  const { theme } = useThemeStore();
  const colors = theme.colors;

  const label = CATEGORY_EMOJIS[category.toLowerCase()] || `🏷️ ${category}`;
  const catColor = (colors.categories as any)[category.toLowerCase()] || colors.primary;

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: `${catColor}15`,
          borderColor: `${catColor}40`,
        },
        style,
      ]}
    >
      <Text style={[styles.text, { color: catColor, fontSize: 11 }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 1,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
  },
  text: {
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});

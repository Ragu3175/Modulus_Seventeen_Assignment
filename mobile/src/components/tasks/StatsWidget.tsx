import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { TaskStats } from '../../types/task.types';
import { useThemeStore } from '../../store/useThemeStore';
import { ProgressBar } from '../common/ProgressBar';

export interface StatsWidgetProps {
  stats: TaskStats | null;
  onPress?: () => void;
}

export const StatsWidget: React.FC<StatsWidgetProps> = ({ stats, onPress }) => {
  const { theme } = useThemeStore();
  const colors = theme.colors;

  const total = stats?.total || 0;
  const completed = stats?.completed || 0;
  const pending = stats?.pending || 0;
  const overdue = stats?.overdue || 0;
  const rate = stats?.completionRate || (total > 0 ? Math.round((completed / total) * 100) : 0);

  return (
    <TouchableOpacity
      activeOpacity={onPress ? 0.85 : 1}
      onPress={onPress}
      style={[
        styles.container,
        {
          backgroundColor: colors.surfaceCard,
          borderColor: colors.border,
          shadowColor: colors.primary,
        },
      ]}
    >
      {/* Header with Rate */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: colors.text }]}>Productivity Pulse</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {completed} of {total} tasks completed
          </Text>
        </View>

        <View
          style={[
            styles.ratePill,
            {
              backgroundColor: `${colors.primary}20`,
              borderColor: `${colors.primary}50`,
            },
          ]}
        >
          <Text style={[styles.rateText, { color: colors.primaryLight }]}>
            {rate}%
          </Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <ProgressBar
          progress={rate / 100}
          color={rate >= 80 ? colors.success : colors.primary}
          height={8}
        />
      </View>

      {/* Metric Cards Row */}
      <View style={styles.metricsRow}>
        <View
          style={[
            styles.metricBox,
            { backgroundColor: colors.surfaceSecondary, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.metricVal, { color: colors.primaryLight }]}>{pending}</Text>
          <Text style={[styles.metricLbl, { color: colors.textTertiary }]}>Pending</Text>
        </View>

        <View
          style={[
            styles.metricBox,
            { backgroundColor: colors.surfaceSecondary, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.metricVal, { color: colors.success }]}>{completed}</Text>
          <Text style={[styles.metricLbl, { color: colors.textTertiary }]}>Done</Text>
        </View>

        <View
          style={[
            styles.metricBox,
            {
              backgroundColor: overdue > 0 ? colors.urgentBg : colors.surfaceSecondary,
              borderColor: overdue > 0 ? colors.urgentBorder : colors.border,
            },
          ]}
        >
          <Text
            style={[
              styles.metricVal,
              { color: overdue > 0 ? colors.urgent : colors.textSecondary },
            ]}
          >
            {overdue}
          </Text>
          <Text
            style={[
              styles.metricLbl,
              { color: overdue > 0 ? colors.urgent : colors.textTertiary },
            ]}
          >
            Overdue
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    marginVertical: 10,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  ratePill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  rateText: {
    fontSize: 14,
    fontWeight: '800',
  },
  progressContainer: {
    marginBottom: 14,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  metricBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  metricVal: {
    fontSize: 18,
    fontWeight: '800',
  },
  metricLbl: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
});

import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useTaskStore } from '../../store/useTaskStore';
import { useThemeStore } from '../../store/useThemeStore';
import { ProgressBar } from '../../components/common/ProgressBar';
import { SparklesIcon, ChartIcon } from '../../components/common/Icons';

export const AnalyticsScreen: React.FC = () => {
  const { theme } = useThemeStore();
  const colors = theme.colors;
  const { stats, fetchStats, isRefreshing } = useTaskStore();

  useEffect(() => {
    fetchStats();
  }, []);

  const total = stats?.total || 0;
  const completed = stats?.completed || 0;
  const pending = stats?.pending || 0;
  const overdue = stats?.overdue || 0;
  const rate = stats?.completionRate || (total > 0 ? Math.round((completed / total) * 100) : 0);

  const priorityCounts = stats?.priorityCounts || { urgent: 0, high: 0, medium: 0, low: 0 };
  const totalPending = pending || 1; // avoid division by 0

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.headerBar, { borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Productivity Analytics
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={fetchStats}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        {/* Big Completion Hero Card */}
        <View
          style={[
            styles.heroCard,
            {
              backgroundColor: colors.surfaceCard,
              borderColor: colors.border,
              shadowColor: colors.primary,
            },
          ]}
        >
          <View style={styles.heroTop}>
            <View>
              <Text style={[styles.heroLabel, { color: colors.textSecondary }]}>
                Overall Completion Rate
              </Text>
              <Text style={[styles.heroRate, { color: colors.text }]}>{rate}%</Text>
            </View>

            <View
              style={[
                styles.iconBadge,
                {
                  backgroundColor: `${colors.primary}20`,
                  borderColor: `${colors.primary}40`,
                },
              ]}
            >
              <ChartIcon size={24} color={colors.primaryLight} />
            </View>
          </View>

          <ProgressBar
            progress={rate / 100}
            color={rate >= 75 ? colors.success : colors.primary}
            height={10}
            style={{ marginVertical: 12 }}
          />

          <Text style={[styles.heroSummary, { color: colors.textSecondary }]}>
            {completed} completed out of {total} total recorded tasks
          </Text>
        </View>

        {/* 4 Stats Grid */}
        <View style={styles.grid}>
          <View
            style={[
              styles.gridCard,
              { backgroundColor: colors.surfaceCard, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.gridVal, { color: colors.primaryLight }]}>{total}</Text>
            <Text style={[styles.gridLbl, { color: colors.textSecondary }]}>Total Tasks</Text>
          </View>

          <View
            style={[
              styles.gridCard,
              { backgroundColor: colors.surfaceCard, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.gridVal, { color: colors.success }]}>{completed}</Text>
            <Text style={[styles.gridLbl, { color: colors.textSecondary }]}>Completed</Text>
          </View>

          <View
            style={[
              styles.gridCard,
              { backgroundColor: colors.surfaceCard, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.gridVal, { color: colors.high }]}>{pending}</Text>
            <Text style={[styles.gridLbl, { color: colors.textSecondary }]}>In Progress</Text>
          </View>

          <View
            style={[
              styles.gridCard,
              {
                backgroundColor: overdue > 0 ? colors.urgentBg : colors.surfaceCard,
                borderColor: overdue > 0 ? colors.urgentBorder : colors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.gridVal,
                { color: overdue > 0 ? colors.urgent : colors.textSecondary },
              ]}
            >
              {overdue}
            </Text>
            <Text
              style={[
                styles.gridLbl,
                { color: overdue > 0 ? colors.urgent : colors.textSecondary },
              ]}
            >
              Overdue
            </Text>
          </View>
        </View>

        {/* Priority Breakdown Card */}
        <View
          style={[
            styles.sectionCard,
            { backgroundColor: colors.surfaceCard, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.cardTitle, { color: colors.text }]}>
            Pending Tasks by Priority
          </Text>

          <View style={styles.breakdownRow}>
            <View style={styles.breakdownLabelRow}>
              <Text style={[styles.breakdownName, { color: colors.urgent }]}>🔴 Urgent</Text>
              <Text style={[styles.breakdownCount, { color: colors.text }]}>
                {priorityCounts.urgent}
              </Text>
            </View>
            <ProgressBar
              progress={priorityCounts.urgent / totalPending}
              color={colors.urgent}
              height={6}
            />
          </View>

          <View style={styles.breakdownRow}>
            <View style={styles.breakdownLabelRow}>
              <Text style={[styles.breakdownName, { color: colors.high }]}>🟠 High</Text>
              <Text style={[styles.breakdownCount, { color: colors.text }]}>
                {priorityCounts.high}
              </Text>
            </View>
            <ProgressBar
              progress={priorityCounts.high / totalPending}
              color={colors.high}
              height={6}
            />
          </View>

          <View style={styles.breakdownRow}>
            <View style={styles.breakdownLabelRow}>
              <Text style={[styles.breakdownName, { color: colors.medium }]}>🔵 Medium</Text>
              <Text style={[styles.breakdownCount, { color: colors.text }]}>
                {priorityCounts.medium}
              </Text>
            </View>
            <ProgressBar
              progress={priorityCounts.medium / totalPending}
              color={colors.medium}
              height={6}
            />
          </View>

          <View style={styles.breakdownRow}>
            <View style={styles.breakdownLabelRow}>
              <Text style={[styles.breakdownName, { color: colors.low }]}>🟢 Low</Text>
              <Text style={[styles.breakdownCount, { color: colors.text }]}>
                {priorityCounts.low}
              </Text>
            </View>
            <ProgressBar
              progress={priorityCounts.low / totalPending}
              color={colors.low}
              height={6}
            />
          </View>
        </View>

        {/* Smart Productivity Insights */}
        <View
          style={[
            styles.insightCard,
            {
              backgroundColor: `${colors.primary}12`,
              borderColor: `${colors.primary}30`,
            },
          ]}
        >
          <View style={styles.insightHeader}>
            <SparklesIcon size={18} color={colors.primaryLight} />
            <Text style={[styles.insightTitle, { color: colors.primaryLight }]}>
              Smart Productivity Insights
            </Text>
          </View>
          <Text style={[styles.insightText, { color: colors.text }]}>
            {overdue > 0
              ? `⚠️ You have ${overdue} overdue task${overdue > 1 ? 's' : ''}! The Smart Urgency Algorithm has automatically ranked them at the top of your home feed.`
              : priorityCounts.urgent > 0
              ? `🔥 You have ${priorityCounts.urgent} urgent task${priorityCounts.urgent > 1 ? 's' : ''} on deck. Tackle them first to maintain high focus momentum!`
              : `✨ Great job! You are on track with zero overdue tasks. Keep up the high productivity streak!`}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerBar: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  heroCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  heroRate: {
    fontSize: 36,
    fontWeight: '900',
    marginTop: 4,
    letterSpacing: -1,
  },
  iconBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroSummary: {
    fontSize: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  gridCard: {
    width: '48%',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
  },
  gridVal: {
    fontSize: 24,
    fontWeight: '800',
  },
  gridLbl: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  sectionCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 18,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 16,
  },
  breakdownRow: {
    marginBottom: 14,
  },
  breakdownLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  breakdownName: {
    fontSize: 13,
    fontWeight: '600',
  },
  breakdownCount: {
    fontSize: 13,
    fontWeight: '700',
  },
  insightCard: {
    borderRadius: 18,
    borderWidth: 1.5,
    padding: 16,
    marginBottom: 16,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  insightText: {
    fontSize: 13,
    lineHeight: 20,
  },
});

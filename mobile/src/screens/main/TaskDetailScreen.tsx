import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation.types';
import { useTaskStore } from '../../store/useTaskStore';
import { useThemeStore } from '../../store/useThemeStore';
import { PriorityBadge, CategoryBadge, UrgencyBadge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import {
  ArrowLeftIcon,
  CheckIcon,
  CalendarIcon,
  ClockIcon,
  EditIcon,
  TrashIcon,
  SparklesIcon,
  TagIcon,
} from '../../components/common/Icons';
import { formatDateTimeSafe, formatDeadlineRelative } from '../../utils/dateUtils';

type Props = NativeStackScreenProps<RootStackParamList, 'TaskDetail'>;

export const TaskDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const { taskId } = route.params;
  const { theme } = useThemeStore();
  const colors = theme.colors;
  const { tasks, toggleTask, toggleSubtask, deleteTask } = useTaskStore();

  const task = tasks.find((t) => t._id === taskId);

  if (!task) {
    return (
      <View style={[styles.container, styles.center, { backgroundColor: colors.background }]}>
        <Text style={[styles.notFoundText, { color: colors.textSecondary }]}>
          Task not found
        </Text>
        <Button title="Go Back" onPress={() => navigation.goBack()} variant="primary" />
      </View>
    );
  }

  const deadlineInfo = formatDeadlineRelative(task.deadline);
  const isOverdue = !task.isCompleted && deadlineInfo.isOverdue;

  const handleDelete = () => {
    Alert.alert('Delete Task', `Are you sure you want to delete "${task.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteTask(task._id);
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.headerBar, { borderBottomColor: colors.border }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <ArrowLeftIcon size={20} color={colors.text} />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: colors.text }]}>Task Details</Text>

        <View style={styles.headerActions}>
          <TouchableOpacity
            onPress={() => navigation.navigate('CreateTask', { editTask: task })}
            style={styles.headerActionBtn}
          >
            <EditIcon size={18} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelete} style={styles.headerActionBtn}>
            <TrashIcon size={18} color={colors.urgent} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Status & Priority Row */}
        <View style={styles.metaRow}>
          <CategoryBadge category={task.category} />
          <PriorityBadge priority={task.priority} size="medium" />
          {task.smartScoreMeta && <UrgencyBadge meta={task.smartScoreMeta} />}
        </View>

        {/* Title with Complete Toggle */}
        <View style={styles.titleSection}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => toggleTask(task._id)}
            style={[
              styles.checkbox,
              task.isCompleted
                ? { backgroundColor: colors.success, borderColor: colors.success }
                : { borderColor: colors.borderActive, backgroundColor: 'transparent' },
            ]}
          >
            {task.isCompleted && <CheckIcon size={16} color="#FFFFFF" />}
          </TouchableOpacity>

          <Text
            style={[
              styles.title,
              { color: colors.text },
              task.isCompleted && {
                textDecorationLine: 'line-through',
                color: colors.textTertiary,
              },
            ]}
          >
            {task.title}
          </Text>
        </View>

        {/* Deadline Alert Banner */}
        {task.deadline && (
          <View
            style={[
              styles.deadlineBanner,
              {
                backgroundColor: isOverdue ? colors.urgentBg : colors.surfaceCard,
                borderColor: isOverdue ? colors.urgentBorder : colors.border,
              },
            ]}
          >
            <CalendarIcon size={18} color={isOverdue ? colors.urgent : colors.primaryLight} />
            <View style={{ flex: 1 }}>
              <Text
                style={[
                  styles.deadlineBannerTitle,
                  { color: isOverdue ? colors.urgent : colors.text },
                ]}
              >
                {deadlineInfo.text}
              </Text>
              <Text style={[styles.deadlineBannerSub, { color: colors.textSecondary }]}>
                {formatDateTimeSafe(task.deadline)}
              </Text>
            </View>
          </View>
        )}

        {/* Description */}
        {task.description ? (
          <View
            style={[
              styles.cardBox,
              { backgroundColor: colors.surfaceCard, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.cardBoxTitle, { color: colors.textSecondary }]}>
              Description
            </Text>
            <Text style={[styles.descText, { color: colors.text }]}>{task.description}</Text>
          </View>
        ) : null}

        {/* Smart Algorithm Breakdown Card (Bonus Feature) */}
        {task.smartScoreMeta && !task.isCompleted && (
          <View
            style={[
              styles.smartCard,
              {
                backgroundColor: `${colors.primary}12`,
                borderColor: `${colors.primary}35`,
              },
            ]}
          >
            <View style={styles.smartHeader}>
              <SparklesIcon size={18} color={colors.primaryLight} />
              <Text style={[styles.smartTitle, { color: colors.primaryLight }]}>
                Smart Urgency Score: {task.smartScoreMeta.score}/100
              </Text>
            </View>
            <Text style={[styles.smartExplanation, { color: colors.textSecondary }]}>
              Calculated via dynamic mix algorithm:
              {'\n'}• Priority Weight: {task.priority.toUpperCase()} (+{task.priority === 'urgent' ? 45 : task.priority === 'high' ? 30 : task.priority === 'medium' ? 18 : 8} pts)
              {'\n'}• Urgency Factor: {task.smartScoreMeta.urgencyLabel}
              {'\n'}• Status: {task.smartScoreMeta.urgencyLevel}
            </Text>
          </View>
        )}

        {/* Subtasks / Checklist */}
        {task.subtasks && task.subtasks.length > 0 && (
          <View
            style={[
              styles.cardBox,
              { backgroundColor: colors.surfaceCard, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.cardBoxTitle, { color: colors.textSecondary }]}>
              Checklist ({task.subtasks.filter((s) => s.isCompleted).length}/{task.subtasks.length})
            </Text>
            {task.subtasks.map((st) => (
              <TouchableOpacity
                key={st.id}
                activeOpacity={0.7}
                onPress={() => toggleSubtask(task._id, st.id)}
                style={styles.subtaskRow}
              >
                <View
                  style={[
                    styles.subtaskCheck,
                    st.isCompleted
                      ? { backgroundColor: colors.success, borderColor: colors.success }
                      : { borderColor: colors.border, backgroundColor: 'transparent' },
                  ]}
                >
                  {st.isCompleted && <CheckIcon size={12} color="#FFFFFF" />}
                </View>
                <Text
                  style={[
                    styles.subtaskTitle,
                    { color: colors.text },
                    st.isCompleted && {
                      textDecorationLine: 'line-through',
                      color: colors.textTertiary,
                    },
                  ]}
                >
                  {st.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Tags */}
        {task.tags && task.tags.length > 0 && (
          <View
            style={[
              styles.cardBox,
              { backgroundColor: colors.surfaceCard, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.cardBoxTitle, { color: colors.textSecondary }]}>Tags</Text>
            <View style={styles.tagsRow}>
              {task.tags.map((tg) => (
                <View
                  key={tg}
                  style={[
                    styles.tagBadge,
                    { backgroundColor: `${colors.primary}20`, borderColor: colors.primary },
                  ]}
                >
                  <TagIcon size={12} color={colors.primaryLight} />
                  <Text style={[styles.tagBadgeText, { color: colors.primaryLight }]}>
                    {tg}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Timestamps */}
        <View style={styles.timestampBox}>
          <Text style={[styles.timeText, { color: colors.textTertiary }]}>
            Created: {formatDateTimeSafe(task.createdAt)}
          </Text>
          {task.completedAt && (
            <Text style={[styles.timeText, { color: colors.success }]}>
              Completed: {formatDateTimeSafe(task.completedAt)}
            </Text>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.bottomActions}>
          <Button
            title={task.isCompleted ? 'Mark Incomplete' : 'Mark as Completed'}
            onPress={() => toggleTask(task._id)}
            variant={task.isCompleted ? 'secondary' : 'primary'}
            size="large"
            style={{ flex: 1 }}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  notFoundText: {
    fontSize: 16,
    marginBottom: 16,
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  headerActionBtn: {
    padding: 4,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  titleSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 3,
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: '800',
    lineHeight: 28,
    letterSpacing: -0.3,
  },
  deadlineBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
    marginBottom: 16,
  },
  deadlineBannerTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  deadlineBannerSub: {
    fontSize: 12,
    marginTop: 2,
  },
  cardBox: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  cardBoxTitle: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  descText: {
    fontSize: 14,
    lineHeight: 22,
  },
  smartCard: {
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 16,
    marginBottom: 16,
  },
  smartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  smartTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  smartExplanation: {
    fontSize: 12,
    lineHeight: 18,
  },
  subtaskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  subtaskCheck: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  subtaskTitle: {
    fontSize: 14,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1,
    gap: 4,
  },
  tagBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  timestampBox: {
    paddingVertical: 8,
    marginBottom: 20,
  },
  timeText: {
    fontSize: 12,
    marginBottom: 4,
  },
  bottomActions: {
    flexDirection: 'row',
    gap: 12,
  },
});

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Task } from '../../types/task.types';
import { useThemeStore } from '../../store/useThemeStore';
import { useTaskStore } from '../../store/useTaskStore';
import { PriorityBadge, UrgencyBadge, CategoryBadge } from '../common/Badge';
import { ProgressBar } from '../common/ProgressBar';
import {
  CheckIcon,
  CalendarIcon,
  TrashIcon,
  EditIcon,
} from '../common/Icons';
import { formatDeadlineRelative } from '../../utils/dateUtils';

export interface TaskCardProps {
  task: Task;
  onPress: () => void;
  onEdit?: () => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onPress, onEdit }) => {
  const { theme } = useThemeStore();
  const colors = theme.colors;
  const { toggleTask, deleteTask } = useTaskStore();

  const deadlineInfo = formatDeadlineRelative(task.deadline);
  const isOverdue = !task.isCompleted && deadlineInfo.isOverdue;

  // Subtask progress
  const totalSubtasks = task.subtasks?.length || 0;
  const completedSubtasks = task.subtasks?.filter((s) => s.isCompleted).length || 0;
  const subtaskProgress = totalSubtasks > 0 ? completedSubtasks / totalSubtasks : 0;

  const handleDelete = () => {
    Alert.alert('Delete Task', `Are you sure you want to delete "${task.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteTask(task._id) },
    ]);
  };

  const getPriorityColor = () => {
    switch (task.priority) {
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

  const priorityColor = getPriorityColor();

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={onPress}
      style={[
        styles.cardContainer,
        {
          backgroundColor: colors.surfaceCard,
          borderColor: isOverdue ? `${colors.urgent}60` : colors.border,
          shadowColor: isOverdue ? colors.urgent : '#000000',
        },
      ]}
    >
      {/* Left Priority Colored Strip */}
      <View style={[styles.priorityStripe, { backgroundColor: priorityColor }]} />

      <View style={styles.cardContent}>
        {/* Top Meta Bar */}
        <View style={styles.topRow}>
          <View style={styles.badgeGroup}>
            <CategoryBadge category={task.category} />
            <PriorityBadge priority={task.priority} />
            {task.smartScoreMeta && !task.isCompleted && (
              <UrgencyBadge meta={task.smartScoreMeta} />
            )}
          </View>

          {/* Action buttons */}
          <View style={styles.actionButtons}>
            {onEdit && (
              <TouchableOpacity
                onPress={onEdit}
                style={styles.iconBtn}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <EditIcon size={16} color={colors.textTertiary} />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={handleDelete}
              style={styles.iconBtn}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <TrashIcon size={16} color={colors.textTertiary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Title & Checkbox Row */}
        <View style={styles.titleRow}>
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
            {task.isCompleted && <CheckIcon size={14} color="#FFFFFF" />}
          </TouchableOpacity>

          <Text
            numberOfLines={2}
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

        {/* Description snippet */}
        {task.description ? (
          <Text
            numberOfLines={2}
            style={[styles.description, { color: colors.textSecondary }]}
          >
            {task.description}
          </Text>
        ) : null}

        {/* Subtask Mini Progress */}
        {totalSubtasks > 0 && (
          <View style={styles.subtaskProgressWrapper}>
            <View style={styles.subtaskHeader}>
              <Text style={[styles.subtaskLabel, { color: colors.textTertiary }]}>
                Checklist
              </Text>
              <Text style={[styles.subtaskCount, { color: colors.textSecondary }]}>
                {completedSubtasks}/{totalSubtasks}
              </Text>
            </View>
            <ProgressBar
              progress={subtaskProgress}
              color={task.isCompleted ? colors.success : colors.primary}
              height={4}
            />
          </View>
        )}

        {/* Bottom Footer Info */}
        <View style={styles.footerRow}>
          {task.deadline ? (
            <View style={styles.deadlineBadge}>
              <CalendarIcon
                size={13}
                color={isOverdue ? colors.urgent : colors.textSecondary}
              />
              <Text
                style={[
                  styles.deadlineText,
                  {
                    color: isOverdue ? colors.urgent : colors.textSecondary,
                    fontWeight: isOverdue ? '700' : '500',
                  },
                ]}
              >
                {deadlineInfo.text}
              </Text>
            </View>
          ) : (
            <View />
          )}

          {/* Smart Score Pill (Bonus feature display) */}
          {task.smartScoreMeta && task.smartScoreMeta.score > 0 && !task.isCompleted && (
            <View
              style={[
                styles.scorePill,
                { backgroundColor: `${colors.primary}15`, borderColor: `${colors.primary}30` },
              ]}
            >
              <Text style={[styles.scoreText, { color: colors.primaryLight }]}>
                ⚡ Score {task.smartScoreMeta.score}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    borderRadius: 16,
    borderWidth: 1,
    marginVertical: 6,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 3,
  },
  priorityStripe: {
    width: 5,
  },
  cardContent: {
    flex: 1,
    padding: 14,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  badgeGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    alignItems: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBtn: {
    padding: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 4,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 7,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginTop: 2,
  },
  title: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
    letterSpacing: -0.2,
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 2,
    marginBottom: 6,
    marginLeft: 32,
  },
  subtaskProgressWrapper: {
    marginLeft: 32,
    marginTop: 4,
    marginBottom: 8,
  },
  subtaskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  subtaskLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  subtaskCount: {
    fontSize: 11,
    fontWeight: '700',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginLeft: 32,
  },
  deadlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  deadlineText: {
    fontSize: 12,
  },
  scorePill: {
    borderRadius: 999,
    borderWidth: 1,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  scoreText: {
    fontSize: 10,
    fontWeight: '700',
  },
});

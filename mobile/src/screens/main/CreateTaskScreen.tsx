import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation.types';
import { useTaskStore } from '../../store/useTaskStore';
import { useThemeStore } from '../../store/useThemeStore';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { PrioritySelector } from '../../components/tasks/PrioritySelector';
import { CategorySelector } from '../../components/tasks/CategorySelector';
import { SubtaskList } from '../../components/tasks/SubtaskList';
import { ArrowLeftIcon, CalendarIcon, ClockIcon, BellIcon } from '../../components/common/Icons';
import { TaskPriority, TaskCategory, Subtask } from '../../types/task.types';
import { format, addHours, addDays } from 'date-fns';

type Props = NativeStackScreenProps<RootStackParamList, 'CreateTask'>;

export const CreateTaskScreen: React.FC<Props> = ({ navigation, route }) => {
  const { theme } = useThemeStore();
  const colors = theme.colors;
  const { createTask, updateTask, isLoading } = useTaskStore();

  const editTask = route.params?.editTask;
  const isEditing = !!editTask;

  // Form State
  const [title, setTitle] = useState(editTask?.title || '');
  const [description, setDescription] = useState(editTask?.description || '');
  const [priority, setPriority] = useState<TaskPriority>(editTask?.priority || 'medium');
  const [category, setCategory] = useState<TaskCategory>(editTask?.category || 'personal');
  const [deadline, setDeadline] = useState<Date | null>(
    editTask?.deadline ? new Date(editTask.deadline) : addHours(new Date(), 4)
  );
  const [dateTime, setDateTime] = useState<Date | null>(
    editTask?.dateTime ? new Date(editTask.dateTime) : new Date()
  );
  const [subtasks, setSubtasks] = useState<Subtask[]>(editTask?.subtasks || []);
  const [reminderEnabled, setReminderEnabled] = useState(editTask?.reminderEnabled || false);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(editTask?.tags || []);
  const [errors, setErrors] = useState<{ title?: string }>({});

  const validate = () => {
    const errs: { title?: string } = {};
    if (!title.trim()) {
      errs.title = 'Task title is required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    if (isEditing && editTask) {
      const success = await updateTask(editTask._id, {
        title: title.trim(),
        description: description.trim(),
        priority,
        category,
        deadline: deadline ? deadline.toISOString() : null,
        dateTime: dateTime ? dateTime.toISOString() : null,
        subtasks,
        tags,
        reminderEnabled,
      });

      if (success) {
        navigation.goBack();
      }
    } else {
      const success = await createTask({
        title: title.trim(),
        description: description.trim(),
        priority,
        category,
        deadline: deadline ? deadline.toISOString() : null,
        dateTime: dateTime ? dateTime.toISOString() : null,
        subtasks,
        tags,
        reminderEnabled,
      });

      if (success) {
        navigation.goBack();
      }
    }
  };

  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    const clean = tagInput.trim().replace(/^#/, '');
    if (!tags.includes(clean)) {
      setTags([...tags, clean]);
    }
    setTagInput('');
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <View style={[styles.headerBar, { borderBottomColor: colors.border }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={styles.backBtn}
        >
          <ArrowLeftIcon size={20} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          {isEditing ? 'Edit Task' : 'New Task'}
        </Text>
        <TouchableOpacity onPress={handleSave} style={styles.saveHeaderBtn}>
          <Text style={[styles.saveHeaderText, { color: colors.primaryLight }]}>
            {isEditing ? 'Update' : 'Save'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Title Input */}
        <Input
          label="Task Title *"
          placeholder="What needs to be done?"
          value={title}
          onChangeText={(t) => {
            setTitle(t);
            setErrors({});
          }}
          error={errors.title}
        />

        {/* Description Input */}
        <Input
          label="Description (Optional)"
          placeholder="Add details, notes, or links..."
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
          style={{ height: 80, textAlignVertical: 'top' }}
        />

        {/* Priority Selector */}
        <PrioritySelector selected={priority} onSelect={setPriority} />

        {/* Category Selector */}
        <CategorySelector selected={category} onSelect={setCategory} />

        {/* Deadline Preset Pills */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>
            Deadline / Due Time
          </Text>
          <View style={styles.presetRow}>
            <TouchableOpacity
              onPress={() => setDeadline(addHours(new Date(), 2))}
              style={[
                styles.presetPill,
                { backgroundColor: colors.surfaceSecondary, borderColor: colors.border },
              ]}
            >
              <ClockIcon size={12} color={colors.primaryLight} />
              <Text style={[styles.presetText, { color: colors.text }]}>In 2 Hours</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setDeadline(addHours(new Date(), 8))}
              style={[
                styles.presetPill,
                { backgroundColor: colors.surfaceSecondary, borderColor: colors.border },
              ]}
            >
              <ClockIcon size={12} color={colors.primaryLight} />
              <Text style={[styles.presetText, { color: colors.text }]}>End of Day</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setDeadline(addDays(new Date(), 1))}
              style={[
                styles.presetPill,
                { backgroundColor: colors.surfaceSecondary, borderColor: colors.border },
              ]}
            >
              <CalendarIcon size={12} color={colors.primaryLight} />
              <Text style={[styles.presetText, { color: colors.text }]}>Tomorrow</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setDeadline(addDays(new Date(), 3))}
              style={[
                styles.presetPill,
                { backgroundColor: colors.surfaceSecondary, borderColor: colors.border },
              ]}
            >
              <CalendarIcon size={12} color={colors.primaryLight} />
              <Text style={[styles.presetText, { color: colors.text }]}>In 3 Days</Text>
            </TouchableOpacity>
          </View>

          {deadline && (
            <View
              style={[
                styles.selectedDateBanner,
                { backgroundColor: colors.surfaceCard, borderColor: colors.border },
              ]}
            >
              <CalendarIcon size={16} color={colors.primaryLight} />
              <Text style={[styles.selectedDateText, { color: colors.text }]}>
                Selected Deadline: {format(deadline, 'EEEE, MMM d, yyyy • h:mm a')}
              </Text>
            </View>
          )}
        </View>

        {/* Subtasks / Checklist */}
        <SubtaskList subtasks={subtasks} onChange={setSubtasks} />

        {/* Tags */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Tags</Text>
          <View style={styles.tagsContainer}>
            {tags.map((t) => (
              <View
                key={t}
                style={[
                  styles.tagChip,
                  { backgroundColor: `${colors.primary}20`, borderColor: colors.primary },
                ]}
              >
                <Text style={[styles.tagText, { color: colors.primaryLight }]}>#{t}</Text>
                <TouchableOpacity onPress={() => handleRemoveTag(t)}>
                  <Text style={[styles.tagRemove, { color: colors.primaryLight }]}>×</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>

          <View style={styles.tagInputRow}>
            <Input
              placeholder="Add a tag (e.g. Urgent, Work, Review)..."
              value={tagInput}
              onChangeText={setTagInput}
              onSubmitEditing={handleAddTag}
              returnKeyType="done"
              containerStyle={{ flex: 1, marginBottom: 0 }}
            />
            <Button
              title="Add"
              onPress={handleAddTag}
              variant="secondary"
              size="small"
              style={{ marginLeft: 8 }}
            />
          </View>
        </View>

        {/* Reminder Toggle */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setReminderEnabled(!reminderEnabled)}
          style={[
            styles.reminderRow,
            { backgroundColor: colors.surfaceCard, borderColor: colors.border },
          ]}
        >
          <View style={styles.reminderLeft}>
            <BellIcon
              size={20}
              color={reminderEnabled ? colors.primaryLight : colors.textTertiary}
            />
            <View>
              <Text style={[styles.reminderTitle, { color: colors.text }]}>
                Notification Reminder
              </Text>
              <Text style={[styles.reminderSub, { color: colors.textSecondary }]}>
                Receive alerts before task deadline expires
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.toggleSwitch,
              {
                backgroundColor: reminderEnabled ? colors.primary : colors.surfaceTertiary,
              },
            ]}
          >
            <View
              style={[
                styles.toggleThumb,
                {
                  transform: [{ translateX: reminderEnabled ? 16 : 0 }],
                },
              ]}
            />
          </View>
        </TouchableOpacity>

        {/* Action Button */}
        <Button
          title={isEditing ? 'Update Task' : 'Create Task'}
          onPress={handleSave}
          variant="primary"
          size="large"
          isLoading={isLoading}
          style={styles.createBtn}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  saveHeaderBtn: {
    padding: 4,
  },
  saveHeaderText: {
    fontSize: 15,
    fontWeight: '700',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  presetRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  presetPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    gap: 6,
  },
  presetText: {
    fontSize: 12,
    fontWeight: '500',
  },
  selectedDateBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  selectedDateText: {
    fontSize: 13,
    fontWeight: '600',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  tagChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1,
    gap: 6,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
  },
  tagRemove: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 16,
  },
  tagInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reminderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 24,
  },
  reminderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  reminderTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  reminderSub: {
    fontSize: 12,
    marginTop: 2,
  },
  toggleSwitch: {
    width: 44,
    height: 26,
    borderRadius: 13,
    padding: 2,
    justifyContent: 'center',
  },
  toggleThumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FFFFFF',
  },
  createBtn: {
    marginTop: 8,
    marginBottom: 20,
  },
});

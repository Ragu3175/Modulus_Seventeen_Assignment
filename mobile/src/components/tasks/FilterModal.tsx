import React from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { FilterOptions, TaskSortOption, TaskPriority, TaskCategory } from '../../types/task.types';
import { useThemeStore } from '../../store/useThemeStore';
import { CloseIcon, SparklesIcon } from '../common/Icons';
import { Button } from '../common/Button';

export interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  filters: FilterOptions;
  onApply: (filters: FilterOptions) => void;
  onReset: () => void;
}

const SORT_OPTIONS: { id: TaskSortOption; label: string; desc: string; isSmart?: boolean }[] = [
  {
    id: 'smart',
    label: '⚡ Smart Urgency & Priority Mix',
    desc: 'Intelligent multi-factor scoring (Deadline + Priority + Age)',
    isSmart: true,
  },
  { id: 'deadline_asc', label: '⏰ Nearest Deadline First', desc: 'Sort by closest due date' },
  { id: 'priority_desc', label: '🚨 Highest Priority First', desc: 'Urgent → High → Medium → Low' },
  { id: 'created_desc', label: '📅 Recently Added', desc: 'Newest created tasks first' },
  { id: 'title_asc', label: '🔤 Alphabetical (A-Z)', desc: 'Sort by title name' },
];

const STATUS_OPTIONS: { id: FilterOptions['status']; label: string }[] = [
  { id: 'all', label: 'All Tasks' },
  { id: 'pending', label: 'Pending Only' },
  { id: 'completed', label: 'Completed' },
];

const PRIORITIES: { id: 'all' | TaskPriority; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'urgent', label: 'Urgent' },
  { id: 'high', label: 'High' },
  { id: 'medium', label: 'Medium' },
  { id: 'low', label: 'Low' },
];

const CATEGORIES: { id: 'all' | TaskCategory; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'work', label: '💼 Work' },
  { id: 'personal', label: '🧘 Personal' },
  { id: 'study', label: '📚 Study' },
  { id: 'health', label: '🏃 Health' },
  { id: 'finance', label: '💰 Finance' },
  { id: 'project', label: '🚀 Project' },
  { id: 'other', label: '📌 Other' },
];

export const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  filters,
  onApply,
  onReset,
}) => {
  const { theme } = useThemeStore();
  const colors = theme.colors;

  const [localFilters, setLocalFilters] = React.useState<FilterOptions>(filters);

  React.useEffect(() => {
    setLocalFilters(filters);
  }, [filters, visible]);

  const handleApply = () => {
    onApply(localFilters);
    onClose();
  };

  const handleReset = () => {
    onReset();
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View
          style={[
            styles.sheetContainer,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>Filter & Sort Tasks</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <CloseIcon size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Sort Algorithm Section */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
                Sorting Algorithm
              </Text>
              {SORT_OPTIONS.map((opt) => {
                const isSelected = localFilters.sort === opt.id;
                return (
                  <TouchableOpacity
                    key={opt.id}
                    activeOpacity={0.7}
                    onPress={() => setLocalFilters({ ...localFilters, sort: opt.id })}
                    style={[
                      styles.sortCard,
                      {
                        backgroundColor: isSelected
                          ? `${colors.primary}20`
                          : colors.surfaceSecondary,
                        borderColor: isSelected ? colors.primary : colors.border,
                      },
                    ]}
                  >
                    <View style={styles.sortHeader}>
                      <Text
                        style={[
                          styles.sortLabel,
                          {
                            color: isSelected ? colors.primaryLight : colors.text,
                            fontWeight: isSelected ? '700' : '600',
                          },
                        ]}
                      >
                        {opt.label}
                      </Text>
                      {opt.isSmart && (
                        <View
                          style={[
                            styles.smartBadge,
                            { backgroundColor: `${colors.primary}30` },
                          ]}
                        >
                          <SparklesIcon size={12} color={colors.primaryLight} />
                          <Text style={[styles.smartText, { color: colors.primaryLight }]}>
                            Smart
                          </Text>
                        </View>
                      )}
                    </View>
                    <Text style={[styles.sortDesc, { color: colors.textTertiary }]}>
                      {opt.desc}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Status Filter */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
                Task Status
              </Text>
              <View style={styles.chipRow}>
                {STATUS_OPTIONS.map((st) => {
                  const isSelected = localFilters.status === st.id;
                  return (
                    <TouchableOpacity
                      key={st.id}
                      activeOpacity={0.7}
                      onPress={() => setLocalFilters({ ...localFilters, status: st.id })}
                      style={[
                        styles.chip,
                        {
                          backgroundColor: isSelected
                            ? colors.primary
                            : colors.surfaceSecondary,
                          borderColor: isSelected ? colors.primary : colors.border,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          {
                            color: isSelected ? '#FFFFFF' : colors.textSecondary,
                            fontWeight: isSelected ? '700' : '500',
                          },
                        ]}
                      >
                        {st.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Priority Filter */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
                Priority Filter
              </Text>
              <View style={styles.chipRow}>
                {PRIORITIES.map((pr) => {
                  const isSelected = localFilters.priority === pr.id;
                  return (
                    <TouchableOpacity
                      key={pr.id}
                      activeOpacity={0.7}
                      onPress={() => setLocalFilters({ ...localFilters, priority: pr.id })}
                      style={[
                        styles.chip,
                        {
                          backgroundColor: isSelected
                            ? colors.primary
                            : colors.surfaceSecondary,
                          borderColor: isSelected ? colors.primary : colors.border,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          {
                            color: isSelected ? '#FFFFFF' : colors.textSecondary,
                            fontWeight: isSelected ? '700' : '500',
                          },
                        ]}
                      >
                        {pr.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Category Filter */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
                Category Tag
              </Text>
              <View style={styles.chipRow}>
                {CATEGORIES.map((cat) => {
                  const isSelected = localFilters.category === cat.id;
                  return (
                    <TouchableOpacity
                      key={cat.id}
                      activeOpacity={0.7}
                      onPress={() => setLocalFilters({ ...localFilters, category: cat.id })}
                      style={[
                        styles.chip,
                        {
                          backgroundColor: isSelected
                            ? colors.primary
                            : colors.surfaceSecondary,
                          borderColor: isSelected ? colors.primary : colors.border,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          {
                            color: isSelected ? '#FFFFFF' : colors.textSecondary,
                            fontWeight: isSelected ? '700' : '500',
                          },
                        ]}
                      >
                        {cat.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </ScrollView>

          {/* Bottom Actions */}
          <View style={[styles.footer, { borderTopColor: colors.border }]}>
            <Button
              title="Reset All"
              variant="ghost"
              onPress={handleReset}
              style={{ flex: 1 }}
            />
            <Button
              title="Apply Filters"
              variant="primary"
              onPress={handleApply}
              style={{ flex: 1.5 }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderBottomWidth: 0,
    maxHeight: '85%',
    paddingTop: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  closeBtn: {
    padding: 4,
  },
  content: {
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  sortCard: {
    borderRadius: 12,
    borderWidth: 1.5,
    padding: 12,
    marginBottom: 8,
  },
  sortHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sortLabel: {
    fontSize: 14,
  },
  sortDesc: {
    fontSize: 11,
    marginTop: 2,
  },
  smartBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 3,
  },
  smartText: {
    fontSize: 10,
    fontWeight: '700',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 12,
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    gap: 12,
  },
});

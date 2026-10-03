import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation.types';
import { useTaskStore } from '../../store/useTaskStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useThemeStore } from '../../store/useThemeStore';
import { TaskCard } from '../../components/tasks/TaskCard';
import { StatsWidget } from '../../components/tasks/StatsWidget';
import { SearchBar } from '../../components/tasks/SearchBar';
import { FilterModal } from '../../components/tasks/FilterModal';
import { EmptyState } from '../../components/common/EmptyState';
import { PlusIcon, SparklesIcon } from '../../components/common/Icons';
import { format } from 'date-fns';
import { TaskCategory } from '../../types/task.types';

type Props = NativeStackScreenProps<RootStackParamList, 'Main'>;

const CATEGORY_CHIPS: { id: 'all' | TaskCategory; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'work', label: '💼 Work' },
  { id: 'personal', label: '🧘 Personal' },
  { id: 'study', label: '📚 Study' },
  { id: 'health', label: '🏃 Health' },
  { id: 'finance', label: '💰 Finance' },
  { id: 'project', label: '🚀 Project' },
];

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const { theme } = useThemeStore();
  const colors = theme.colors;
  const { user } = useAuthStore();
  const {
    tasks,
    stats,
    isLoading,
    isRefreshing,
    filters,
    fetchTasks,
    refreshTasks,
    fetchStats,
    setStatusFilter,
    setPriorityFilter,
    setCategoryFilter,
    setSearchQuery,
    setSortOption,
    resetFilters,
    getFilteredTasks,
  } = useTaskStore();

  const [filterModalVisible, setFilterModalVisible] = useState(false);

  useEffect(() => {
    fetchTasks();
    fetchStats();
  }, []);

  const filteredTasks = useMemo(() => getFilteredTasks(), [tasks, filters]);

  // Calculate active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.status !== 'all') count++;
    if (filters.priority !== 'all') count++;
    if (filters.category !== 'all') count++;
    if (filters.sort !== 'smart') count++;
    return count;
  }, [filters]);

  const firstName = user?.name ? user.name.split(' ')[0] : 'User';
  const todayStr = format(new Date(), 'EEEE, MMMM d');

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header Bar */}
      <View style={[styles.headerBar, { borderBottomColor: colors.border }]}>
        <View>
          <Text style={[styles.greeting, { color: colors.text }]}>
            Hello, {firstName} 👋
          </Text>
          <Text style={[styles.dateText, { color: colors.textSecondary }]}>
            {todayStr}
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.avatarCircle,
            { backgroundColor: `${colors.primary}20`, borderColor: colors.primary },
          ]}
          onPress={() => (navigation as any).navigate('ProfileTab')}
        >
          <Text style={[styles.avatarInitial, { color: colors.primaryLight }]}>
            {firstName.charAt(0).toUpperCase()}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TaskCard
            task={item}
            onPress={() => navigation.navigate('TaskDetail', { taskId: item._id })}
            onEdit={() => navigation.navigate('CreateTask', { editTask: item })}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refreshTasks}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        ListHeaderComponent={
          <View>
            {/* Stats Dashboard Banner */}
            <StatsWidget
              stats={stats}
              onPress={() => (navigation as any).navigate('AnalyticsTab')}
            />

            {/* Search & Filter Bar */}
            <SearchBar
              value={filters.search}
              onChangeText={setSearchQuery}
              onFilterPress={() => setFilterModalVisible(true)}
              activeFilterCount={activeFilterCount}
            />

            {/* Category Quick Selector Chips */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chipRow}
            >
              {CATEGORY_CHIPS.map((cat) => {
                const isSelected = filters.category === cat.id;
                return (
                  <TouchableOpacity
                    key={cat.id}
                    activeOpacity={0.7}
                    onPress={() => setCategoryFilter(cat.id)}
                    style={[
                      styles.categoryChip,
                      {
                        backgroundColor: isSelected
                          ? colors.primary
                          : colors.surfaceCard,
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
            </ScrollView>

            {/* Section Title & Smart Algorithm Indicator */}
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                {filters.status === 'completed'
                  ? 'Completed Tasks'
                  : filters.status === 'pending'
                  ? 'Pending Tasks'
                  : 'All Tasks'}{' '}
                ({filteredTasks.length})
              </Text>

              {filters.sort === 'smart' && (
                <View
                  style={[
                    styles.algoPill,
                    { backgroundColor: `${colors.primary}15`, borderColor: `${colors.primary}30` },
                  ]}
                >
                  <SparklesIcon size={12} color={colors.primaryLight} />
                  <Text style={[styles.algoText, { color: colors.primaryLight }]}>
                    Smart Urgency Sort
                  </Text>
                </View>
              )}
            </View>
          </View>
        }
        ListEmptyComponent={
          !isLoading ? (
            <EmptyState
              title={filters.search ? 'No matching tasks' : 'No tasks on your list'}
              description={
                filters.search
                  ? `No tasks match "${filters.search}". Try clearing your search.`
                  : 'Start your productive day by adding your first task.'
              }
              actionTitle="Create Task"
              onAction={() => navigation.navigate('CreateTask')}
            />
          ) : null
        }
      />

      {/* Floating Action Button (FAB) */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => navigation.navigate('CreateTask')}
        style={[
          styles.fab,
          {
            backgroundColor: colors.primary,
            shadowColor: colors.primary,
          },
        ]}
      >
        <PlusIcon size={24} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Filter Bottom Sheet Modal */}
      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        filters={filters}
        onApply={(newFilters) => {
          setStatusFilter(newFilters.status);
          setPriorityFilter(newFilters.priority);
          setCategoryFilter(newFilters.category);
          setSortOption(newFilters.sort);
        }}
        onReset={resetFilters}
      />
    </View>
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
  greeting: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  dateText: {
    fontSize: 12,
    marginTop: 2,
    fontWeight: '500',
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontSize: 16,
    fontWeight: '800',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 90,
  },
  chipRow: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 6,
    marginBottom: 8,
  },
  categoryChip: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  algoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    borderWidth: 1,
    gap: 4,
  },
  algoText: {
    fontSize: 11,
    fontWeight: '700',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
});

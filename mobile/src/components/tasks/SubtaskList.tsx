import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Subtask } from '../../types/task.types';
import { useThemeStore } from '../../store/useThemeStore';
import { CheckIcon, PlusIcon, TrashIcon } from '../common/Icons';

export interface SubtaskListProps {
  subtasks: Subtask[];
  onChange: (subtasks: Subtask[]) => void;
  readOnly?: boolean;
}

export const SubtaskList: React.FC<SubtaskListProps> = ({
  subtasks,
  onChange,
  readOnly = false,
}) => {
  const { theme } = useThemeStore();
  const colors = theme.colors;

  const [newTitle, setNewTitle] = useState('');

  const handleAdd = () => {
    if (!newTitle.trim()) return;
    const next: Subtask = {
      id: 'st_' + Date.now(),
      title: newTitle.trim(),
      isCompleted: false,
    };
    onChange([...subtasks, next]);
    setNewTitle('');
  };

  const handleToggle = (id: string) => {
    const updated = subtasks.map((st) =>
      st.id === id ? { ...st, isCompleted: !st.isCompleted } : st
    );
    onChange(updated);
  };

  const handleDelete = (id: string) => {
    const updated = subtasks.filter((st) => st.id !== id);
    onChange(updated);
  };

  const completedCount = subtasks.filter((s) => s.isCompleted).length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          Checklist Items ({completedCount}/{subtasks.length})
        </Text>
      </View>

      {/* Existing Subtasks */}
      {subtasks.map((item) => (
        <View
          key={item.id}
          style={[
            styles.itemRow,
            {
              backgroundColor: colors.surfaceSecondary,
              borderColor: colors.border,
            },
          ]}
        >
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => handleToggle(item.id)}
            style={[
              styles.checkbox,
              item.isCompleted
                ? { backgroundColor: colors.success, borderColor: colors.success }
                : { borderColor: colors.borderActive, backgroundColor: 'transparent' },
            ]}
          >
            {item.isCompleted && <CheckIcon size={12} color="#FFFFFF" />}
          </TouchableOpacity>

          <Text
            style={[
              styles.itemText,
              { color: colors.text },
              item.isCompleted && {
                textDecorationLine: 'line-through',
                color: colors.textTertiary,
              },
            ]}
          >
            {item.title}
          </Text>

          {!readOnly && (
            <TouchableOpacity
              onPress={() => handleDelete(item.id)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              style={styles.deleteBtn}
            >
              <TrashIcon size={15} color={colors.textTertiary} />
            </TouchableOpacity>
          )}
        </View>
      ))}

      {/* Add New Subtask Input */}
      {!readOnly && (
        <View
          style={[
            styles.inputRow,
            {
              backgroundColor: colors.surfaceSecondary,
              borderColor: colors.border,
            },
          ]}
        >
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder="Add a checklist step..."
            placeholderTextColor={colors.textTertiary}
            value={newTitle}
            onChangeText={setNewTitle}
            onSubmitEditing={handleAdd}
            returnKeyType="done"
          />
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleAdd}
            disabled={!newTitle.trim()}
            style={[
              styles.addBtn,
              {
                backgroundColor: newTitle.trim() ? colors.primary : colors.surfaceTertiary,
              },
            ]}
          >
            <PlusIcon size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 6,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 5,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  itemText: {
    flex: 1,
    fontSize: 13,
  },
  deleteBtn: {
    padding: 4,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 10,
    height: 44,
    marginTop: 4,
  },
  input: {
    flex: 1,
    fontSize: 13,
    paddingVertical: 0,
  },
  addBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
});

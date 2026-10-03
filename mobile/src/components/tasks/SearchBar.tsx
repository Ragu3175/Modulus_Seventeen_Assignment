import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
} from 'react-native';
import { useThemeStore } from '../../store/useThemeStore';
import { SearchIcon, CloseIcon, FilterIcon } from '../common/Icons';

export interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onFilterPress: () => void;
  activeFilterCount?: number;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  onFilterPress,
  activeFilterCount = 0,
}) => {
  const { theme } = useThemeStore();
  const colors = theme.colors;

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.searchBox,
          {
            backgroundColor: colors.surfaceCard,
            borderColor: colors.border,
          },
        ]}
      >
        <SearchIcon size={18} color={colors.textTertiary} />

        <TextInput
          style={[styles.input, { color: colors.text }]}
          placeholder="Search tasks, descriptions, tags..."
          placeholderTextColor={colors.textTertiary}
          value={value}
          onChangeText={onChangeText}
          returnKeyType="search"
          autoCorrect={false}
        />

        {value.length > 0 && (
          <TouchableOpacity
            onPress={() => onChangeText('')}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={styles.clearBtn}
          >
            <CloseIcon size={16} color={colors.textTertiary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Button with Active Badge */}
      <TouchableOpacity
        activeOpacity={0.75}
        onPress={onFilterPress}
        style={[
          styles.filterBtn,
          {
            backgroundColor: activeFilterCount > 0 ? `${colors.primary}25` : colors.surfaceCard,
            borderColor: activeFilterCount > 0 ? colors.primary : colors.border,
          },
        ]}
      >
        <FilterIcon
          size={18}
          color={activeFilterCount > 0 ? colors.primary : colors.textSecondary}
        />
        {activeFilterCount > 0 && (
          <View style={[styles.badgeDot, { backgroundColor: colors.primary }]}>
            <Text style={styles.badgeCount}>{activeFilterCount}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: 8,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 12,
    height: 44,
  },
  input: {
    flex: 1,
    fontSize: 13,
    marginLeft: 8,
    paddingVertical: 0,
  },
  clearBtn: {
    padding: 4,
  },
  filterBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  badgeDot: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeCount: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
});

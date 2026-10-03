import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useAuthStore } from '../../store/useAuthStore';
import { useTaskStore } from '../../store/useTaskStore';
import { useThemeStore } from '../../store/useThemeStore';
import { Button } from '../../components/common/Button';
import { BASE_API_URL } from '../../api/client';
import {
  UserIcon,
  LogoutIcon,
  SparklesIcon,
} from '../../components/common/Icons';
import { formatDateTimeSafe } from '../../utils/dateUtils';

export const ProfileScreen: React.FC = () => {
  const { theme, isDark, toggleTheme } = useThemeStore();
  const colors = theme.colors;
  const { user, logout } = useAuthStore();
  const { tasks, fetchTasks } = useTaskStore();

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out of your account?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: () => logout() },
    ]);
  };

  const completedCount = tasks.filter((t) => t.isCompleted).length;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.headerBar, { borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>User Profile</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View
          style={[
            styles.profileCard,
            {
              backgroundColor: colors.surfaceCard,
              borderColor: colors.border,
            },
          ]}
        >
          <View
            style={[
              styles.avatarContainer,
              {
                backgroundColor: `${colors.primary}20`,
                borderColor: colors.primary,
              },
            ]}
          >
            <Text style={[styles.avatarText, { color: colors.primaryLight }]}>
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </Text>
          </View>

          <Text style={[styles.userName, { color: colors.text }]}>{user?.name || 'Alex Vance'}</Text>
          <Text style={[styles.userEmail, { color: colors.textSecondary }]}>
            {user?.email || 'alex@example.com'}
          </Text>

          {user?.createdAt && (
            <Text style={[styles.memberSince, { color: colors.textTertiary }]}>
              Member since {formatDateTimeSafe(user.createdAt)}
            </Text>
          )}
        </View>

        {/* Quick Stats Banner */}
        <View style={styles.statsBanner}>
          <View
            style={[
              styles.bannerItem,
              { backgroundColor: colors.surfaceCard, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.bannerVal, { color: colors.primaryLight }]}>{tasks.length}</Text>
            <Text style={[styles.bannerLbl, { color: colors.textSecondary }]}>Total Tasks</Text>
          </View>
          <View
            style={[
              styles.bannerItem,
              { backgroundColor: colors.surfaceCard, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.bannerVal, { color: colors.success }]}>{completedCount}</Text>
            <Text style={[styles.bannerLbl, { color: colors.textSecondary }]}>Completed</Text>
          </View>
        </View>

        {/* App Settings Section */}
        <View
          style={[
            styles.sectionCard,
            { backgroundColor: colors.surfaceCard, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            Appearance & Preferences
          </Text>

          {/* Theme Toggle */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={toggleTheme}
            style={[styles.settingRow, { borderBottomColor: colors.border }]}
          >
            <View>
              <Text style={[styles.settingTitle, { color: colors.text }]}>Dark Obsidian Mode</Text>
              <Text style={[styles.settingSub, { color: colors.textSecondary }]}>
                {isDark ? 'Cyber Dark Glass Theme' : 'Clean Modern Light Theme'}
              </Text>
            </View>

            <View
              style={[
                styles.toggleSwitch,
                { backgroundColor: isDark ? colors.primary : colors.surfaceTertiary },
              ]}
            >
              <View
                style={[
                  styles.toggleThumb,
                  { transform: [{ translateX: isDark ? 16 : 0 }] },
                ]}
              />
            </View>
          </TouchableOpacity>

          {/* Backend Connection */}
          <View style={styles.settingRow}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.settingTitle, { color: colors.text }]}>API Connection</Text>
              <Text style={[styles.settingSub, { color: colors.textSecondary }]}>
                {BASE_API_URL}
              </Text>
            </View>
            <View
              style={[
                styles.onlineBadge,
                { backgroundColor: `${colors.success}20`, borderColor: colors.success },
              ]}
            >
              <Text style={[styles.onlineText, { color: colors.success }]}>Online</Text>
            </View>
          </View>
        </View>

        {/* Assignment Spec Info */}
        <View
          style={[
            styles.specCard,
            {
              backgroundColor: `${colors.primary}10`,
              borderColor: `${colors.primary}30`,
            },
          ]}
        >
          <View style={styles.specHeader}>
            <SparklesIcon size={18} color={colors.primaryLight} />
            <Text style={[styles.specTitle, { color: colors.primaryLight }]}>
              Modulus Seventeen Assignment
            </Text>
          </View>
          <Text style={[styles.specBody, { color: colors.textSecondary }]}>
            • Stack: React Native CLI + TypeScript
            {'\n'}• Backend: Node.js + Express + MongoDB + JWT
            {'\n'}• Smart Urgency & Priority Mix Algorithm
            {'\n'}• Category Tags, Checklist Subtasks, Analytics
          </Text>
        </View>

        {/* Logout Button */}
        <Button
          title="Sign Out"
          onPress={handleLogout}
          variant="danger"
          size="large"
          leftIcon={<LogoutIcon size={18} color="#FFFFFF" />}
          style={styles.logoutBtn}
        />
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
  profileCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '800',
  },
  userName: {
    fontSize: 20,
    fontWeight: '800',
  },
  userEmail: {
    fontSize: 13,
    marginTop: 2,
  },
  memberSince: {
    fontSize: 11,
    marginTop: 6,
  },
  statsBanner: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  bannerItem: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    alignItems: 'center',
  },
  bannerVal: {
    fontSize: 22,
    fontWeight: '800',
  },
  bannerLbl: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  sectionCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 18,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  settingSub: {
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
  onlineBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
  },
  onlineText: {
    fontSize: 11,
    fontWeight: '700',
  },
  specCard: {
    borderRadius: 18,
    borderWidth: 1.5,
    padding: 16,
    marginBottom: 20,
  },
  specHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  specTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  specBody: {
    fontSize: 12,
    lineHeight: 18,
  },
  logoutBtn: {
    marginBottom: 20,
  },
});

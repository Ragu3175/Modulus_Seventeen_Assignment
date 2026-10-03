import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../types/navigation.types';
import { useAuthStore } from '../../store/useAuthStore';
import { useThemeStore } from '../../store/useThemeStore';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { SparklesIcon, ArrowLeftIcon } from '../../components/common/Icons';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const { theme } = useThemeStore();
  const colors = theme.colors;
  const { register, isLoading, error, clearError } = useAuthStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formErrors, setFormErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const validate = () => {
    const errs: {
      name?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    if (!name.trim()) errs.name = 'Full name is required';
    if (!email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errs.email = 'Please enter a valid email';
    }
    if (!password) {
      errs.password = 'Password is required';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }
    if (password !== confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }

    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    await register({
      name: name.trim(),
      email: email.trim(),
      password,
    });
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <ArrowLeftIcon size={20} color={colors.text} />
          <Text style={[styles.backText, { color: colors.text }]}>Back to Login</Text>
        </TouchableOpacity>

        <View style={styles.brandHeader}>
          <View
            style={[
              styles.logoCircle,
              {
                backgroundColor: `${colors.primary}20`,
                borderColor: `${colors.primary}50`,
                shadowColor: colors.primary,
              },
            ]}
          >
            <SparklesIcon size={28} color={colors.primaryLight} />
          </View>
          <Text style={[styles.appName, { color: colors.text }]}>Create Account</Text>
          <Text style={[styles.tagline, { color: colors.textSecondary }]}>
            Join Modulus Task to organize and conquer your tasks
          </Text>
        </View>

        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.surfaceCard,
              borderColor: colors.border,
            },
          ]}
        >
          {error && (
            <View
              style={[
                styles.errorBox,
                { backgroundColor: colors.urgentBg, borderColor: colors.urgentBorder },
              ]}
            >
              <Text style={[styles.errorMsg, { color: colors.urgent }]}>{error}</Text>
            </View>
          )}

          <Input
            label="Full Name"
            placeholder="John Doe"
            value={name}
            onChangeText={(t) => {
              setName(t);
              clearError();
            }}
            error={formErrors.name}
          />

          <Input
            label="Email Address"
            placeholder="john@example.com"
            value={email}
            onChangeText={(t) => {
              setEmail(t);
              clearError();
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            error={formErrors.email}
          />

          <Input
            label="Password"
            placeholder="Min. 6 characters"
            value={password}
            onChangeText={(t) => {
              setPassword(t);
              clearError();
            }}
            isPassword
            error={formErrors.password}
          />

          <Input
            label="Confirm Password"
            placeholder="Re-enter password"
            value={confirmPassword}
            onChangeText={(t) => {
              setConfirmPassword(t);
              clearError();
            }}
            isPassword
            error={formErrors.confirmPassword}
          />

          <Button
            title="Create Account"
            onPress={handleRegister}
            variant="primary"
            size="large"
            isLoading={isLoading}
            style={styles.regBtn}
          />

          <View style={styles.switchRow}>
            <Text style={[styles.switchText, { color: colors.textSecondary }]}>
              Already registered?{' '}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={[styles.switchLink, { color: colors.primaryLight }]}>
                Sign in here
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  backText: {
    fontSize: 14,
    fontWeight: '600',
  },
  brandHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  appName: {
    fontSize: 22,
    fontWeight: '800',
  },
  tagline: {
    fontSize: 13,
    marginTop: 4,
    textAlign: 'center',
  },
  card: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 20,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 6,
  },
  errorBox: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 10,
    marginBottom: 16,
  },
  errorMsg: {
    fontSize: 12,
    fontWeight: '600',
  },
  regBtn: {
    marginTop: 10,
    marginBottom: 16,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchText: {
    fontSize: 13,
  },
  switchLink: {
    fontSize: 13,
    fontWeight: '700',
  },
});

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
import { SparklesIcon } from '../../components/common/Icons';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const { theme } = useThemeStore();
  const colors = theme.colors;
  const { login, isLoading, error, clearError, setDemoUser } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formErrors, setFormErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const errs: { email?: string; password?: string } = {};
    if (!email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errs.email = 'Please enter a valid email';
    }
    if (!password) {
      errs.password = 'Password is required';
    }
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    await login({ email: email.trim(), password });
  };

  const handleQuickDemo = async () => {
    // Fill demo credentials and log in instantly
    setEmail('alex@example.com');
    setPassword('password123');
    const success = await login({ email: 'alex@example.com', password: 'password123' });
    if (!success) {
      // If server is not running locally, use mock demo session
      await setDemoUser();
    }
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
        {/* Brand Header */}
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
            <SparklesIcon size={32} color={colors.primaryLight} />
          </View>
          <Text style={[styles.appName, { color: colors.text }]}>Modulus Task</Text>
          <Text style={[styles.tagline, { color: colors.textSecondary }]}>
            Smart Urgency • Dynamic Priority • Task Matrix
          </Text>
        </View>

        {/* Login Glass Card */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.surfaceCard,
              borderColor: colors.border,
            },
          ]}
        >
          <Text style={[styles.cardTitle, { color: colors.text }]}>Welcome Back</Text>
          <Text style={[styles.cardSub, { color: colors.textSecondary }]}>
            Sign in with your email and password to access your tasks
          </Text>

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
            label="Email Address"
            placeholder="alex@example.com"
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
            placeholder="••••••••"
            value={password}
            onChangeText={(t) => {
              setPassword(t);
              clearError();
            }}
            isPassword
            error={formErrors.password}
          />

          <Button
            title="Sign In"
            onPress={handleLogin}
            variant="primary"
            size="large"
            isLoading={isLoading}
            style={styles.loginBtn}
          />

          {/* Quick Demo Access Button */}
          <Button
            title="⚡ 1-Tap Demo Account Login"
            onPress={handleQuickDemo}
            variant="secondary"
            size="medium"
            style={styles.demoBtn}
          />

          {/* Switch to Register */}
          <View style={styles.switchRow}>
            <Text style={[styles.switchText, { color: colors.textSecondary }]}>
              Don't have an account?{' '}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={[styles.switchLink, { color: colors.primaryLight }]}>
                Register here
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
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 32,
  },
  brandHeader: {
    alignItems: 'center',
    marginBottom: 28,
  },
  logoCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  appName: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 4,
    textAlign: 'center',
  },
  card: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 24,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 6,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  cardSub: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 20,
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
  loginBtn: {
    marginTop: 8,
    marginBottom: 12,
  },
  demoBtn: {
    marginBottom: 20,
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

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '@/constants/theme';
import { Button } from '@/components/Button';
import { useAuth } from '@/contexts/FirebaseAuthContext';

export default function LoginScreen() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter both email and password');
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    setLoading(true);
    setError('');

    const { error: authError } = await signIn(email, password);

    if (authError) {
      setError(getErrorMessage(authError.message));
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setLoading(false);
    } else {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      // Navigation will be handled by AuthContext
    }
  };

  const getErrorMessage = (errorMsg: string): string => {
    if (errorMsg.includes('invalid-credential') || errorMsg.includes('user-not-found') || errorMsg.includes('wrong-password')) {
      return 'Email or password is incorrect';
    }
    if (errorMsg.includes('too-many-requests')) {
      return 'Too many attempts. Please try again later';
    }
    if (errorMsg.includes('network')) {
      return 'Network error. Please check your connection';
    }
    if (errorMsg.includes('invalid-email')) {
      return 'Please enter a valid email address';
    }
    return 'Something went wrong. Please try again';
  };

  const handleForgotPassword = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/forgot-password');
  };

  const handleBack = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <Text style={styles.backIcon}>←</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue your FocusFit journey</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Email Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="your.email@example.com"
                placeholderTextColor={Colors.textSecondary}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
              />
            </View>

            {/* Password Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor={Colors.textSecondary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
              />
            </View>

            {/* Error Message */}
            {error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorIcon}>⚠️</Text>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            {/* Login Button */}
            <Button
              title={loading ? 'Signing In...' : 'Sign In'}
              onPress={handleLogin}
              variant="primary"
              size="large"
              loading={loading}
              disabled={loading}
              style={styles.loginButton}
            />

            {/* Forgot Password Link */}
            <TouchableOpacity
              onPress={handleForgotPassword}
              disabled={loading}
              style={styles.forgotPasswordContainer}
            >
              <Text style={styles.forgotPasswordText}>Forgot your password?</Text>
            </TouchableOpacity>

            {/* Sign Up Link */}
            <View style={styles.signUpContainer}>
              <Text style={styles.signUpText}>Don&apos;t have an account? </Text>
              <TouchableOpacity
                onPress={() => router.replace('/sign-up')}
                disabled={loading}
              >
                <Text style={styles.signUpLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: Spacing.lg,
  },
  header: {
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xxl,
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
    ...Shadows.small,
  },
  backIcon: {
    fontSize: 24,
    color: Colors.primary,
  },
  title: {
    ...Typography.hero,
    color: Colors.primary,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    ...Typography.bodyLarge,
    color: Colors.textSecondary,
  },
  form: {
    gap: Spacing.lg,
  },
  inputGroup: {
    gap: Spacing.sm,
  },
  label: {
    ...Typography.body,
    color: Colors.primary,
    fontWeight: '600',
  },
  input: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    ...Typography.bodyLarge,
    color: Colors.text,
    borderWidth: 2,
    borderColor: Colors.gray200,
    minHeight: 64,
    ...Shadows.small,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.accent + '15',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderLeftWidth: 4,
    borderLeftColor: Colors.accent,
  },
  errorIcon: {
    fontSize: 20,
  },
  errorText: {
    ...Typography.body,
    color: Colors.accent,
    flex: 1,
  },
  loginButton: {
    marginTop: Spacing.md,
  },
  forgotPasswordContainer: {
    alignItems: 'center',
    padding: Spacing.sm,
  },
  forgotPasswordText: {
    ...Typography.body,
    color: Colors.textSecondary,
    textDecorationLine: 'underline',
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  signUpText: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  signUpLink: {
    ...Typography.body,
    color: Colors.accent,
    fontWeight: '600',
  },
});

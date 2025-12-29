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
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '@/constants/theme';
import { Button } from '@/components/Button';
import { SocialButton } from '@/components/SocialButton';
import { useAuth } from '@/contexts/FirebaseAuthContext';

export default function LoginScreen() {
  const router = useRouter();
  const { signIn, signInWithGoogle, signInWithApple } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [appleLoading, setAppleLoading] = useState(false);
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
      setLoading(false);
      // Navigate to main app
      router.replace('/(tabs)');
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

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const { error: authError, isNewUser } = await signInWithGoogle();

    if (authError) {
      console.error('Google Sign-In error:', authError);
      Alert.alert('Sign-In Error', 'Could not sign in with Google. Please try again.');
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setGoogleLoading(false);
    } else {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setGoogleLoading(false);
      if (isNewUser) {
        router.replace('/dietary-needs');
      } else {
        router.replace('/(tabs)');
      }
    }
  };

  const handleAppleSignIn = async () => {
    setAppleLoading(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const { error: authError, isNewUser } = await signInWithApple();

    if (authError) {
      console.error('Apple Sign-In error:', authError);
      Alert.alert('Sign-In Error', 'Could not sign in with Apple. Please try again.');
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setAppleLoading(false);
    } else {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setAppleLoading(false);
      if (isNewUser) {
        router.replace('/dietary-needs');
      } else {
        router.replace('/(tabs)');
      }
    }
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

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social Login Buttons */}
            <SocialButton
              provider="google"
              onPress={handleGoogleSignIn}
              loading={googleLoading}
              disabled={loading || googleLoading || appleLoading}
            />
            <SocialButton
              provider="apple"
              onPress={handleAppleSignIn}
              loading={appleLoading}
              disabled={loading || googleLoading || appleLoading}
            />
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
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xxl,
  },
  header: {
    marginBottom: Spacing.xxl + Spacing.md,
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
    fontSize: 40,
    color: Colors.primary,
    marginBottom: Spacing.md,
    letterSpacing: -0.5,
    fontWeight: '700',
  },
  subtitle: {
    ...Typography.bodyLarge,
    fontSize: 18,
    color: Colors.textSecondary,
    lineHeight: 28,
    fontWeight: '500',
  },
  form: {
    gap: Spacing.xl,
  },
  inputGroup: {
    gap: Spacing.md,
  },
  label: {
    ...Typography.body,
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  input: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md + 4,
    ...Typography.bodyLarge,
    fontSize: 17,
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
    marginTop: Spacing.sm,
  },
  forgotPasswordContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  forgotPasswordText: {
    ...Typography.body,
    fontSize: 16,
    color: Colors.textSecondary,
    textDecorationLine: 'underline',
    fontWeight: '500',
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  signUpText: {
    ...Typography.body,
    fontSize: 16,
    color: Colors.textSecondary,
  },
  signUpLink: {
    ...Typography.body,
    fontSize: 16,
    color: Colors.accent,
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.xl,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.gray300,
    opacity: 0.4,
  },
  dividerText: {
    ...Typography.body,
    fontSize: 15,
    color: Colors.textSecondary,
    paddingHorizontal: Spacing.lg,
    fontWeight: '500',
    opacity: 0.8,
  },
});

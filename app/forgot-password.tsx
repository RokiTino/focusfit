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
import { useAuth } from '@/contexts/FirebaseAuthContext';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { sendPasswordReset } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const handleSendReset = async () => {
    if (!email) {
      setError('Please enter your email address');
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    setLoading(true);
    setError('');

    const { error: resetError } = await sendPasswordReset(email);

    if (resetError) {
      setError(getErrorMessage(resetError.message));
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setLoading(false);
    } else {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setEmailSent(true);
      setLoading(false);

      Alert.alert(
        'Email Sent!',
        'Check your inbox for instructions to reset your password.',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    }
  };

  const getErrorMessage = (errorMsg: string): string => {
    if (errorMsg.includes('user-not-found')) {
      return 'No account found with this email address';
    }
    if (errorMsg.includes('invalid-email')) {
      return 'Please enter a valid email address';
    }
    if (errorMsg.includes('network')) {
      return 'Network error. Please check your connection';
    }
    return 'Something went wrong. Please try again';
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
            <Text style={styles.title}>Forgot Password?</Text>
            <Text style={styles.subtitle}>
              No worries! Enter your email and we&apos;ll send you a reset link.
            </Text>
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
                editable={!loading && !emailSent}
              />
            </View>

            {/* Error Message */}
            {error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorIcon}>⚠️</Text>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            {/* Success Message */}
            {emailSent ? (
              <View style={styles.successContainer}>
                <Text style={styles.successIcon}>✅</Text>
                <Text style={styles.successText}>
                  Password reset email sent! Check your inbox.
                </Text>
              </View>
            ) : null}

            {/* Send Reset Button */}
            <Button
              title={loading ? 'Sending...' : 'Send Reset Link'}
              onPress={handleSendReset}
              variant="primary"
              size="large"
              loading={loading}
              disabled={loading || emailSent}
              style={styles.resetButton}
            />

            {/* Back to Login Link */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Remember your password? </Text>
              <TouchableOpacity
                onPress={() => router.back()}
                disabled={loading}
              >
                <Text style={styles.loginLink}>Sign In</Text>
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
    lineHeight: 28,
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
  successContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.secondary + '40',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderLeftWidth: 4,
    borderLeftColor: Colors.secondary,
  },
  successIcon: {
    fontSize: 20,
  },
  successText: {
    ...Typography.body,
    color: Colors.primary,
    flex: 1,
  },
  resetButton: {
    marginTop: Spacing.md,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  loginText: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  loginLink: {
    ...Typography.body,
    color: Colors.accent,
    fontWeight: '600',
  },
});

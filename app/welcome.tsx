import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '@/constants/theme';
import { Button } from '@/components/Button';
import { SocialButton } from '@/components/SocialButton';
import { useAuth } from '@/contexts/FirebaseAuthContext';

export default function WelcomeScreen() {
  const router = useRouter();
  const { signInAsGuest, signInWithGoogle, signInWithApple } = useAuth();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [appleLoading, setAppleLoading] = useState(false);

  const handleGetStarted = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/sign-up');
  };

  const handleSignIn = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/login');
  };

  const handleContinueAsGuest = async () => {
    setLoading(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const { error } = await signInAsGuest();

    if (error) {
      console.error('Error signing in as guest:', error);
      Alert.alert(
        'Sign-In Error',
        'Unable to continue as guest. Please try again or create an account.',
        [{ text: 'OK' }]
      );
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setLoading(false);
    } else {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      // Navigate to dietary needs for setup
      setLoading(false);
      router.replace('/dietary-needs');
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const { error, isNewUser } = await signInWithGoogle();

    if (error) {
      console.error('Google Sign-In error:', error);
      Alert.alert(
        'Sign-In Error',
        error.message || 'Could not sign in with Google. Please try again.',
        [{ text: 'OK' }]
      );
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setGoogleLoading(false);
    } else {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setGoogleLoading(false);
      // Navigate based on user status
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

    const { error, isNewUser } = await signInWithApple();

    if (error) {
      console.error('Apple Sign-In error:', error);
      Alert.alert(
        'Sign-In Error',
        error.message || 'Could not sign in with Apple. Please try again.',
        [{ text: 'OK' }]
      );
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setAppleLoading(false);
    } else {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setAppleLoading(false);
      // Navigate based on user status
      if (isNewUser) {
        router.replace('/dietary-needs');
      } else {
        router.replace('/(tabs)');
      }
    }
  };

  const isAnyLoading = loading || googleLoading || appleLoading;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Branding */}
        <View style={styles.hero}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoEmoji}>🎯</Text>
          </View>
          <Text style={styles.appName}>FocusFit</Text>
          <Text style={styles.tagline}>Fitness for the ADHD Brain</Text>
        </View>

        {/* Button Stack */}
        <View style={styles.buttonStack}>
          {/* Primary CTA */}
          <Button
            title="Get Started"
            onPress={handleGetStarted}
            variant="accent"
            size="large"
            disabled={isAnyLoading}
          />

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social Login Buttons */}
          <SocialButton
            provider="google"
            onPress={handleGoogleSignIn}
            loading={googleLoading}
            disabled={isAnyLoading}
          />

          <SocialButton
            provider="apple"
            onPress={handleAppleSignIn}
            loading={appleLoading}
            disabled={isAnyLoading}
          />

          {/* Guest Option */}
          <Button
            title="Continue as Guest"
            onPress={handleContinueAsGuest}
            variant="secondary"
            size="large"
            disabled={isAnyLoading}
            icon={loading ? <ActivityIndicator size="small" color={Colors.primary} /> : undefined}
            style={styles.guestButton}
          />
        </View>

        {/* Spacer */}
        <View style={styles.spacer} />
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={handleSignIn}
          disabled={isAnyLoading}
          activeOpacity={0.7}
        >
          <Text style={styles.footerText}>
            Already have an account? <Text style={styles.footerLink}>Log In</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: Spacing.xxl * 2,
  },
  hero: {
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.xxl * 2,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.secondaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
    ...Shadows.large,
  },
  logoEmoji: {
    fontSize: 64,
  },
  appName: {
    ...Typography.hero,
    fontSize: 48,
    color: Colors.textInverse,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  tagline: {
    ...Typography.bodyLarge,
    fontSize: 18,
    color: Colors.secondary,
    textAlign: 'center',
    lineHeight: 26,
  },
  buttonStack: {
    paddingHorizontal: Spacing.xl,
    gap: Spacing.md,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.gray300,
    opacity: 0.3,
  },
  dividerText: {
    ...Typography.body,
    color: Colors.secondary,
    paddingHorizontal: Spacing.md,
    fontSize: 14,
    opacity: 0.7,
  },
  guestButton: {
    marginTop: Spacing.md,
  },
  spacer: {
    height: Spacing.xxl * 2,
  },
  footer: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xl,
    borderTopWidth: 1,
    borderTopColor: Colors.gray300,
    backgroundColor: Colors.primary,
  },
  footerText: {
    ...Typography.body,
    color: Colors.secondary,
    textAlign: 'center',
    fontSize: 16,
  },
  footerLink: {
    color: Colors.secondary,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '@/constants/theme';
import { Button } from '@/components/Button';
import { useAuth } from '@/contexts/FirebaseAuthContext';

export default function WelcomeScreen() {
  const router = useRouter();
  const { signInAsGuest } = useAuth();
  const [loading, setLoading] = useState(false);

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
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setLoading(false);
    } else {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      // Navigation will be handled automatically by auth state change
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={styles.hero}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoEmoji}>🎯</Text>
          </View>
          <Text style={styles.appName}>FocusFit</Text>
          <Text style={styles.tagline}>
            Fitness & Meal Prep{'\n'}Designed for ADHD Minds
          </Text>
        </View>

        {/* Features */}
        <View style={styles.features}>
          <View style={styles.featureItem}>
            <View style={styles.featureIconContainer}>
              <Text style={styles.featureIcon}>🧠</Text>
            </View>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Low Cognitive Load</Text>
              <Text style={styles.featureDescription}>
                Simple tasks, clear focus, zero overwhelm
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <View style={styles.featureIconContainer}>
              <Text style={styles.featureIcon}>🤖</Text>
            </View>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>AI Body Double</Text>
              <Text style={styles.featureDescription}>
                Your supportive companion through every task
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <View style={styles.featureIconContainer}>
              <Text style={styles.featureIcon}>🍽️</Text>
            </View>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Smart Meal Plans</Text>
              <Text style={styles.featureDescription}>
                Dietary-safe recipes in 5-10 minutes
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <View style={styles.featureIconContainer}>
              <Text style={styles.featureIcon}>🎉</Text>
            </View>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Dopamine Rewards</Text>
              <Text style={styles.featureDescription}>
                Celebrate every win, big or small
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Footer Buttons */}
      <View style={styles.footer}>
        <Button
          title="Get Started"
          onPress={handleGetStarted}
          variant="accent"
          size="large"
          disabled={loading}
        />
        <Button
          title="Continue as Guest"
          onPress={handleContinueAsGuest}
          variant="secondary"
          size="large"
          disabled={loading}
          icon={loading ? <ActivityIndicator size="small" color={Colors.primary} /> : undefined}
        />
        <Button
          title="I Already Have an Account"
          onPress={handleSignIn}
          variant="ghost"
          size="medium"
          style={styles.signInButton}
          disabled={loading}
        />
      </View>
    </SafeAreaView>
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
  },
  hero: {
    alignItems: 'center',
    paddingTop: Spacing.xxl * 2,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.secondary,
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
    color: Colors.secondary,
    textAlign: 'center',
    lineHeight: 28,
  },
  features: {
    backgroundColor: Colors.secondaryLight,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    padding: Spacing.xl,
    gap: Spacing.lg,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
  },
  featureIconContainer: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.small,
  },
  featureIcon: {
    fontSize: 32,
  },
  featureText: {
    flex: 1,
    paddingTop: Spacing.xs,
  },
  featureTitle: {
    ...Typography.h3,
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  featureDescription: {
    ...Typography.body,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  footer: {
    backgroundColor: Colors.secondaryLight,
    padding: Spacing.lg,
    paddingBottom: Spacing.xl,
    gap: Spacing.md,
  },
  signInButton: {
    backgroundColor: 'transparent',
  },
});

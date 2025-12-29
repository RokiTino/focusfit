import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  ActivityIndicator,
  Alert,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '@/constants/theme';
import { Button } from '@/components/Button';
import { SocialButton } from '@/components/SocialButton';
import { useAuth } from '@/contexts/FirebaseAuthContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.75;

const FEATURES = [
  {
    icon: '🤖',
    title: 'AI Focus Plans',
    description: 'Personalized workout and meal plans that adapt to your ADHD needs',
    gradient: ['#4CAF50', '#45a049'],
  },
  {
    icon: '🎉',
    title: 'Dopamine Hits',
    description: 'Instant rewards and celebrations for every completed task',
    gradient: ['#FF6B6B', '#ee5a5a'],
  },
  {
    icon: '🧘',
    title: 'Body Doubling',
    description: 'AI companion that keeps you accountable through every workout',
    gradient: ['#9C27B0', '#8e24aa'],
  },
];

export default function WelcomeScreen() {
  const router = useRouter();
  const { signInAsGuest, signInWithGoogle, signInWithApple } = useAuth();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [appleLoading, setAppleLoading] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const carouselRef = useRef<ScrollView>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / CARD_WIDTH);
    setActiveSlide(index);
  };

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

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const { error, isNewUser } = await signInWithGoogle();

    if (error) {
      console.error('Google Sign-In error:', error);
      Alert.alert('Sign-In Error', 'Could not sign in with Google. Please try again.');
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setGoogleLoading(false);
    } else {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      // If new user, navigate to onboarding; otherwise navigation handled by auth state
      if (isNewUser) {
        router.replace('/onboarding');
      }
    }
  };

  const handleAppleSignIn = async () => {
    setAppleLoading(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const { error, isNewUser } = await signInWithApple();

    if (error) {
      console.error('Apple Sign-In error:', error);
      Alert.alert('Sign-In Error', 'Could not sign in with Apple. Please try again.');
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setAppleLoading(false);
    } else {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      // If new user, navigate to onboarding; otherwise navigation handled by auth state
      if (isNewUser) {
        router.replace('/onboarding');
      }
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

        {/* Feature Carousel */}
        <View style={styles.carouselSection}>
          <Text style={styles.carouselTitle}>What Makes Us Different</Text>
          <ScrollView
            ref={carouselRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            snapToInterval={CARD_WIDTH}
            decelerationRate="fast"
            contentContainerStyle={styles.carouselContent}
          >
            {FEATURES.map((feature, index) => (
              <View key={index} style={styles.carouselCard}>
                <View style={styles.cardContent}>
                  <View style={styles.cardIconContainer}>
                    <Text style={styles.cardIcon}>{feature.icon}</Text>
                  </View>
                  <Text style={styles.cardTitle}>{feature.title}</Text>
                  <Text style={styles.cardDescription}>{feature.description}</Text>
                </View>
              </View>
            ))}
          </ScrollView>

          {/* Pagination Dots */}
          <View style={styles.pagination}>
            {FEATURES.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  activeSlide === index && styles.paginationDotActive,
                ]}
              />
            ))}
          </View>
        </View>

        {/* Spacer for better visual hierarchy */}
        <View style={styles.spacer} />
      </ScrollView>

      {/* Footer Buttons */}
      <View style={styles.footer}>
        <Button
          title="Get Started"
          onPress={handleGetStarted}
          variant="accent"
          size="large"
          disabled={loading || googleLoading || appleLoading}
        />
        <Button
          title="Continue as Guest"
          onPress={handleContinueAsGuest}
          variant="secondary"
          size="large"
          disabled={loading || googleLoading || appleLoading}
          icon={loading ? <ActivityIndicator size="small" color={Colors.primary} /> : undefined}
        />

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

        <Button
          title="I Already Have an Account"
          onPress={handleSignIn}
          variant="ghost"
          size="medium"
          style={styles.signInButton}
          disabled={loading || googleLoading || appleLoading}
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
    paddingBottom: Spacing.xl,
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
  carouselSection: {
    backgroundColor: 'transparent',
    paddingVertical: Spacing.xxl,
  },
  carouselTitle: {
    ...Typography.h2,
    color: Colors.textInverse,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.lg,
  },
  carouselContent: {
    paddingHorizontal: (SCREEN_WIDTH - CARD_WIDTH) / 2,
  },
  carouselCard: {
    width: CARD_WIDTH,
    marginHorizontal: Spacing.xs,
  },
  cardContent: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    minHeight: 280,
    ...Shadows.large,
  },
  cardIconContainer: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.secondaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  cardIcon: {
    fontSize: 48,
  },
  cardTitle: {
    ...Typography.h2,
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  cardDescription: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.lg,
    gap: Spacing.xs,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.gray300,
  },
  paginationDotActive: {
    width: 24,
    backgroundColor: Colors.secondary,
  },
  spacer: {
    height: Spacing.xxl * 2,
  },
  footer: {
    backgroundColor: Colors.secondaryLight,
    padding: Spacing.lg,
    paddingBottom: Spacing.xl,
    gap: Spacing.md,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.sm,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.gray300,
  },
  dividerText: {
    ...Typography.body,
    color: Colors.textSecondary,
    paddingHorizontal: Spacing.md,
  },
  signInButton: {
    backgroundColor: 'transparent',
  },
});

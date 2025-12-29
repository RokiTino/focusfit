import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Dimensions,
  ScrollView,
  NativeScrollEvent,
  NativeSyntheticEvent,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, BorderRadius, Typography } from '@/constants/theme';
import { Button } from '@/components/Button';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const ONBOARDING_SLIDES = [
  {
    icon: '🤖',
    title: 'AI-Powered Focus Plans',
    description: 'Personalized workout and meal plans that adapt to your unique ADHD needs. Smart, simple, and effective.',
  },
  {
    icon: '🎉',
    title: 'Dopamine Hits',
    description: 'Celebrate every win with instant rewards and confetti. Transform tasks into victories that feel amazing.',
  },
  {
    icon: '💬',
    title: 'Your AI Body Double',
    description: 'Never work out alone again. Your supportive AI companion keeps you motivated and accountable.',
  },
];

export default function OnboardingFlow() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / SCREEN_WIDTH);
    setCurrentIndex(index);
  };

  const handleNext = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    if (currentIndex < ONBOARDING_SLIDES.length - 1) {
      scrollViewRef.current?.scrollTo({
        x: SCREEN_WIDTH * (currentIndex + 1),
        animated: true,
      });
    } else {
      await completeOnboarding();
    }
  };

  const handleSkip = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await completeOnboarding();
  };

  const completeOnboarding = async () => {
    try {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(async () => {
        await AsyncStorage.setItem('@onboarding_completed', 'true');
        router.replace('/welcome');
      });
    } catch (error) {
      console.error('Error completing onboarding:', error);
      router.replace('/welcome');
    }
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* Skip Button */}
      {currentIndex < ONBOARDING_SLIDES.length - 1 && (
        <TouchableOpacity
          style={styles.skipButton}
          onPress={handleSkip}
          activeOpacity={0.7}
        >
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      )}

      {/* Slides */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        decelerationRate="fast"
        bounces={false}
      >
        {ONBOARDING_SLIDES.map((slide, index) => (
          <View key={index} style={styles.slide}>
            <View style={styles.content}>
              <View style={styles.iconContainer}>
                <Text style={styles.icon}>{slide.icon}</Text>
              </View>
              <Text style={styles.title}>{slide.title}</Text>
              <Text style={styles.description}>{slide.description}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Bottom Controls */}
      <View style={styles.bottomContainer}>
        {/* Pagination Dots */}
        <View style={styles.pagination}>
          {ONBOARDING_SLIDES.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                currentIndex === index && styles.dotActive,
              ]}
            />
          ))}
        </View>

        {/* Next/Get Started Button */}
        <View style={styles.buttonContainer}>
          <Button
            title={currentIndex === ONBOARDING_SLIDES.length - 1 ? 'Get Started' : 'Next'}
            onPress={handleNext}
            variant="accent"
            size="large"
          />
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  skipButton: {
    position: 'absolute',
    top: Spacing.xxl + Spacing.md,
    right: Spacing.xl,
    zIndex: 10,
    padding: Spacing.md,
  },
  skipText: {
    ...Typography.body,
    color: Colors.secondary,
    fontSize: 16,
    fontWeight: '600',
  },
  slide: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xxl,
    paddingBottom: Spacing.xxl * 3,
    maxWidth: 500,
  },
  iconContainer: {
    width: 140,
    height: 140,
    borderRadius: BorderRadius.xl + BorderRadius.md,
    backgroundColor: Colors.secondaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xxl + Spacing.lg,
  },
  icon: {
    fontSize: 80,
  },
  title: {
    ...Typography.hero,
    fontSize: 36,
    color: Colors.textInverse,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    letterSpacing: -0.5,
    fontWeight: '700',
  },
  description: {
    ...Typography.bodyLarge,
    color: Colors.secondary,
    textAlign: 'center',
    lineHeight: 30,
    opacity: 0.95,
    fontSize: 18,
    fontWeight: '500',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xxl + Spacing.xl,
    backgroundColor: 'transparent',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xl + Spacing.md,
    gap: Spacing.sm,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.gray400,
    opacity: 0.4,
  },
  dotActive: {
    width: 32,
    backgroundColor: Colors.secondary,
    opacity: 1,
  },
  buttonContainer: {
    width: '100%',
  },
});

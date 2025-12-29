import React, { useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Typography, Shadows, BorderRadius } from '@/constants/theme';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/');
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoEmoji}>🎯</Text>
        </View>
        <Text style={styles.appName}>FocusFit</Text>
        <Text style={styles.tagline}>Fitness for the ADHD Brain</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  logoContainer: {
    width: 140,
    height: 140,
    borderRadius: BorderRadius.xl + BorderRadius.md,
    backgroundColor: Colors.secondaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xxl,
    ...Shadows.large,
  },
  logoEmoji: {
    fontSize: 80,
  },
  appName: {
    ...Typography.hero,
    fontSize: 52,
    color: Colors.textInverse,
    marginBottom: Spacing.md,
    textAlign: 'center',
    letterSpacing: -1,
    fontWeight: '700',
  },
  tagline: {
    ...Typography.bodyLarge,
    fontSize: 20,
    color: Colors.secondary,
    textAlign: 'center',
    fontWeight: '500',
    opacity: 0.95,
  },
});

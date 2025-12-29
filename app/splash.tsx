import React, { useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Typography } from '@/constants/theme';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    // Display splash for 2 seconds while Firebase initializes
    const timer = setTimeout(() => {
      // Navigation will be handled by index.tsx based on auth state
      router.replace('/');
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      <View style={styles.logoContainer}>
        <Text style={styles.logoEmoji}>🎯</Text>
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
  logoContainer: {
    alignItems: 'center',
  },
  logoEmoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  appName: {
    ...Typography.hero,
    fontSize: 48,
    color: Colors.textInverse,
    marginBottom: 12,
    textAlign: 'center',
  },
  tagline: {
    ...Typography.bodyLarge,
    color: Colors.secondary,
    textAlign: 'center',
  },
});

import { Redirect } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@/contexts/FirebaseAuthContext';
import { Colors } from '@/constants/theme';

export default function Index() {
  const { user, loading: authLoading } = useAuth();
  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const completed = await AsyncStorage.getItem('@onboarding_completed');
      setOnboardingCompleted(completed === 'true');
      setIsReady(true);
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      setOnboardingCompleted(false);
      setIsReady(true);
    }
  };

  // Show loading indicator while checking auth state and onboarding status
  if (authLoading || !isReady) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={Colors.secondary} />
      </View>
    );
  }

  // Not authenticated
  if (!user) {
    // If onboarding not completed, show onboarding flow
    if (!onboardingCompleted) {
      return <Redirect href="/onboarding-flow" />;
    }
    // Otherwise show welcome/auth screen
    return <Redirect href="/welcome" />;
  }

  // Authenticated - redirect to main app
  return <Redirect href="/(tabs)" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

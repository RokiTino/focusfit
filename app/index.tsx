import { Redirect } from 'expo-router';
import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth } from '@/contexts/FirebaseAuthContext';
import { Colors } from '@/constants/theme';

export default function Index() {
  const { user, loading } = useAuth();

  // Show loading indicator while checking auth state
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  // Not authenticated - show welcome screen
  if (!user) {
    return <Redirect href="/welcome" />;
  }

  // Authenticated - redirect to main app
  // In production, you might check if onboarding is complete here
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

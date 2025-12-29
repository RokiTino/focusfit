import { Redirect } from 'expo-router';
import React from 'react';

export default function Index() {
  // In a real app, check if user has completed onboarding
  const hasCompletedOnboarding = false;

  if (hasCompletedOnboarding) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/onboarding" />;
}

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: 'transparent' },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="dietary-needs" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="meal-prep"
          options={{
            presentation: 'modal',
          }}
        />
      </Stack>
    </>
  );
}

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '@/constants/theme';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { CircularTimer } from '@/components/CircularTimer';
import { Confetti } from '@/components/Confetti';

export default function DashboardScreen() {
  const router = useRouter();
  const [timeRemaining, setTimeRemaining] = useState(272); // 4:32 as shown in design
  const [isOverwhelmed, setIsOverwhelmed] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [currentTask] = useState({
    title: '5-min Stretching',
    duration: 300, // 5 minutes in seconds
    type: 'workout' as const,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleCompleteTask = async () => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Show confetti celebration
    setShowConfetti(true);

    // TODO: Mark task as complete and save to storage
    setTimeout(() => {
      setShowConfetti(false);
    }, 5000);
  };

  const handleOverwhelmed = async () => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    setIsOverwhelmed(!isOverwhelmed);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.secondaryDark} />
      <Confetti active={showConfetti} onComplete={() => setShowConfetti(false)} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Dashboard</Text>
          <TouchableOpacity
            style={styles.panicButton}
            onPress={handleOverwhelmed}
            activeOpacity={0.8}
          >
            <Text style={styles.panicIcon}>🧠</Text>
            <Text style={styles.panicText}>I&apos;m Overwhelmed</Text>
          </TouchableOpacity>
        </View>

        {/* Primary Action Card */}
        <Card variant="elevated" style={styles.actionCard}>
          <Text style={styles.actionLabel}>RIGHT NOW:</Text>
          <Text style={styles.actionTitle}>{currentTask.title}</Text>

          <View style={styles.timerContainer}>
            <CircularTimer
              duration={currentTask.duration}
              timeRemaining={timeRemaining}
              size={140}
            />
          </View>

          <Button
            title="Complete Task 🎉"
            onPress={handleCompleteTask}
            variant="secondary"
            style={styles.completeButton}
          />
        </Card>

        {/* Upcoming Tasks */}
        <View style={styles.upcomingSection}>
          <Card
            style={styles.upcomingCard}
            onPress={() => router.push('/meal-prep')}
          >
            <View style={styles.upcomingHeader}>
              <Text style={styles.upcomingLabel}>Next:</Text>
              <Text style={styles.upcomingArrow}>→</Text>
            </View>
            <Text style={styles.upcomingTitle}>Lunch Prep (12:00 PM)</Text>
          </Card>

          <Card
            style={styles.upcomingCard}
            onPress={() => {}}
          >
            <View style={styles.upcomingHeader}>
              <Text style={styles.upcomingLabel}>Later:</Text>
              <Text style={styles.upcomingArrow}>→</Text>
            </View>
            <Text style={styles.upcomingTitle}>Evening Walk</Text>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.secondaryDark,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  headerTitle: {
    ...Typography.h1,
    color: Colors.textInverse,
  },
  panicButton: {
    backgroundColor: Colors.accent,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    ...Shadows.small,
  },
  panicIcon: {
    fontSize: 16,
  },
  panicText: {
    ...Typography.caption,
    color: Colors.textInverse,
    fontWeight: '600',
  },
  actionCard: {
    backgroundColor: Colors.accent,
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  actionLabel: {
    ...Typography.body,
    color: Colors.textInverse,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  actionTitle: {
    ...Typography.h1,
    color: Colors.textInverse,
    marginBottom: Spacing.xl,
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  completeButton: {
    backgroundColor: Colors.surface,
  },
  upcomingSection: {
    gap: Spacing.md,
  },
  upcomingCard: {
    backgroundColor: Colors.gray500,
    opacity: 0.9,
  },
  upcomingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  upcomingLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  upcomingArrow: {
    ...Typography.h3,
    color: Colors.textInverse,
  },
  upcomingTitle: {
    ...Typography.h3,
    color: Colors.textInverse,
  },
});

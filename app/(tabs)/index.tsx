import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '@/constants/theme';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { CircularTimer } from '@/components/CircularTimer';
import { Confetti } from '@/components/Confetti';
import { useAuth } from '@/contexts/FirebaseAuthContext';

export default function DashboardScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [timeRemaining, setTimeRemaining] = useState(272); // 4:32 as shown in design
  const [isOverwhelmed, setIsOverwhelmed] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [simplifying, setSimplifying] = useState(false);
  const [supportMessage, setSupportMessage] = useState('');
  const [currentTask, setCurrentTask] = useState({
    title: '5-min Stretching',
    duration: 300, // 5 minutes in seconds
    type: 'workout' as const,
    description: 'Gentle stretches to start your day',
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
      // Clear overwhelmed state and support message after completion
      if (isOverwhelmed) {
        setIsOverwhelmed(false);
        setSupportMessage('');
      }
    }, 5000);
  };

  const handleOverwhelmed = async () => {
    if (isOverwhelmed) {
      // Turn off overwhelmed mode
      setIsOverwhelmed(false);
      setSupportMessage('');
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      return;
    }

    // Turn on overwhelmed mode with AI simplification
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    setSimplifying(true);

    try {
      // Import AI functions
      const { simplifyTask, generateBodyDoubleResponse } = await import('@/services/ai');

      // Simplify the current task using AI
      const simplified = await simplifyTask(
        currentTask.title,
        currentTask.type,
        currentTask.description
      );

      console.log('[Dashboard] Simplified task:', simplified);

      // Generate supportive message from AI Body Double
      const message = await generateBodyDoubleResponse(
        `I'm feeling overwhelmed by "${currentTask.title}"`,
        'User clicked the overwhelmed button and needs encouragement',
        user?.uid
      );

      // Update task to simplified version
      setCurrentTask({
        ...currentTask,
        title: simplified.title,
        duration: (simplified.duration || 2) * 60, // Convert to seconds
        description: simplified.description,
      });

      // Reset timer to new duration
      setTimeRemaining((simplified.duration || 2) * 60);

      // Set overwhelmed mode and show support message
      setIsOverwhelmed(true);
      setSupportMessage(message);

      // TODO: Save simplified version to Firestore

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('[Dashboard] Error simplifying task:', error);
      Alert.alert(
        'Oops!',
        "I couldn't simplify that task right now, but I'm still here with you. Let's take it one step at a time! 💙"
      );
    } finally {
      setSimplifying(false);
    }
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
            style={[
              styles.panicButton,
              isOverwhelmed && styles.panicButtonActive,
              simplifying && styles.panicButtonDisabled,
            ]}
            onPress={handleOverwhelmed}
            activeOpacity={0.8}
            disabled={simplifying}
          >
            {simplifying ? (
              <ActivityIndicator size="small" color={Colors.textInverse} />
            ) : (
              <>
                <Text style={styles.panicIcon}>🧠</Text>
                <Text style={styles.panicText}>
                  {isOverwhelmed ? "I'm OK Now" : "I'm Overwhelmed"}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Support Message from AI Body Double */}
        {supportMessage && (
          <Card
            variant="elevated"
            style={{
              ...styles.supportCard,
              ...(isOverwhelmed ? styles.supportCardOverwhelmed : {}),
            }}
          >
            <Text style={styles.supportLabel}>💙 AI BODY DOUBLE:</Text>
            <Text style={styles.supportMessage}>{supportMessage}</Text>
          </Card>
        )}

        {/* Primary Action Card */}
        <Card
          variant="elevated"
          style={{
            ...styles.actionCard,
            ...(isOverwhelmed ? styles.actionCardOverwhelmed : {}),
          }}
        >
          <Text style={styles.actionLabel}>
            {isOverwhelmed ? 'TINY STEP:' : 'RIGHT NOW:'}
          </Text>
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

        {/* Upcoming Tasks - Hidden in Overwhelmed Mode */}
        {!isOverwhelmed && (
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
        )}
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
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xxl + Spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  headerTitle: {
    ...Typography.h1,
    fontSize: 40,
    color: Colors.textInverse,
    letterSpacing: -0.5,
    fontWeight: '700',
  },
  panicButton: {
    backgroundColor: Colors.accent,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    minHeight: 56,
    ...Shadows.medium,
  },
  panicButtonActive: {
    backgroundColor: Colors.secondary,
  },
  panicButtonDisabled: {
    opacity: 0.6,
  },
  panicIcon: {
    fontSize: 20,
  },
  panicText: {
    ...Typography.body,
    fontSize: 15,
    color: Colors.textInverse,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  supportCard: {
    backgroundColor: Colors.secondaryLight,
    padding: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  supportCardOverwhelmed: {
    backgroundColor: Colors.secondary,
  },
  supportLabel: {
    ...Typography.body,
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: Spacing.md,
    opacity: 0.9,
  },
  supportMessage: {
    ...Typography.bodyLarge,
    fontSize: 18,
    color: Colors.primary,
    lineHeight: 28,
    fontWeight: '500',
  },
  actionCard: {
    backgroundColor: Colors.accent,
    padding: Spacing.xl + Spacing.md,
    marginBottom: Spacing.xxl,
  },
  actionCardOverwhelmed: {
    backgroundColor: Colors.secondary,
  },
  actionLabel: {
    ...Typography.body,
    fontSize: 14,
    color: Colors.textInverse,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    opacity: 0.9,
    marginBottom: Spacing.sm,
  },
  actionTitle: {
    ...Typography.h1,
    fontSize: 36,
    color: Colors.textInverse,
    marginBottom: Spacing.xxl,
    letterSpacing: -0.5,
    fontWeight: '700',
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  completeButton: {
    backgroundColor: Colors.surface,
  },
  upcomingSection: {
    gap: Spacing.lg,
  },
  upcomingCard: {
    backgroundColor: Colors.gray500,
    opacity: 0.95,
    minHeight: 80,
  },
  upcomingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  upcomingLabel: {
    ...Typography.body,
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '600',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    opacity: 0.8,
  },
  upcomingArrow: {
    ...Typography.h3,
    fontSize: 24,
    color: Colors.textInverse,
    opacity: 0.8,
  },
  upcomingTitle: {
    ...Typography.h3,
    fontSize: 20,
    color: Colors.textInverse,
    fontWeight: '600',
    letterSpacing: -0.3,
  },
});

import React, { useState } from 'react';
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
import { ADHDHurdle } from '@/types';

interface QuizOption {
  id: ADHDHurdle;
  label: string;
  icon: string;
}

const quizOptions: QuizOption[] = [
  { id: 'forgetting_to_eat', label: 'Forgetting to eat', icon: '🍽️' },
  { id: 'starting_is_hard', label: 'Starting a workout', icon: '🏃' },
  { id: 'staying_focused', label: 'Staying focused', icon: '🧠' },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [selectedHurdles, setSelectedHurdles] = useState<ADHDHurdle[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const toggleHurdle = async (hurdle: ADHDHurdle) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    setSelectedHurdles((prev) => {
      if (prev.includes(hurdle)) {
        return prev.filter((h) => h !== hurdle);
      }
      return [...prev, hurdle];
    });
  };

  const handleContinue = async () => {
    if (selectedHurdles.length === 0) {
      return;
    }

    setIsGenerating(true);

    try {
      // Generate personalized plan using Newell AI
      const { generateFocusPlan } = await import('@/services/ai');
      const plan = await generateFocusPlan(selectedHurdles);

      // TODO: Store plan in local storage or Supabase
      console.log('Generated plan:', plan);

      // Navigate to main app
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Error generating plan:', error);
      // Continue to app even if AI fails
      router.replace('/(tabs)');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.secondaryLight} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Let&apos;s Personalize{'\n'}Your Plan</Text>
            <Text style={styles.subtitle}>What&apos;s your biggest daily hurdle?</Text>
          </View>

          {/* Quiz Options */}
          <View style={styles.optionsContainer}>
            {quizOptions.map((option) => {
              const isSelected = selectedHurdles.includes(option.id);
              return (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.optionCard,
                    isSelected && styles.optionCardSelected,
                  ]}
                  onPress={() => toggleHurdle(option.id)}
                  activeOpacity={0.8}
                >
                  <View style={styles.optionContent}>
                    <Text style={styles.optionIcon}>{option.icon}</Text>
                    <Text
                      style={[
                        styles.optionLabel,
                        isSelected && styles.optionLabelSelected,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </View>
                  {isSelected && (
                    <View style={styles.checkmark}>
                      <Text style={styles.checkmarkText}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Progress Indicator */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={styles.progressFill} />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Fixed Bottom Button */}
      <View style={styles.footer}>
        <Button
          title={isGenerating ? 'Generating Your Plan...' : 'Continue'}
          onPress={handleContinue}
          disabled={selectedHurdles.length === 0}
          loading={isGenerating}
          variant="primary"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.secondaryLight,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xxl,
  },
  header: {
    marginBottom: Spacing.xxl,
  },
  title: {
    ...Typography.hero,
    color: Colors.primary,
    marginBottom: Spacing.md,
  },
  subtitle: {
    ...Typography.bodyLarge,
    color: Colors.textSecondary,
  },
  optionsContainer: {
    gap: Spacing.md,
  },
  optionCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 80,
    ...Shadows.small,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionCardSelected: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
    ...Shadows.medium,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  optionIcon: {
    fontSize: 32,
  },
  optionLabel: {
    ...Typography.h3,
    color: Colors.primary,
    flex: 1,
  },
  optionLabelSelected: {
    color: Colors.textInverse,
  },
  checkmark: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: Colors.accent,
    fontSize: 20,
    fontWeight: '700',
  },
  progressContainer: {
    marginTop: Spacing.xxl,
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: Colors.gray200,
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
  },
  progressFill: {
    width: '33%',
    height: '100%',
    backgroundColor: Colors.primary,
  },
  footer: {
    padding: Spacing.lg,
    backgroundColor: Colors.secondaryLight,
    borderTopWidth: 1,
    borderTopColor: Colors.gray200,
  },
});

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
import { DietaryRestriction, DietaryOption } from '@/types';

const dietaryOptions: DietaryOption[] = [
  { id: 'lactose_free', label: 'Lactose-Free', shortLabel: 'LF', icon: '🥛' },
  { id: 'gluten_free', label: 'Gluten-Free', shortLabel: 'GF', icon: '🌾' },
  { id: 'nut_free', label: 'Nut-Free', shortLabel: 'NF', icon: '🥜' },
  { id: 'vegetarian', label: 'Vegetarian', shortLabel: 'VG', icon: '🥗' },
  { id: 'vegan', label: 'Vegan', shortLabel: 'VE', icon: '🌱' },
  { id: 'none', label: 'No restrictions', shortLabel: '', icon: '✓' },
];

export default function DietaryNeedsScreen() {
  const router = useRouter();
  const [selectedRestrictions, setSelectedRestrictions] = useState<DietaryRestriction[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const toggleRestriction = async (restriction: DietaryRestriction) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    setSelectedRestrictions((prev) => {
      // If "No restrictions" is selected, clear all others
      if (restriction === 'none') {
        return prev.includes('none') ? [] : ['none'];
      }

      // If selecting a restriction, remove "No restrictions"
      const filtered = prev.filter((r) => r !== 'none');

      if (filtered.includes(restriction)) {
        return filtered.filter((r) => r !== restriction);
      }
      return [...filtered, restriction];
    });
  };

  const handleContinue = async () => {
    setIsGenerating(true);

    try {
      // Get ADHD hurdles from previous screen (would be stored in context/state in production)
      // For now, use a placeholder
      const adhdHurdles = ['starting_is_hard'];

      // Generate personalized plan using Newell AI with dietary restrictions
      const { generateFocusPlan } = await import('@/services/ai');
      const plan = await generateFocusPlan(
        adhdHurdles as any,
        selectedRestrictions.length > 0 ? selectedRestrictions : undefined
      );

      // TODO: Store plan and dietary restrictions in local storage or Supabase
      console.log('Generated plan with dietary restrictions:', plan);

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

  const canContinue = selectedRestrictions.length > 0 || true; // Can always continue, even with no selection

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
            <Text style={styles.title}>Any dietary needs?</Text>
            <Text style={styles.subtitle}>
              We&apos;ll customize your meal plan to keep you safe and satisfied
            </Text>
          </View>

          {/* Dietary Options */}
          <View style={styles.optionsContainer}>
            {dietaryOptions.map((option) => {
              const isSelected = selectedRestrictions.includes(option.id);
              const isNoneOption = option.id === 'none';
              const hasOtherSelections = selectedRestrictions.length > 0 && !selectedRestrictions.includes('none');

              return (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.optionCard,
                    isSelected && styles.optionCardSelected,
                    isNoneOption && hasOtherSelections && styles.optionCardDisabled,
                  ]}
                  onPress={() => toggleRestriction(option.id)}
                  activeOpacity={0.8}
                  disabled={isNoneOption && hasOtherSelections}
                >
                  <View style={styles.optionContent}>
                    <View style={styles.iconBadge}>
                      <Text style={styles.optionIcon}>{option.icon}</Text>
                    </View>
                    <View style={styles.optionTextContainer}>
                      <Text
                        style={[
                          styles.optionLabel,
                          isSelected && styles.optionLabelSelected,
                        ]}
                      >
                        {option.label}
                      </Text>
                      {option.shortLabel && (
                        <Text style={styles.optionShortLabel}>
                          Badge: {option.shortLabel}
                        </Text>
                      )}
                    </View>
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

          {/* Help Text */}
          <View style={styles.helpContainer}>
            <Text style={styles.helpText}>
              💡 Select all that apply. We&apos;ll ensure every recipe is safe for you.
            </Text>
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
          disabled={!canContinue}
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
    marginBottom: Spacing.lg,
  },
  optionCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 88,
    ...Shadows.small,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionCardSelected: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
    ...Shadows.medium,
  },
  optionCardDisabled: {
    opacity: 0.4,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
  },
  iconBadge: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.secondaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionIcon: {
    fontSize: 32,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionLabel: {
    ...Typography.h3,
    color: Colors.primary,
  },
  optionLabelSelected: {
    color: Colors.textInverse,
  },
  optionShortLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
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
  helpContainer: {
    backgroundColor: Colors.accentSecondary,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.lg,
  },
  helpText: {
    ...Typography.body,
    color: Colors.primary,
    textAlign: 'center',
  },
  progressContainer: {
    marginTop: Spacing.xl,
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
    width: '66%',
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

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '@/constants/theme';
import { Button } from '@/components/Button';
import { DietaryRestriction } from '@/types';

const recipeData = {
  title: 'Quick Chicken &\nVeggie Stir-Fry',
  prepTime: 5,
  dietaryTags: [] as DietaryRestriction[], // Would come from AI-generated meal
  steps: [
    {
      number: 1,
      instruction: 'Chop the bell peppers and broccoli into bite-sized pieces.',
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800',
    },
    {
      number: 2,
      instruction: 'Heat oil in a large pan over medium-high heat.',
      image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800',
    },
    {
      number: 3,
      instruction: 'Add chicken and cook until golden brown (5-7 minutes).',
      image: 'https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?w=800',
    },
  ],
  ingredients: [
    '2 chicken breasts',
    '1 bell pepper',
    '1 head broccoli',
    '2 tbsp soy sauce',
    '2 tbsp olive oil',
  ],
};

const getDietaryBadgeLabel = (restriction: DietaryRestriction): string => {
  const labels: Record<DietaryRestriction, string> = {
    lactose_free: 'LF',
    gluten_free: 'GF',
    nut_free: 'NF',
    vegetarian: 'VG',
    vegan: 'VE',
    none: '',
  };
  return labels[restriction];
};

export default function MealPrepScreen() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [showIngredients, setShowIngredients] = useState(false);

  const handleNextStep = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    if (currentStep < recipeData.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Recipe complete
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.back();
    }
  };

  const handlePreviousStep = async () => {
    if (currentStep > 0) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setCurrentStep(currentStep - 1);
    }
  };

  const step = recipeData.steps[currentStep];
  const progress = ((currentStep + 1) / recipeData.steps.length) * 100;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          {recipeData.dietaryTags && recipeData.dietaryTags.length > 0 && (
            <View style={styles.dietaryBadges}>
              {recipeData.dietaryTags.map((tag) => {
                const label = getDietaryBadgeLabel(tag);
                return label ? (
                  <View key={tag} style={styles.dietaryBadge}>
                    <Text style={styles.dietaryBadgeText}>{label}</Text>
                  </View>
                ) : null;
              })}
            </View>
          )}
        </View>
        <Text style={styles.headerTitle}>{recipeData.title}</Text>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Recipe Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: step.image }}
            style={styles.image}
            resizeMode="cover"
          />
          {/* Progress Indicators */}
          <View style={styles.progressDots}>
            {recipeData.steps.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  index === currentStep && styles.dotActive,
                ]}
              />
            ))}
          </View>
        </View>

        {/* Step Instruction */}
        <View style={styles.instructionContainer}>
          <Text style={styles.stepLabel}>Step {step.number}:</Text>
          <Text style={styles.instruction}>{step.instruction}</Text>

          <View style={styles.prepTimeTag}>
            <Text style={styles.clockIcon}>⏱️</Text>
            <Text style={styles.prepTimeText}>Prep Time: {recipeData.prepTime} mins</Text>
          </View>

          <TouchableOpacity
            style={styles.ingredientsButton}
            onPress={() => setShowIngredients(!showIngredients)}
          >
            <Text style={styles.ingredientsButtonText}>Ingredients</Text>
          </TouchableOpacity>

          {showIngredients && (
            <View style={styles.ingredientsList}>
              {recipeData.ingredients.map((ingredient, index) => (
                <Text key={index} style={styles.ingredientItem}>
                  • {ingredient}
                </Text>
              ))}
            </View>
          )}
        </View>
      </View>

      {/* Footer Navigation */}
      <View style={styles.footer}>
        <Button
          title="Previous Step"
          onPress={handlePreviousStep}
          variant="ghost"
          disabled={currentStep === 0}
          style={styles.previousButton}
        />
        <Button
          title={currentStep === recipeData.steps.length - 1 ? 'Finish' : 'Next Step'}
          onPress={handleNextStep}
          variant="primary"
          style={styles.nextButton}
        />
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${progress}%` }]} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: Spacing.lg,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.small,
  },
  backIcon: {
    fontSize: 24,
    color: Colors.primary,
  },
  dietaryBadges: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  dietaryBadge: {
    backgroundColor: Colors.secondary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    minWidth: 36,
    alignItems: 'center',
    ...Shadows.small,
  },
  dietaryBadgeText: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '700',
    fontSize: 11,
  },
  headerTitle: {
    ...Typography.h2,
    color: Colors.primary,
  },
  content: {
    flex: 1,
  },
  imageContainer: {
    width: '100%',
    height: 300,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  progressDots: {
    position: 'absolute',
    bottom: Spacing.md,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: BorderRadius.round,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  dotActive: {
    backgroundColor: Colors.textInverse,
    width: 24,
  },
  instructionContainer: {
    padding: Spacing.lg,
    flex: 1,
  },
  stepLabel: {
    ...Typography.h2,
    color: Colors.primary,
    marginBottom: Spacing.sm,
  },
  instruction: {
    ...Typography.bodyLarge,
    color: Colors.text,
    lineHeight: 28,
    marginBottom: Spacing.lg,
  },
  prepTimeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.secondaryLight,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    alignSelf: 'flex-start',
    marginBottom: Spacing.md,
  },
  clockIcon: {
    fontSize: 16,
  },
  prepTimeText: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '600',
  },
  ingredientsButton: {
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    alignSelf: 'flex-start',
  },
  ingredientsButtonText: {
    ...Typography.body,
    color: Colors.primary,
    fontWeight: '600',
  },
  ingredientsList: {
    marginTop: Spacing.md,
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  ingredientItem: {
    ...Typography.body,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  footer: {
    flexDirection: 'row',
    padding: Spacing.lg,
    gap: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.gray200,
  },
  previousButton: {
    flex: 1,
  },
  nextButton: {
    flex: 2,
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: Colors.gray200,
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.primary,
  },
});

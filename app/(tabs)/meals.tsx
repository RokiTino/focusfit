import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '@/constants/theme';
import { Card } from '@/components/Card';

const mealsData = [
  {
    id: '1',
    title: 'Quick Chicken & Veggie Stir-Fry',
    prepTime: 5,
    difficulty: 'easy',
    servings: 2,
    emoji: '🍗',
  },
  {
    id: '2',
    title: 'Simple Avocado Toast',
    prepTime: 3,
    difficulty: 'easy',
    servings: 1,
    emoji: '🥑',
  },
  {
    id: '3',
    title: 'Protein Smoothie Bowl',
    prepTime: 5,
    difficulty: 'easy',
    servings: 1,
    emoji: '🥤',
  },
];

export default function MealsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Meal Prep</Text>
          <Text style={styles.subtitle}>Simple recipes designed for minimal cognitive load</Text>
        </View>

        {/* Meals List */}
        <View style={styles.mealsContainer}>
          {mealsData.map((meal) => (
            <Card
              key={meal.id}
              variant="elevated"
              style={styles.mealCard}
              onPress={() => router.push('/meal-prep')}
            >
              <View style={styles.mealHeader}>
                <Text style={styles.mealEmoji}>{meal.emoji}</Text>
                <View style={styles.difficultyBadge}>
                  <Text style={styles.difficultyText}>{meal.difficulty}</Text>
                </View>
              </View>
              <Text style={styles.mealTitle}>{meal.title}</Text>
              <View style={styles.mealMeta}>
                <View style={styles.metaItem}>
                  <Text style={styles.metaIcon}>⏱️</Text>
                  <Text style={styles.metaText}>{meal.prepTime} min</Text>
                </View>
                <View style={styles.metaItem}>
                  <Text style={styles.metaIcon}>🍽️</Text>
                  <Text style={styles.metaText}>{meal.servings} serving{meal.servings > 1 ? 's' : ''}</Text>
                </View>
              </View>
            </Card>
          ))}
        </View>

        {/* Grocery List Button */}
        <TouchableOpacity style={styles.groceryButton}>
          <Text style={styles.groceryIcon}>🛒</Text>
          <Text style={styles.groceryText}>Smart Grocery List</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
    marginBottom: Spacing.xxl,
  },
  title: {
    ...Typography.hero,
    fontSize: 40,
    color: Colors.primary,
    marginBottom: Spacing.md,
    letterSpacing: -0.5,
    fontWeight: '700',
  },
  subtitle: {
    ...Typography.bodyLarge,
    fontSize: 18,
    color: Colors.textSecondary,
    lineHeight: 28,
    fontWeight: '500',
  },
  mealsContainer: {
    gap: Spacing.lg,
    marginBottom: Spacing.xxl,
  },
  mealCard: {
    padding: Spacing.xl,
    minHeight: 140,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  mealEmoji: {
    fontSize: 48,
  },
  difficultyBadge: {
    backgroundColor: Colors.secondary,
    paddingHorizontal: Spacing.md + 4,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
  },
  difficultyText: {
    ...Typography.caption,
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  mealTitle: {
    ...Typography.h3,
    fontSize: 22,
    color: Colors.primary,
    marginBottom: Spacing.lg,
    fontWeight: '600',
    letterSpacing: -0.3,
    lineHeight: 30,
  },
  mealMeta: {
    flexDirection: 'row',
    gap: Spacing.xl,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  metaIcon: {
    fontSize: 18,
  },
  metaText: {
    ...Typography.body,
    fontSize: 16,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  groceryButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.lg,
    gap: Spacing.md,
    minHeight: 64,
    ...Shadows.medium,
  },
  groceryIcon: {
    fontSize: 26,
  },
  groceryText: {
    ...Typography.h3,
    fontSize: 20,
    color: Colors.textInverse,
    fontWeight: '600',
    letterSpacing: -0.3,
  },
});

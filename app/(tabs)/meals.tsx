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
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  header: {
    marginBottom: Spacing.xl,
  },
  title: {
    ...Typography.hero,
    color: Colors.primary,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  mealsContainer: {
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  mealCard: {
    padding: Spacing.lg,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  mealEmoji: {
    fontSize: 40,
  },
  difficultyBadge: {
    backgroundColor: Colors.secondary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.lg,
  },
  difficultyText: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  mealTitle: {
    ...Typography.h3,
    color: Colors.primary,
    marginBottom: Spacing.md,
  },
  mealMeta: {
    flexDirection: 'row',
    gap: Spacing.lg,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  metaIcon: {
    fontSize: 16,
  },
  metaText: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  groceryButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    gap: Spacing.md,
    ...Shadows.medium,
  },
  groceryIcon: {
    fontSize: 24,
  },
  groceryText: {
    ...Typography.h3,
    color: Colors.textInverse,
  },
});

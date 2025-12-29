import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, BorderRadius, Typography } from '@/constants/theme';
import { Card } from '@/components/Card';
import { DietaryRestriction } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

export default function ProfileScreen() {
  const { signOut, user } = useAuth();
  const [hapticEnabled, setHapticEnabled] = React.useState(true);
  const [confettiEnabled, setConfettiEnabled] = React.useState(true);
  const [voiceEnabled, setVoiceEnabled] = React.useState(true);
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const dopamineWins = 47;
  const weekStreak = 3;

  // Mock dietary restrictions (would come from context/state in production)
  const dietaryRestrictions: DietaryRestriction[] = ['vegan', 'gluten_free'];

  const getDietaryLabel = (restriction: DietaryRestriction): string => {
    const labels: Record<DietaryRestriction, string> = {
      lactose_free: 'Lactose-Free',
      gluten_free: 'Gluten-Free',
      nut_free: 'Nut-Free',
      vegetarian: 'Vegetarian',
      vegan: 'Vegan',
      none: 'No restrictions',
    };
    return labels[restriction];
  };

  const getDietaryIcon = (restriction: DietaryRestriction): string => {
    const icons: Record<DietaryRestriction, string> = {
      lactose_free: '🥛',
      gluten_free: '🌾',
      nut_free: '🥜',
      vegetarian: '🥗',
      vegan: '🌱',
      none: '✓',
    };
    return icons[restriction];
  };

  const handleRefreshPlan = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    Alert.alert(
      'Refresh Your Plan?',
      'This will generate a new weekly plan based on your current ADHD hurdles and dietary restrictions. Your progress will be saved.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Refresh',
          style: 'default',
          onPress: async () => {
            setIsRefreshing(true);
            try {
              // Generate new plan using Newell AI
              const { generateFocusPlan } = await import('@/services/ai');
              const adhdHurdles = ['starting_is_hard']; // Would come from stored profile
              const plan = await generateFocusPlan(adhdHurdles as any, dietaryRestrictions);

              console.log('New plan generated:', plan);

              await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              Alert.alert('Success!', 'Your new plan is ready. Check the Dashboard to see your updated tasks.');
            } catch (error) {
              console.error('Error refreshing plan:', error);
              Alert.alert('Oops!', 'We had trouble generating a new plan. Please try again.');
            } finally {
              setIsRefreshing(false);
            }
          },
        },
      ]
    );
  };

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
          <Text style={styles.title}>Profile</Text>
        </View>

        {/* Stats Card */}
        <Card variant="elevated" style={styles.statsCard}>
          <Text style={styles.statsTitle}>Your Progress</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statEmoji}>🎉</Text>
              <Text style={styles.statValue}>{dopamineWins}</Text>
              <Text style={styles.statLabel}>Dopamine Wins</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statEmoji}>🔥</Text>
              <Text style={styles.statValue}>{weekStreak}</Text>
              <Text style={styles.statLabel}>Week Streak</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.galleryButton}>
            <Text style={styles.galleryText}>View Dopamine Gallery →</Text>
          </TouchableOpacity>
        </Card>

        {/* ADHD Profile */}
        <Card variant="elevated" style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Your ADHD Hurdles</Text>
          <View style={styles.hurdlesList}>
            <View style={styles.hurdleItem}>
              <Text style={styles.hurdleIcon}>🏃</Text>
              <Text style={styles.hurdleText}>Starting a workout</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </Card>

        {/* Dietary Restrictions */}
        <Card variant="elevated" style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Dietary Restrictions</Text>
          {dietaryRestrictions.length > 0 && !dietaryRestrictions.includes('none') ? (
            <View style={styles.hurdlesList}>
              {dietaryRestrictions.map((restriction) => (
                <View key={restriction} style={styles.hurdleItem}>
                  <Text style={styles.hurdleIcon}>{getDietaryIcon(restriction)}</Text>
                  <Text style={styles.hurdleText}>{getDietaryLabel(restriction)}</Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.noRestrictionsText}>No dietary restrictions</Text>
          )}
          <TouchableOpacity
            style={[styles.refreshButton, isRefreshing && styles.refreshButtonDisabled]}
            onPress={handleRefreshPlan}
            disabled={isRefreshing}
          >
            <Text style={styles.refreshButtonIcon}>🔄</Text>
            <Text style={styles.refreshButtonText}>
              {isRefreshing ? 'Refreshing Plan...' : 'Refresh My Plan'}
            </Text>
          </TouchableOpacity>
        </Card>

        {/* Settings */}
        <Card variant="elevated" style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Preferences</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>📳</Text>
              <Text style={styles.settingText}>Haptic Feedback</Text>
            </View>
            <Switch
              value={hapticEnabled}
              onValueChange={setHapticEnabled}
              trackColor={{ false: Colors.gray300, true: Colors.secondary }}
              thumbColor={hapticEnabled ? Colors.primary : Colors.gray400}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>🎊</Text>
              <Text style={styles.settingText}>Confetti Effects</Text>
            </View>
            <Switch
              value={confettiEnabled}
              onValueChange={setConfettiEnabled}
              trackColor={{ false: Colors.gray300, true: Colors.secondary }}
              thumbColor={confettiEnabled ? Colors.primary : Colors.gray400}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>🎤</Text>
              <Text style={styles.settingText}>Voice Logging</Text>
            </View>
            <Switch
              value={voiceEnabled}
              onValueChange={setVoiceEnabled}
              trackColor={{ false: Colors.gray300, true: Colors.secondary }}
              thumbColor={voiceEnabled ? Colors.primary : Colors.gray400}
            />
          </View>
        </Card>

        {/* User Info */}
        {user && (
          <View style={styles.userInfoCard}>
            <Text style={styles.userEmail}>{user.email}</Text>
          </View>
        )}

        {/* Sign Out */}
        <TouchableOpacity
          style={styles.signOutButton}
          onPress={async () => {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            Alert.alert(
              'Sign Out',
              'Are you sure you want to sign out?',
              [
                {
                  text: 'Cancel',
                  style: 'cancel',
                },
                {
                  text: 'Sign Out',
                  style: 'destructive',
                  onPress: async () => {
                    await signOut();
                    await Haptics.notificationAsync(
                      Haptics.NotificationFeedbackType.Success
                    );
                  },
                },
              ]
            );
          }}
        >
          <Text style={styles.signOutText}>Sign Out</Text>
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
  },
  statsCard: {
    padding: Spacing.xl,
    marginBottom: Spacing.md,
  },
  statsTitle: {
    ...Typography.h3,
    color: Colors.primary,
    marginBottom: Spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: Spacing.lg,
  },
  statItem: {
    alignItems: 'center',
  },
  statEmoji: {
    fontSize: 40,
    marginBottom: Spacing.sm,
  },
  statValue: {
    ...Typography.hero,
    color: Colors.primary,
  },
  statLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.gray300,
  },
  galleryButton: {
    backgroundColor: Colors.secondaryLight,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  galleryText: {
    ...Typography.body,
    color: Colors.primary,
    fontWeight: '600',
  },
  sectionCard: {
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    ...Typography.h3,
    color: Colors.primary,
    marginBottom: Spacing.md,
  },
  hurdlesList: {
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  hurdleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.md,
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
  },
  hurdleIcon: {
    fontSize: 24,
  },
  hurdleText: {
    ...Typography.body,
    color: Colors.text,
  },
  editButton: {
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    alignItems: 'center',
  },
  editButtonText: {
    ...Typography.body,
    color: Colors.primary,
    fontWeight: '600',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  settingIcon: {
    fontSize: 24,
  },
  settingText: {
    ...Typography.body,
    color: Colors.text,
  },
  signOutButton: {
    marginTop: Spacing.lg,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    borderColor: Colors.error,
    alignItems: 'center',
  },
  signOutText: {
    ...Typography.body,
    color: Colors.error,
    fontWeight: '600',
  },
  noRestrictionsText: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    paddingVertical: Spacing.lg,
  },
  refreshButton: {
    backgroundColor: Colors.accent,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  refreshButtonDisabled: {
    opacity: 0.6,
  },
  refreshButtonIcon: {
    fontSize: 20,
  },
  refreshButtonText: {
    ...Typography.body,
    color: Colors.textInverse,
    fontWeight: '600',
  },
  userInfoCard: {
    marginTop: Spacing.lg,
    padding: Spacing.md,
    backgroundColor: Colors.secondaryLight,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  userEmail: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
});

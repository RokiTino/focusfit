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
import { useAuth } from '@/contexts/FirebaseAuthContext';

export default function ProfileScreen() {
  const { signOut, user, isAnonymous } = useAuth();
  const [hapticEnabled, setHapticEnabled] = React.useState(true);
  const [confettiEnabled, setConfettiEnabled] = React.useState(true);
  const [voiceEnabled, setVoiceEnabled] = React.useState(true);
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const dopamineWins = 47;
  const weekStreak = 3;

  // Mock dietary restrictions (would come from Firestore in production)
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
    if (!user) return;

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
              // Generate new plan using Newell AI with Firebase user ID
              const { generateFocusPlan } = await import('@/services/ai');
              const addhHurdles = ['starting_is_hard']; // Would come from Firestore profile
              const plan = await generateFocusPlan(addhHurdles as any, dietaryRestrictions, user.uid);

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

  const handleLinkAccount = () => {
    // In production, show a modal with email/password inputs to link anonymous account
    Alert.alert(
      'Link Your Account',
      'Want to save your progress permanently? Link your guest account to an email.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Link Account',
          onPress: () => {
            // Navigate to a linking screen or show inline inputs
            // For now, show a simple message
            Alert.alert(
              'Coming Soon',
              'Account linking will allow you to save your progress permanently across devices.'
            );
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
          <Card variant="elevated" style={styles.userInfoCard}>
            <View style={styles.userInfoHeader}>
              <Text style={styles.userInfoLabel}>Account</Text>
              {isAnonymous && (
                <View style={styles.guestBadge}>
                  <Text style={styles.guestBadgeText}>Guest</Text>
                </View>
              )}
            </View>
            <Text style={styles.userEmail}>
              {user.email || 'Guest User'}
            </Text>
            {isAnonymous && (
              <TouchableOpacity
                style={styles.linkAccountButton}
                onPress={handleLinkAccount}
              >
                <Text style={styles.linkAccountText}>
                  🔗 Link to Email Account
                </Text>
              </TouchableOpacity>
            )}
          </Card>
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
    letterSpacing: -0.5,
    fontWeight: '700',
  },
  statsCard: {
    padding: Spacing.xl + Spacing.md,
    marginBottom: Spacing.lg,
  },
  statsTitle: {
    ...Typography.h3,
    fontSize: 22,
    color: Colors.primary,
    marginBottom: Spacing.xl,
    fontWeight: '600',
    letterSpacing: -0.3,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: Spacing.xl,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statEmoji: {
    fontSize: 48,
    marginBottom: Spacing.md,
  },
  statValue: {
    ...Typography.hero,
    fontSize: 44,
    color: Colors.primary,
    fontWeight: '700',
    letterSpacing: -1,
  },
  statLabel: {
    ...Typography.caption,
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.gray300,
    opacity: 0.5,
  },
  galleryButton: {
    backgroundColor: Colors.secondaryLight,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    minHeight: 56,
  },
  galleryText: {
    ...Typography.body,
    fontSize: 17,
    color: Colors.primary,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  sectionCard: {
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.h3,
    fontSize: 22,
    color: Colors.primary,
    marginBottom: Spacing.lg,
    fontWeight: '600',
    letterSpacing: -0.3,
  },
  hurdlesList: {
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  hurdleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md + 4,
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    minHeight: 60,
  },
  hurdleIcon: {
    fontSize: 28,
  },
  hurdleText: {
    ...Typography.body,
    fontSize: 17,
    color: Colors.text,
    fontWeight: '500',
  },
  editButton: {
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    alignItems: 'center',
    minHeight: 56,
  },
  editButtonText: {
    ...Typography.body,
    fontSize: 17,
    color: Colors.primary,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
    minHeight: 64,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
  },
  settingIcon: {
    fontSize: 28,
  },
  settingText: {
    ...Typography.body,
    fontSize: 17,
    color: Colors.text,
    fontWeight: '500',
  },
  signOutButton: {
    marginTop: Spacing.xl,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderColor: Colors.error,
    alignItems: 'center',
    minHeight: 64,
  },
  signOutText: {
    ...Typography.body,
    fontSize: 17,
    color: Colors.error,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  noRestrictionsText: {
    ...Typography.body,
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    paddingVertical: Spacing.xl,
    fontWeight: '500',
  },
  refreshButton: {
    backgroundColor: Colors.accent,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.md,
    minHeight: 64,
  },
  refreshButtonDisabled: {
    opacity: 0.5,
  },
  refreshButtonIcon: {
    fontSize: 24,
  },
  refreshButtonText: {
    ...Typography.body,
    fontSize: 17,
    color: Colors.textInverse,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  userInfoCard: {
    marginTop: Spacing.xl,
    padding: Spacing.xl,
  },
  userInfoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  userInfoLabel: {
    ...Typography.h3,
    fontSize: 20,
    color: Colors.primary,
    fontWeight: '600',
    letterSpacing: -0.3,
  },
  guestBadge: {
    backgroundColor: Colors.accentSecondary,
    paddingHorizontal: Spacing.md + 4,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
  },
  guestBadgeText: {
    ...Typography.caption,
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  userEmail: {
    ...Typography.body,
    fontSize: 17,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
    fontWeight: '500',
  },
  linkAccountButton: {
    backgroundColor: Colors.secondary,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    minHeight: 56,
  },
  linkAccountText: {
    ...Typography.body,
    fontSize: 17,
    color: Colors.primary,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});

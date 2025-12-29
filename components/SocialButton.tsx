import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  ActivityIndicator,
  View,
} from 'react-native';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '@/constants/theme';

type SocialProvider = 'google' | 'apple';

interface SocialButtonProps {
  provider: SocialProvider;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export function SocialButton({
  provider,
  onPress,
  loading = false,
  disabled = false,
  style,
}: SocialButtonProps) {
  const isGoogle = provider === 'google';

  const buttonText = isGoogle ? 'Continue with Google' : 'Sign in with Apple';

  const buttonStyle = [
    styles.button,
    isGoogle ? styles.googleButton : styles.appleButton,
    disabled && styles.disabled,
    style,
  ];

  const textStyle = [
    styles.text,
    isGoogle ? styles.googleText : styles.appleText,
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator
            size="small"
            color={isGoogle ? Colors.text : Colors.textInverse}
            style={styles.icon}
          />
        ) : (
          <View style={styles.iconContainer}>
            {isGoogle ? (
              <Text style={styles.googleIcon}>G</Text>
            ) : (
              <Text style={styles.appleIcon}></Text>
            )}
          </View>
        )}
        <Text style={textStyle}>{buttonText}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
    minHeight: 64,
    borderRadius: BorderRadius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
    ...Shadows.medium,
  },
  googleButton: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.gray300,
  },
  appleButton: {
    backgroundColor: '#000000',
  },
  disabled: {
    opacity: 0.6,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  iconContainer: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 24,
    height: 24,
  },
  googleIcon: {
    fontSize: 20,
    fontWeight: '700',
    color: '#4285F4',
  },
  appleIcon: {
    fontSize: 22,
    color: Colors.textInverse,
  },
  text: {
    ...Typography.bodyLarge,
    fontWeight: '600',
  },
  googleText: {
    color: Colors.text,
  },
  appleText: {
    color: Colors.textInverse,
  },
});

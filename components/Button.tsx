import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  Animated,
  View,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Colors, BorderRadius, Typography, Shadows, Spacing } from '@/constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  hapticFeedback?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'large',
  disabled = false,
  loading = false,
  icon,
  fullWidth = true,
  style,
  textStyle,
  hapticFeedback = true,
}) => {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const handlePress = async () => {
    if (disabled || loading) return;

    if (hapticFeedback) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    onPress();
  };

  const getButtonStyle = (): ViewStyle[] => {
    const baseStyle: ViewStyle = {
      ...styles.base,
      ...styles[`size_${size}`],
      ...styles[`variant_${variant}`],
    };

    if (fullWidth) {
      baseStyle.width = '100%';
    }

    if (disabled) {
      return [baseStyle, styles.disabled];
    }

    return [baseStyle];
  };

  const getTextStyle = (): TextStyle => {
    return {
      ...styles.text,
      ...styles[`text_${variant}`],
      ...styles[`textSize_${size}`],
    };
  };

  const renderContent = () => {
    if (loading) {
      return (
        <ActivityIndicator
          size="small"
          color={
            variant === 'primary' || variant === 'accent'
              ? Colors.textInverse
              : variant === 'outline' || variant === 'ghost'
              ? Colors.primary
              : Colors.primary
          }
        />
      );
    }

    return (
      <View style={styles.content}>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <Text style={[getTextStyle(), textStyle]}>{title}</Text>
      </View>
    );
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={[...getButtonStyle(), style]}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        activeOpacity={0.9}
      >
        {renderContent()}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.lg,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  iconContainer: {
    marginRight: Spacing.xs,
  },
  // Sizes - Minimum 64pt for large (ADHD-friendly)
  size_small: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm + 2,
    minHeight: 44,
  },
  size_medium: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    minHeight: 56,
  },
  size_large: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg - 4,
    minHeight: 64,
  },
  // Variants
  variant_primary: {
    backgroundColor: Colors.primary,
    ...Shadows.small,
  },
  variant_secondary: {
    backgroundColor: Colors.secondary,
    ...Shadows.small,
  },
  variant_accent: {
    backgroundColor: Colors.accent,
    ...Shadows.medium,
  },
  variant_outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: Colors.secondary,
  },
  variant_ghost: {
    backgroundColor: 'transparent',
  },
  // Text styles
  text: {
    ...Typography.button,
    textAlign: 'center',
  },
  text_primary: {
    color: Colors.textInverse,
    fontWeight: '600',
  },
  text_secondary: {
    color: Colors.primary,
    fontWeight: '600',
  },
  text_accent: {
    color: Colors.textInverse,
    fontWeight: '700',
  },
  text_outline: {
    color: Colors.primary,
    fontWeight: '600',
  },
  text_ghost: {
    color: Colors.secondary,
    fontWeight: '500',
  },
  textSize_small: {
    fontSize: 14,
  },
  textSize_medium: {
    fontSize: 16,
  },
  textSize_large: {
    fontSize: 18,
  },
  disabled: {
    backgroundColor: Colors.gray300,
    opacity: 0.5,
  },
});

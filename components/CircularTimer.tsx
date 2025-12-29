import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Colors, Typography } from '@/constants/theme';

interface CircularTimerProps {
  duration: number; // in seconds
  timeRemaining: number; // in seconds
  size?: number;
  strokeWidth?: number;
}

export const CircularTimer: React.FC<CircularTimerProps> = ({
  duration,
  timeRemaining,
  size = 160,
  strokeWidth = 12,
}) => {
  const [progress, setProgress] = useState(1);

  useEffect(() => {
    setProgress(timeRemaining / duration);
  }, [timeRemaining, duration]);

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - progress * circumference;

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Color based on progress (red when low, green when high)
  const getProgressColor = (): string => {
    if (progress > 0.5) return Colors.secondary;
    if (progress > 0.25) return Colors.accentSecondary;
    return Colors.accent;
  };

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} style={styles.svg}>
        {/* Background circle */}
        <Circle
          stroke={Colors.gray200}
          fill="transparent"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <Circle
          stroke={getProgressColor()}
          fill="transparent"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={styles.timeContainer}>
        <Text style={styles.timeText}>{formatTime(timeRemaining)}</Text>
        <Text style={styles.labelText}>remaining</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  svg: {
    position: 'absolute',
  },
  timeContainer: {
    alignItems: 'center',
  },
  timeText: {
    ...Typography.h1,
    color: Colors.primary,
    fontVariant: ['tabular-nums'],
  },
  labelText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 4,
  },
});

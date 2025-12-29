import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { Colors } from '@/constants/theme';

const { width, height } = Dimensions.get('window');

interface ConfettiPiece {
  id: number;
  x: Animated.Value;
  y: Animated.Value;
  rotation: Animated.Value;
  color: string;
  initialX: number;
}

interface ConfettiProps {
  active: boolean;
  onComplete?: () => void;
}

export const Confetti: React.FC<ConfettiProps> = ({ active, onComplete }) => {
  const confettiPieces = useRef<ConfettiPiece[]>([]);

  useEffect(() => {
    if (active) {
      // Create confetti pieces
      const pieces: ConfettiPiece[] = [];
      const colors = [
        Colors.accent,
        Colors.accentSecondary,
        Colors.accentTertiary,
        Colors.secondary,
        Colors.primary,
      ];

      for (let i = 0; i < 50; i++) {
        const startX = Math.random() * width;
        pieces.push({
          id: i,
          x: new Animated.Value(startX),
          y: new Animated.Value(-50),
          rotation: new Animated.Value(0),
          color: colors[Math.floor(Math.random() * colors.length)],
          initialX: startX,
        });
      }

      confettiPieces.current = pieces;

      // Animate confetti
      const animations = pieces.map((piece) => {
        return Animated.parallel([
          Animated.timing(piece.y, {
            toValue: height + 50,
            duration: 3000 + Math.random() * 2000,
            useNativeDriver: true,
          }),
          Animated.timing(piece.x, {
            toValue: piece.initialX + (Math.random() - 0.5) * 100,
            duration: 3000 + Math.random() * 2000,
            useNativeDriver: true,
          }),
          Animated.timing(piece.rotation, {
            toValue: Math.random() * 720,
            duration: 3000 + Math.random() * 2000,
            useNativeDriver: true,
          }),
        ]);
      });

      Animated.stagger(
        20,
        animations
      ).start(() => {
        if (onComplete) {
          onComplete();
        }
      });
    }
  }, [active, onComplete]);

  if (!active) return null;

  return (
    <View style={styles.container} pointerEvents="none">
      {confettiPieces.current.map((piece) => (
        <Animated.View
          key={piece.id}
          style={[
            styles.confetti,
            {
              backgroundColor: piece.color,
              transform: [
                { translateX: piece.x },
                { translateY: piece.y },
                {
                  rotate: piece.rotation.interpolate({
                    inputRange: [0, 360],
                    outputRange: ['0deg', '360deg'],
                  }),
                },
              ],
            },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
  },
  confetti: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 2,
  },
});

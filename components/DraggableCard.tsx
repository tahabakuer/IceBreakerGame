import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  useDerivedValue,
  interpolate,
} from 'react-native-reanimated';
import { FLIPSIDE_THEME } from '../constants/theme';

interface DraggableCardProps {
  isRevealed?: boolean;
  frontComponent: React.ReactNode;
  backComponent: React.ReactNode;
  style?: ViewStyle; // 'any' yerine daha katı bir tip
}

const CARD_WIDTH = 200;
const CARD_HEIGHT = 280;

export const DraggableCard: React.FC<DraggableCardProps> = ({ 
  isRevealed = false, 
  frontComponent, 
  backComponent, 
  style 
}) => {
  const translationX = useSharedValue(0);
  const translationY = useSharedValue(0);
  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);
  const scale = useSharedValue(1);
  const tiltX = useSharedValue(0);
  const tiltY = useSharedValue(0);

  const springConfig = { stiffness: 200, damping: 20, mass: 0.5 };

  // Flip animasyonunu tetikleyen Shared Value
  const rotation = useDerivedValue(() => {
    return withSpring(isRevealed ? 180 : 0, springConfig);
  }, [isRevealed]);

  const gesture = Gesture.Pan()
    .onStart(() => { scale.value = withSpring(1.05, springConfig); })
    .onUpdate((event) => {
      translationX.value = offsetX.value + event.translationX;
      translationY.value = offsetY.value + event.translationY;
      tiltY.value = (event.translationX / 100) * 2;
      tiltX.value = -(event.translationY / 100) * 2;
    })
    .onEnd(() => {
      scale.value = withSpring(1, springConfig);
      tiltX.value = withSpring(0, springConfig);
      tiltY.value = withSpring(0, springConfig);
      offsetX.value = translationX.value;
      offsetY.value = translationY.value;
    });

  const mainAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translationX.value },
      { translateY: translationY.value },
      { scale: scale.value },
    ],
  }));

  const frontAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(rotation.value, [0, 180], [0, 180]);
    return {
      transform: [
        { perspective: 1000 },
        { rotateX: `${tiltX.value}deg` },
        { rotateY: `${rotateY + tiltY.value}deg` },
      ],
      backfaceVisibility: 'hidden',
    };
  });

  const backAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(rotation.value, [0, 180], [180, 360]);
    return {
      transform: [
        { perspective: 1000 },
        { rotateX: `${tiltX.value}deg` },
        { rotateY: `${rotateY + tiltY.value}deg` },
      ],
      backfaceVisibility: 'hidden',
      position: 'absolute',
    };
  });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.mainContainer, mainAnimatedStyle, style]}>
        <Animated.View style={[styles.cardCard, styles.backCard, backAnimatedStyle]}>
          {backComponent}
        </Animated.View>
        <Animated.View style={[styles.cardCard, styles.frontCard, frontAnimatedStyle]}>
          {frontComponent}
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  mainContainer: { width: CARD_WIDTH, height: CARD_HEIGHT, position: 'absolute' },
  cardCard: { width: '100%', height: '100%', borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  frontCard: { backgroundColor: FLIPSIDE_THEME.colors.surfaceVariant },
  backCard: { backgroundColor: FLIPSIDE_THEME.colors.surface, borderWidth: 1, borderColor: FLIPSIDE_THEME.colors.border },
});
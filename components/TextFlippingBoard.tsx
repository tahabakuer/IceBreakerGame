import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withDelay, withSequence, withTiming, Easing } from 'react-native-reanimated';
import { FLIPSIDE_THEME } from '../constants/theme';

const BOARD_ROWS = 1; // Sadece başlık için kullanacağımızdan tek satır yeterli
const BOARD_COLS = 8;  // "FLIPSIDE" tam 8 harf

interface FlapCellProps {
  char: string;
  index: number;
}

const FlapCell: React.FC<FlapCellProps> = React.memo(({ char, index }) => {
  const rotateX = useSharedValue(0);

  useEffect(() => {
    // Bileşen yüklendiğinde havalimanı panosu gibi tıkır tıkır dönme efekti (Gecikmeli)
    rotateX.value = withDelay(
      index * 80,
      withSequence(
        withTiming(180, { duration: 150, easing: Easing.out(Easing.quad) }),
        withTiming(360, { duration: 150, easing: Easing.inOut(Easing.quad) })
      )
    );
  }, [char]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotateX: `${rotateX.value}deg` }],
  }));

  return (
    <Animated.View style={[styles.cellContainer, animatedStyle]}>
      <View style={[styles.halfCell, styles.topHalf]}>
        <Text style={styles.cellText}>{char.toUpperCase()}</Text>
      </View>
      <View style={[styles.halfCell, styles.bottomHalf]}>
        <Text style={[styles.cellText, styles.cellTextBottom]}>{char.toUpperCase()}</Text>
      </View>
      <View style={styles.splitLine} />
    </Animated.View>
  );
});

interface TextFlippingBoardProps {
  text: string;
}

export const TextFlippingBoard: React.FC<TextFlippingBoardProps> = ({ text }) => {
  // Gelen metni 8 karaktere tamamla veya kes (Örn: "FLIPSIDE")
  const formattedText = text.toUpperCase().padEnd(BOARD_COLS, ' ').slice(0, BOARD_COLS);
  const chars = formattedText.split('');

  return (
    <View style={styles.boardWrapper}>
      <View style={styles.boardRow}>
        {chars.map((char, index) => (
          <FlapCell key={`${char}-${index}`} char={char} index={index} />
        ))}
      </View>
    </View>
  );
};

const SCREEN_WIDTH = Dimensions.get('window').width;
// Harflerin ekrana kusursuz yayılması için dinamik genişlik
const CELL_SIZE = Math.floor((SCREEN_WIDTH - 60) / BOARD_COLS);

const styles = StyleSheet.create({
  boardWrapper: {
    backgroundColor: FLIPSIDE_THEME.colors.background, // Saf Brutalist Siyah
    alignItems: 'center',
    justifyContent: 'center',
  },
  boardRow: {
    flexDirection: 'row',
  },
  cellContainer: {
    width: CELL_SIZE,
    height: CELL_SIZE * 1.4,
    backgroundColor: FLIPSIDE_THEME.colors.surface, // Mat Antrasit
    marginHorizontal: 2,
    borderRadius: 4,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: FLIPSIDE_THEME.colors.border,
  },
  halfCell: {
    position: 'absolute',
    left: 0,
    right: 0,
    width: '100%',
    height: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: FLIPSIDE_THEME.colors.surfaceVariant,
  },
  topHalf: {
    top: 0,
    borderBottomWidth: 0.5,
    borderBottomColor: '#000000',
  },
  bottomHalf: {
    bottom: 0,
    borderTopWidth: 0.5,
    borderTopColor: '#000000',
    overflow: 'hidden',
  },
  cellText: {
    color: FLIPSIDE_THEME.colors.textPrimary, // Saf Brutalist Beyaz/Açık Gri
    fontSize: CELL_SIZE * 0.9,
    fontWeight: '900',
    position: 'absolute',
    top: CELL_SIZE * 0.05,
  },
  cellTextBottom: {
    top: -CELL_SIZE * 0.65,
  },
  splitLine: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    zIndex: 10,
  },
});
import React from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
} from 'react-native-reanimated';

interface CometCardProps {
  title: string;
  subtitle: string;
  playerName: string;
  score: number;
  highlightStat?: string;
  style?: any;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.85;

export const CometCard: React.FC<CometCardProps> = ({
  title,
  subtitle,
  playerName,
  score,
  highlightStat,
  style,
}) => {
  // 3D Animasyon Değerleri
  const rotateX = useSharedValue(0);
  const rotateY = useSharedValue(0);
  const scale = useSharedValue(1);
  
  // Glare (Parlama) Efektinin Konumu
  const glareX = useSharedValue(CARD_WIDTH / 2);
  const glareY = useSharedValue(120);

  const springConfig = { stiffness: 150, damping: 25, mass: 0.6 };

  // Parmağı kart üzerinde hareket ettirince tetiklenecek 3D etkileşim
  const gesture = Gesture.Pan()
    .onBegin(() => {
      scale.value = withSpring(1.03, springConfig);
    })
    .onUpdate((event) => {
      // Sınırlandırılmış 3D eğilme açı hesaplamaları
      rotateY.value = interpolate(event.x, [0, CARD_WIDTH], [12, -12]);
      rotateX.value = interpolate(event.y, [0, 240], [-12, 12]);

      // Parlama efektinin ışık kaynağını parmağın altına taşı
      glareX.value = event.x;
      glareY.value = event.y;
    })
    .onEnd(() => {
      // Parmağı çekince kartı yay gibi eski haline döndür
      scale.value = withSpring(1, springConfig);
      rotateX.value = withSpring(0, springConfig);
      rotateY.value = withSpring(0, springConfig);
      glareX.value = withSpring(CARD_WIDTH / 2, springConfig);
      glareY.value = withSpring(120, springConfig);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 1200 },
      { scale: scale.value },
      { rotateX: `${rotateX.value}deg` },
      { rotateY: `${rotateY.value}deg` },
    ],
  }));

  const glareAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: glareX.value - 100 },
      { translateY: glareY.value - 100 },
    ],
  }));

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.cardContainer, animatedStyle, style]}>
        
        {/* Soyut Işık Süzmesi (Dinamik Glare Katmanı) */}
        <Animated.View style={[styles.glareSphere, glareAnimatedStyle]} pointerEvents="none" />

        {/* Kartın İçerik Alanı */}
        <View style={styles.header}>
          <Text style={styles.badgeText}>{title.toUpperCase()}</Text>
          <Text style={styles.playerNameText}>{playerName}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.statsBody}>
          <Text style={styles.scoreNumber}>{score}<Text style={styles.ptsLabel}> PTS</Text></Text>
          <Text style={styles.subtitleText}>{subtitle}</Text>
          
          {highlightStat && (
            <View style={styles.highlightBadge}>
              <Text style={styles.highlightText}>{highlightStat.toUpperCase()}</Text>
            </View>
          )}
        </View>

      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: CARD_WIDTH,
    height: 250,
    backgroundColor: '#090d16', // Perplexity tarzı ultra derin koyu uzay mavisi
    borderRadius: 24,
    padding: 24,
    borderWidth: 1.5,
    borderColor: '#1e293b',
    overflow: 'hidden',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.6,
    shadowRadius: 30,
    elevation: 20,
  },
  glareSphere: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.08)', // Soft beyaz parlama süzmesi
    opacity: 0.7,
  },
  header: {
    alignItems: 'flex-start',
  },
  badgeText: {
    color: '#38bdf8', // Neon siber mavi
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 6,
  },
  playerNameText: {
    color: '#f8fafc',
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  divider: {
    height: 1,
    backgroundColor: '#1e293b',
    width: '100%',
    marginVertical: 10,
  },
  statsBody: {
    flex: 1,
    justifyContent: 'center',
  },
  scoreNumber: {
    color: '#f59e0b', // Amber rengi skor vurgusu
    fontSize: 36,
    fontWeight: '900',
  },
  ptsLabel: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '600',
  },
  subtitleText: {
    color: '#94a3b8',
    fontSize: 13,
    marginTop: 4,
    lineHeight: 18,
  },
  highlightBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 12,
    borderWidth: 0.5,
    borderColor: 'rgba(56, 189, 248, 0.2)',
  },
  highlightText: {
    color: '#38bdf8',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});
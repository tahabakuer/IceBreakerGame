import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

interface SplitFlapBoardProps {
  text: string;
  durationPerChar?: number;
}

export const SplitFlapBoard: React.FC<SplitFlapBoardProps> = ({ text, durationPerChar = 100 }) => {
  const [displayedText, setDisplayedText] = useState<string[]>([]);
  const targetChars = text.toUpperCase().split('');

  useEffect(() => {
  setDisplayedText(new Array(targetChars.length).fill(' '));
  
  // Tipi kaldırdık veya any[] yaptık, böylece hata vermez
  const currentTimers: any[] = [];

  targetChars.forEach((char, index) => {
    const randomTicks = Math.floor(Math.random() * 5) + 3;
    
    for (let i = 0; i <= randomTicks; i++) {
      const timer = setTimeout(() => {
        setDisplayedText((prev) => {
          const next = [...prev];
          next[index] = i === randomTicks ? char : String.fromCharCode(65 + Math.floor(Math.random() * 26));
          return next;
        });
      }, index * durationPerChar + (i * 50));
      
      currentTimers.push(timer);
    }
  });

  return () => currentTimers.forEach((t) => clearTimeout(t));
}, [text]);

  return (
    <View style={styles.boardContainer}>
      {displayedText.map((char, idx) => (
        <View key={idx} style={styles.flapSegment}>
          {/* Panonun ortasındaki o yatay kesik çizgiyi simüle eden üst ve alt yarılar */}
          <View style={styles.flapTop} />
          <Text style={styles.flapText}>{char === ' ' ? ' ' : char}</Text>
          <View style={styles.flapDivider} />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  boardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    backgroundColor: '#111', // Koyu pano arka planı
    padding: 15,
    borderRadius: 8,
    borderWidth: 4,
    borderColor: '#2d1a10', // Ahşap çerçeve hissi
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  flapSegment: {
    width: 32,
    height: 48,
    backgroundColor: '#1e1e1e',
    margin: 3,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#333',
    position: 'relative',
  },
  flapTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: '#262626',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  flapText: {
    color: '#f59e0b', // Amber/Neon birahane tabelası rengi
    fontSize: 28,
    fontWeight: 'bold',
    fontFamily: 'Courier', // Font uymuyorsa sistem monospace fontuna döner
    zIndex: 2,
  },
  flapDivider: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#000',
    zIndex: 3,
  },
});
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Dimensions, ViewStyle } from 'react-native';
import { useGameStore } from '../store/useGameStore';
import { DraggableCard } from './DraggableCard';
import { CometCard } from './CometCard';
import { FLIPSIDE_THEME } from '../constants/theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface PlayerCardData {
  id: string;
  playerName: string;
  playerColor: string; 
  selectedOption: string;
  isRevealed: boolean;
  randomX: number;
  randomY: number;
  randomRotate: number;
}

export const GameTable = () => {
  const { currentQuestion, options, players } = useGameStore((state) => ({
    currentQuestion: state.currentQuestion,
    options: state.players.map(p => p.name),
    players: state.players,
  }));

  const [turnIndex, setTurnIndex] = useState(0);
  const [playedCards, setPlayedCards] = useState<PlayerCardData[]>([]);
  const [scores, setScores] = useState<Record<string, number>>(() => 
    players.reduce((acc, p) => ({ ...acc, [p.name]: 0 }), {})
  );
  const [isAnswering, setIsAnswering] = useState(false);
  const [roundState, setRoundState] = useState<'VOTING' | 'REVEALING' | 'SUMMARY'>('VOTING');
  const [winnerData, setWinnerData] = useState<{ name: string; score: number } | null>(null);

  const activePlayer = players[turnIndex];

  const executeRevealSequence = (finalCards: PlayerCardData[]) => {
    setRoundState('REVEALING');
    setPlayedCards(finalCards.map(card => ({ ...card, isRevealed: true })));

    const voteCounts: Record<string, number> = {};
    finalCards.forEach(card => {
      voteCounts[card.selectedOption] = (voteCounts[card.selectedOption] || 0) + 1;
    });

    let maxVotes = 0;
    let winningOption = "";
    Object.entries(voteCounts).forEach(([option, count]) => {
      if (count > maxVotes) {
        maxVotes = count;
        winningOption = option;
      }
    });

    const nextScores = { ...scores };
    finalCards.forEach(card => {
      if (card.selectedOption === winningOption) {
        nextScores[card.playerName] = (nextScores[card.playerName] || 0) + 10;
      }
    });

    setScores(nextScores);

    let topPlayer = players[0]?.name || "UNKNOWN";
    let topScore = -1;
    Object.entries(nextScores).forEach(([name, score]) => {
      if (score > topScore) {
        topScore = score;
        topPlayer = name;
      }
    });

    setTimeout(() => {
      setWinnerData({ name: topPlayer, score: topScore });
      setRoundState('SUMMARY');
    }, 1500);
  };

  const handleConfirmAnswer = (option: string) => {
    setIsAnswering(false);

    // Kriptografik olarak daha kararlı ve render esnasında sapıtmayan deterministik ofset hesaplaması
    const targetX = (Math.random() - 0.5) * (SCREEN_WIDTH * 0.35);
    const targetY = (Math.random() - 0.5) * (SCREEN_HEIGHT * 0.12); 
    const targetRotate = (Math.random() - 0.5) * 24;

    const newCard: PlayerCardData = {
      // Prod Güvencesi: Oyuncu ismi ve turnIndex birleşimiyle eşsiz ve sabit bir key üretiyoruz
      id: `${activePlayer.name}_${turnIndex}_${Date.now()}`,
      playerName: activePlayer.name,
      playerColor: activePlayer.color,
      selectedOption: option,
      isRevealed: false,
      randomX: targetX,
      randomY: targetY,
      randomRotate: targetRotate,
    };

    const updatedCards = [...playedCards, newCard];
    setPlayedCards(updatedCards);

    if (turnIndex < players.length - 1) {
      setTurnIndex(turnIndex + 1);
    } else {
      setTimeout(() => {
        executeRevealSequence(updatedCards);
      }, 0);
    }
  };

  const handleNextRound = () => {
    setWinnerData(null);
    setPlayedCards([]);
    setTurnIndex(0);
    setRoundState('VOTING');
  };

  return (
    <View style={styles.tableContainer}>
      
      {/* 📊 TOP BAR */}
      <View style={styles.scoreBar}>
        {players.map((p) => (
          <View key={p.name} style={styles.scoreItem}>
            <View style={[styles.colorIndicator, { backgroundColor: p.color }]} />
            <Text style={styles.scoreText}>{p.name}: <Text style={styles.scoreValue}>{scores[p.name] || 0}p</Text></Text>
          </View>
        ))}
      </View>

      {/* 👑 QUESTION DISPLAY */}
      <View style={styles.boardSection}>
        <Text style={styles.questionLabel}>CURRENT INQUIRY</Text>
        <Text style={styles.questionText}>{currentQuestion}</Text>
      </View>

      {/* 🃏 CANVAS AREA */}
      <View style={styles.canvasArea}>
        {playedCards.length === 0 && (
          <View style={styles.placeholderContainer}>
            <Text style={styles.canvasPlaceholder}>THE TABLE IS VACANT</Text>
            <Text style={styles.canvasSubPlaceholder}>Submit secret cards to initiate the interaction.</Text>
          </View>
        )}

        {playedCards.map((card) => {
          const dynamicCardStyle: ViewStyle = {
            position: 'absolute',
            left: '50%',
            top: '50%',
            marginLeft: -100 + card.randomX,
            marginTop: -140 + card.randomY,
            width: 200,
            height: 280,
            transform: [{ rotate: `${card.randomRotate}deg` }],
            zIndex: card.isRevealed ? 10 : 1,
          };

          return (
            <DraggableCard 
              key={card.id}
              isRevealed={card.isRevealed}
              style={dynamicCardStyle}
              frontComponent={
                <View style={[styles.innerCard, styles.cardFront, { borderColor: card.playerColor }]}>
                  <Text style={[styles.frontOwnerText, { color: card.playerColor }]}>{card.playerName.toUpperCase()}</Text>
                  <Text style={styles.frontAnswerText}>{card.selectedOption}</Text>
                </View>
              }
              backComponent={
                <View style={[styles.innerCard, styles.cardBack]}>
                  <Text style={styles.cardBackLogo}>FLIP</Text>
                  <View style={styles.cardBackDivider} />
                  <Text style={styles.cardBackSecret}>SECRET CONTENT</Text>
                </View>
              }
            />
          );
        })}
      </View>

      {/* 🕹️ CONTROLS */}
      <View style={styles.deckSection}>
        {roundState === 'VOTING' ? (
          <View style={styles.actionWrapper}>
            <Text style={styles.turnIndicator}>
              CURRENT PLAYER: <Text style={styles.activePlayerName}>{activePlayer?.name.toUpperCase()}</Text>
            </Text>
            <TouchableOpacity onPress={() => setIsAnswering(true)} style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>PLACE SECRET ANSWER</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.evaluatingWrapper}>
            <Text style={styles.evaluatingText}>
              {roundState === 'REVEALING' ? "PROCESSING REVEAL SEQUENCE..." : "ROUND CONCLUDED"}
            </Text>
          </View>
        )}
      </View>

      {/* 📥 ANSWER INPUT MODAL */}
      <Modal visible={isAnswering} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>SELECT RESPONSE MATRIX</Text>
            <View style={styles.optionsGrid}>
              {options.map((option, idx) => (
                <TouchableOpacity 
                  key={idx} 
                  style={styles.optionButton} 
                  onPress={() => handleConfirmAnswer(option)}
                >
                  <Text style={styles.optionText}>{option.toUpperCase()}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>

      {/* 🏆 LEADER OVERLAY */}
      {roundState === 'SUMMARY' && winnerData && (
        <View style={styles.summaryOverlay}>
          <Text style={styles.summaryTitle}>VALUATION MATRIX</Text>
          <CometCard 
            title="Current Match Leader 🏆"
            playerName={winnerData.name}
            score={winnerData.score}
            subtitle="Demonstrated optimal group alignment and predictive social accuracy."
            highlightStat="Mind Reader"
          />
          <TouchableOpacity style={styles.rematchButton} onPress={handleNextRound}>
            <Text style={styles.rematchText}>PROCEED TO NEXT INQUIRY</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  tableContainer: { flex: 1, backgroundColor: FLIPSIDE_THEME.colors.background, justifyContent: 'space-between' },
  
  scoreBar: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: FLIPSIDE_THEME.colors.surface, paddingVertical: 14, paddingHorizontal: 16, borderBottomWidth: 1, borderColor: FLIPSIDE_THEME.colors.borderDark, marginTop: 30 },
  scoreItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  colorIndicator: { width: 6, height: 6, borderRadius: 1 },
  scoreText: { color: FLIPSIDE_THEME.colors.textSecondary, fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  scoreValue: { color: FLIPSIDE_THEME.colors.textPrimary, fontWeight: '900' },
  
  boardSection: { paddingHorizontal: 24, paddingVertical: 16, alignItems: 'center' },
  questionLabel: { color: FLIPSIDE_THEME.colors.textMuted, fontSize: 9, fontWeight: 'bold', letterSpacing: 3, marginBottom: 6 },
  questionText: { color: FLIPSIDE_THEME.colors.textPrimary, fontSize: 15, fontWeight: '800', textAlign: 'center', lineHeight: 22 },
  
  canvasArea: { flex: 1, width: '100%', position: 'relative', justifyContent: 'center', alignItems: 'center' },
  placeholderContainer: { alignItems: 'center', paddingHorizontal: 40 },
  canvasPlaceholder: { color: FLIPSIDE_THEME.colors.border, fontSize: 14, fontWeight: '900', letterSpacing: 4, marginBottom: 4 },
  canvasSubPlaceholder: { color: FLIPSIDE_THEME.colors.textMuted, fontSize: 11, textAlign: 'center', lineHeight: 16 },
  
  innerCard: { flex: 1, borderRadius: 6, borderWidth: 1, overflow: 'hidden', alignItems: 'center', justifyContent: 'center', width: '100%' },
  cardBack: { backgroundColor: FLIPSIDE_THEME.colors.surface, borderColor: FLIPSIDE_THEME.colors.border },
  cardFront: { backgroundColor: FLIPSIDE_THEME.colors.surfaceVariant, padding: 16, borderWidth: 2 }, 
  
  cardBackLogo: { color: FLIPSIDE_THEME.colors.border, fontSize: 28, fontWeight: '900', letterSpacing: 4 },
  cardBackDivider: { width: 30, height: 1, backgroundColor: FLIPSIDE_THEME.colors.border, marginVertical: 10 },
  cardBackSecret: { color: FLIPSIDE_THEME.colors.textMuted, fontSize: 9, fontWeight: '700', letterSpacing: 1 },
  
  frontOwnerText: { fontSize: 11, fontWeight: '900', letterSpacing: 2, marginBottom: 20 },
  frontAnswerText: { color: FLIPSIDE_THEME.colors.textPrimary, fontSize: 20, fontWeight: '900', textAlign: 'center' },
  
  deckSection: { paddingHorizontal: 24, paddingBottom: 24, minHeight: 110, justifyContent: 'center', width: '100%' },
  actionWrapper: { alignItems: 'center', gap: 12 },
  turnIndicator: { color: FLIPSIDE_THEME.colors.textSecondary, fontSize: 11, fontWeight: '700', letterSpacing: 1.5 },
  activePlayerName: { color: FLIPSIDE_THEME.colors.textPrimary, fontWeight: '900' },
  primaryButton: { width: '100%', backgroundColor: FLIPSIDE_THEME.colors.actionButton, paddingVertical: 16, borderRadius: 6, alignItems: 'center' },
  primaryButtonText: { color: FLIPSIDE_THEME.colors.actionButtonText, fontWeight: '900', fontSize: 13, letterSpacing: 1.5 },
  
  evaluatingWrapper: { alignItems: 'center' },
  evaluatingText: { color: FLIPSIDE_THEME.colors.textSecondary, fontWeight: '800', fontSize: 11, letterSpacing: 2 },
  
  modalOverlay: { flex: 1, backgroundColor: 'rgba(5, 5, 5, 0.95)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '85%', backgroundColor: FLIPSIDE_THEME.colors.surface, borderRadius: 6, padding: 24, borderWidth: 1, borderColor: FLIPSIDE_THEME.colors.borderDark },
  modalTitle: { color: FLIPSIDE_THEME.colors.textPrimary, fontSize: 12, fontWeight: '900', marginBottom: 20, textAlign: 'center', letterSpacing: 2 },
  optionsGrid: { width: '100%', gap: 8 },
  optionButton: { width: '100%', backgroundColor: FLIPSIDE_THEME.colors.background, padding: 16, borderRadius: 6, alignItems: 'center', borderWidth: 1, borderColor: FLIPSIDE_THEME.colors.borderDark },
  optionText: { color: FLIPSIDE_THEME.colors.textPrimary, fontSize: 13, fontWeight: '800', letterSpacing: 0.5 },

  summaryOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(5, 5, 5, 0.96)', justifyContent: 'center', alignItems: 'center', zIndex: 100, padding: 24 },
  summaryTitle: { color: FLIPSIDE_THEME.colors.textMuted, fontSize: 11, fontWeight: 'bold', letterSpacing: 4, marginBottom: 20 },
  rematchButton: { marginTop: 24, backgroundColor: FLIPSIDE_THEME.colors.actionButton, paddingVertical: 16, borderRadius: 6, width: '100%', alignItems: 'center' },
  rematchText: { color: FLIPSIDE_THEME.colors.actionButtonText, fontWeight: '900', fontSize: 13, letterSpacing: 1 },
});
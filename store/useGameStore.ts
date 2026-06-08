import { create } from 'zustand';
import questionsData from '../constants/questions.json';

type GameStatus = 'LOBBY' | 'CATEGORY_SELECTION' | 'QUIZ' | 'SCOREBOARD';

interface Player {
  id: string;
  name: string;
  score: number;
}

interface Question {
  id: string;
  text: string;
  options: string[];
  answer: string;
}

// Oyuncunun verdiği cevap ve geçen süre objesi
interface PlayerAnswerData {
  answer: string;
  responseTime: number;
}

interface GameState {
  status: GameStatus;
  players: Player[];
  currentPlayerTurnIndex: number;
  selectedCategory: string | null;
  currentQuestions: Question[];
  currentQuestionIndex: number;
  usedCategories: string[];
  randomCategories: any[];

  initLocalGame: (playerNames: string[]) => void;
  generateRandomCategories: () => void;
  selectCategory: (categoryId: string) => void;
  // Tipi string yerine PlayerAnswerData objesi olacak şekilde güncelledik
  answerQuestion: (playerAnswers: { [playerId: string]: PlayerAnswerData }) => void;
  nextQuestion: () => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  status: 'LOBBY',
  players: [],
  currentPlayerTurnIndex: 0,
  selectedCategory: null,
  currentQuestions: [],
  currentQuestionIndex: 0,
  usedCategories: [],
  randomCategories: [],

  initLocalGame: (playerNames) => {
    const playersList = playerNames.map((name, index) => ({
      id: `player_${index}`,
      name,
      score: 0,
    }));

    set({
      players: playersList,
      status: 'CATEGORY_SELECTION',
      currentPlayerTurnIndex: 0,
      usedCategories: [],
      selectedCategory: null,
      currentQuestions: [],
      currentQuestionIndex: 0,
    });

    get().generateRandomCategories();
  },

  generateRandomCategories: () => {
    const { usedCategories } = get();
    
    const availableCategories = questionsData.categories.filter(
      (cat) => !usedCategories.includes(cat.id)
    );

    const pools = availableCategories.length > 0 ? availableCategories : questionsData.categories;

    const shuffled = [...pools].sort(() => 0.5 - Math.random());
    set({ randomCategories: shuffled.slice(0, 3) });
  },

  selectCategory: (categoryId) => {
    const category = questionsData.categories.find((cat) => cat.id === categoryId);
    if (!category) return;

    const shuffledQuestions = [...category.questions].sort(() => 0.5 - Math.random());
    const selectedQuestions = shuffledQuestions.slice(0, 5);

    set((state) => ({
      selectedCategory: categoryId,
      currentQuestions: selectedQuestions,
      currentQuestionIndex: 0,
      status: 'QUIZ',
      usedCategories: [...state.usedCategories, categoryId],
    }));
  },

  answerQuestion: (playerAnswers) => {
    const { currentQuestions, currentQuestionIndex, players, currentPlayerTurnIndex } = get();
    const currentQuestion = currentQuestions[currentQuestionIndex];
    const totalPlayersInRoom = players.length;

    // 1. Cevap verenleri hızlarına göre sırala
    const sortedAnswers = Object.entries(playerAnswers)
      .map(([playerId, data]) => ({ playerId, answer: data.answer, responseTime: data.responseTime }))
      .sort((a, b) => a.responseTime - b.responseTime);

    // 2. Puanları hesapla
    const updatedPlayers = players.map((player) => {
      const playerData = playerAnswers[player.id];
      
      // Yanlış cevap veya cevapsız durumunda puan yok
      if (!playerData || playerData.answer !== currentQuestion.answer) {
        return player;
      }

      // BAŞLANGIÇ: Doğru cevap veren herkese temel 100 puan
      let roundScore = 100;

      // DENGELEME: Kategoriyi seçen oyuncu mu?
      const isCategoryChooser = players[currentPlayerTurnIndex].id === player.id;
      
      if (!isCategoryChooser) {
        // Kategoriyi seçmeyen diğer oyuncular doğru bilirse +50 Deplasman Bonusu alır
        roundScore += 50;
      }

      // HIZ BONUSU: Arkasında bıraktığı oyuncu sayısı * 10
      const speedRankIndex = sortedAnswers.findIndex((ans) => ans.playerId === player.id);
      if (speedRankIndex !== -1) {
        const playersBeaten = totalPlayersInRoom - (speedRankIndex + 1);
        const speedBonus = playersBeaten * 10;
        
        roundScore += speedBonus;
      }

      return { ...player, score: player.score + roundScore };
    });

    set({ players: updatedPlayers });
  },

  nextQuestion: () => {
    const { currentQuestionIndex, currentQuestions, players, currentPlayerTurnIndex } = get();
    
    if (currentQuestionIndex + 1 < currentQuestions.length) {
      set({ currentQuestionIndex: currentQuestionIndex + 1 });
    } else {
      const nextTurnIndex = (currentPlayerTurnIndex + 1) % players.length;
      set({ 
        status: 'SCOREBOARD',
        currentPlayerTurnIndex: nextTurnIndex
      });
    }
  },

  resetGame: () => {
    set({
      status: 'LOBBY',
      players: [],
      currentPlayerTurnIndex: 0,
      selectedCategory: null,
      currentQuestions: [],
      currentQuestionIndex: 0,
      usedCategories: [],
      randomCategories: [],
    });
  },
}));
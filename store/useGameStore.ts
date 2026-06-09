import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FLIPSIDE_THEME } from '../constants/theme';
import questionData from '../constants/questions.json'; // Soru havuzunu bağlıyoruz

interface PlayerProfile {
  name: string;
  color: string;
}

interface UserProfile {
  name: string;
  email: string;
  avatarUrl: string | null;
}

type GameStatus = 'START' | 'PLAYING';

interface GameState {
  // Auth & Session
  user: UserProfile | null;
  isLoggedIn: boolean;
  status: GameStatus;
  login: (userData: UserProfile) => void;
  logout: () => void;
  setStatus: (status: GameStatus) => void;
  
  // Game Play Core
  currentQuestion: string;
  usedQuestionIndices: number[];
  players: PlayerProfile[];
  
  // Actions
  drawNextQuestion: () => void;
  resetGameSession: () => void;
}

// Soru havuzunu json'dan güvenli bir şekilde dizi olarak alıyoruz
const QUESTIONS_POOL: string[] = Array.isArray(questionData) 
  ? questionData 
  : (questionData as any).questions || [
      "WHO IS THE MOST LIKELY TO RESTART A GAME FROM SCRATCH?"
    ];

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      // initial states
      user: null,
      isLoggedIn: false,
      status: 'START',
      currentQuestion: QUESTIONS_POOL[0],
      usedQuestionIndices: [0],
      
      players: [
        { name: "TAHA", color: FLIPSIDE_THEME.playerColors[0] },
        { name: "VOLKAN", color: FLIPSIDE_THEME.playerColors[1] },
        { name: "AYŞE", color: FLIPSIDE_THEME.playerColors[2] },
        { name: "CAN", color: FLIPSIDE_THEME.playerColors[3] },
      ],

      login: (userData) => set({ user: userData, isLoggedIn: true }),
      logout: () => set({ user: null, isLoggedIn: false }),
      setStatus: (newStatus) => set({ status: newStatus }),

      /**
       * Havuzdan daha önce sorulmamış rastgele bir soruyu çeker.
       * Tüm sorular bittiğinde havuzu otomatik olarak sıfırlar ve devirdaim yapar.
       */
      drawNextQuestion: () => {
        const { usedQuestionIndices } = get();
        
        // Eğer tüm sorular tüketildiyse havuzu sıfırla
        if (usedQuestionIndices.length >= QUESTIONS_POOL.length) {
          const randomIdx = Math.floor(Math.random() * QUESTIONS_POOL.length);
          set({
            currentQuestion: QUESTIONS_POOL[randomIdx],
            usedQuestionIndices: [randomIdx]
          });
          return;
        }

        // Sorulmamış indexleri filtrele
        const availableIndices = QUESTIONS_POOL
          .map((_, idx) => idx)
          .filter(idx => !usedQuestionIndices.includes(idx));

        const randomAvailableIdx = availableIndices[Math.floor(Math.random() * availableIndices.length)];
        
        set({
          currentQuestion: QUESTIONS_POOL[randomAvailableIdx],
          usedQuestionIndices: [...usedQuestionIndices, randomAvailableIdx]
        });
      },

      /**
       * Tur bittiğinde veya yeni bir lobi kurulduğunda oyun geçmişini temizler
       */
      resetGameSession: () => {
        const randomIdx = Math.floor(Math.random() * QUESTIONS_POOL.length);
        set({
          status: 'START',
          currentQuestion: QUESTIONS_POOL[randomIdx],
          usedQuestionIndices: [randomIdx]
        });
      }
    }),
    {
      name: 'flipside-game-storage', // Cihaz hafizasındaki eşsiz key
      storage: createJSONStorage(() => AsyncStorage),
      // Sadece kullanıcı oturumunu ve oyunun ana durumunu hafızada tutuyoruz.
      // Anlık kart pozisyonları veya skorlar gibi geçici canlı state'leri saklamıyoruz.
      partialize: (state) => ({ 
        user: state.user, 
        isLoggedIn: state.isLoggedIn,
        status: state.status
      }),
    }
  )
);
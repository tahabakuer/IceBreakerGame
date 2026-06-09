import React from 'react';
import { useGameStore } from '../../store/useGameStore';
import { LandingScreen } from '../../components/LandingScreen';
import { GameTable } from '../../components/GameTable';

export default function App() {
  const { status, setStatus } = useGameStore();

  if (status === 'START') {
    return <LandingScreen onStartGame={() => setStatus('PLAYING')} />;
  }

  return <GameTable />;
}
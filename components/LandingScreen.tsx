import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, SafeAreaView } from 'react-native';
import { useGameStore } from '../store/useGameStore';
import { TextFlippingBoard } from './TextFlippingBoard';
import { FLIPSIDE_THEME } from '@/constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const LandingScreen = ({ onStartGame }: { onStartGame: () => void }) => {
  const { user, isLoggedIn, login, logout } = useGameStore();

  const handleGoogleSignIn = () => {
    login({
      name: "Taha",
      email: "taha@example.com",
      avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      
      {/* 👤 TOP: MINIMAL PROFILE BAR (Grayscale) */}
      <View style={styles.profileHeader}>
        {isLoggedIn && user ? (
          <View style={styles.profileCard}>
            <Image source={{ uri: user.avatarUrl || '' }} style={styles.avatar} />
            <View style={styles.profileInfo}>
              <Text style={styles.welcomeText}>SIGNED IN AS</Text>
              <Text style={styles.userName}>{(user.name || 'UNKNOWN').toUpperCase()}</Text>
            </View>
            <TouchableOpacity onPress={logout} style={styles.logoutButton}>
              <Text style={styles.logoutText}>LOGOUT</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.profileCard}>
            <View style={styles.guestAvatar}><Text style={styles.guestText}>?</Text></View>
            <View style={styles.profileInfo}>
              <Text style={styles.welcomeText}>CURRENT MODE</Text>
              <Text style={styles.userName}>GUEST_SESSION</Text>
            </View>
          </View>
        )}
      </View>

      {/* 🌌 CENTER: LOGO AS FLIPPING BOARD */}
      <View style={styles.heroZone}>
        <Text style={styles.logoSub}>THE ART OF THE REVEAL</Text>
        
        <View style={styles.logoBoardWrapper}>
          <TextFlippingBoard text="FLIPSIDE" />
        </View>
      </View>

      {/* 🎴 BOTTOM: BLACK & WHITE BUTTONS */}
      <View style={styles.actionZone}>
        
        <TouchableOpacity style={styles.primaryPlayButton} onPress={onStartGame}>
          <Text style={styles.primaryPlayText}>START LOCAL GAME</Text>
        </TouchableOpacity>

        {!isLoggedIn && (
          <TouchableOpacity style={styles.googleAuthButton} onPress={handleGoogleSignIn}>
            <View style={styles.googleIconContainer}>
              <Text style={styles.googleIconText}>G</Text>
            </View>
            <Text style={styles.googleAuthText}>CONNECT GOOGLE ACCOUNT</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.footerVersion}>FLIPSIDE v1.0.0 • BRUTALIST UI</Text>
      </View>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: FLIPSIDE_THEME.colors.background,
    justifyContent: 'space-between',
    paddingVertical: 15,
  },
  profileHeader: {
    paddingHorizontal: 24,
    marginTop: 10,
  },
  profileCard: {
    flexDirection: 'row',
    backgroundColor: FLIPSIDE_THEME.colors.surface,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: FLIPSIDE_THEME.colors.borderDark,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: FLIPSIDE_THEME.colors.textPrimary,
  },
  guestAvatar: {
    width: 36,
    height: 36,
    borderRadius: 4,
    backgroundColor: FLIPSIDE_THEME.colors.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
  },
  guestText: { 
    color: FLIPSIDE_THEME.colors.textMuted, 
    fontWeight: 'bold' 
  },
  profileInfo: { 
    flex: 1, 
    marginLeft: 12 
  },
  welcomeText: { 
    color: FLIPSIDE_THEME.colors.textMuted, 
    fontSize: 8, 
    fontWeight: 'bold', 
    letterSpacing: 1 
  },
  userName: { 
    color: FLIPSIDE_THEME.colors.textPrimary, 
    fontSize: 13, 
    fontWeight: '800', 
    letterSpacing: 0.5 
  },
  logoutButton: { 
    paddingHorizontal: 10, 
    paddingVertical: 6, 
    backgroundColor: FLIPSIDE_THEME.colors.surfaceVariant, 
    borderRadius: 4 
  },
  logoutText: { 
    color: FLIPSIDE_THEME.colors.textSecondary, 
    fontSize: 9, 
    fontWeight: 'bold' 
  },
  heroZone: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  logoSub: {
    color: FLIPSIDE_THEME.colors.textMuted,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 6,
    marginBottom: 16,
  },
  logoBoardWrapper: {
    width: SCREEN_WIDTH - 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionZone: {
    paddingHorizontal: 24,
    gap: 12,
    width: '100%',
    alignItems: 'center',
  },
  primaryPlayButton: {
    width: '100%',
    backgroundColor: FLIPSIDE_THEME.colors.textPrimary, // Saf kontrast beyaz buton
    paddingVertical: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  primaryPlayText: {
    color: FLIPSIDE_THEME.colors.background, // İçindeki yazı saf siyah
    fontWeight: '900',
    fontSize: 13,
    letterSpacing: 2,
  },
  googleAuthButton: {
    width: '100%',
    backgroundColor: FLIPSIDE_THEME.colors.surface,
    flexDirection: 'row',
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: FLIPSIDE_THEME.colors.borderDark,
  },
  googleIconContainer: {
    position: 'absolute',
    left: 16,
    width: 20,
    height: 20,
    backgroundColor: FLIPSIDE_THEME.colors.textPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2,
  },
  googleIconText: { 
    color: FLIPSIDE_THEME.colors.background, 
    fontWeight: '900', 
    fontSize: 11 
  },
  googleAuthText: { 
    color: FLIPSIDE_THEME.colors.textSecondary, 
    fontWeight: '700', 
    fontSize: 12, 
    letterSpacing: 1 
  },
  footerVersion: { 
    color: FLIPSIDE_THEME.colors.textMuted, 
    fontSize: 9, 
    letterSpacing: 1, 
    marginTop: 15 
  },
});
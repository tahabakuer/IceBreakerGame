import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput } from 'react-native';
import { useGameStore } from '../../store/useGameStore';
import { SplitFlapBoard } from '../../components/SplitFlapBoard';

export default function HomeScreen() {
  const { status, initLocalGame } = useGameStore();
  const [p1, setP1] = useState('');
  const [p2, setP2] = useState('');

  if (status === 'LOBBY') {
    return (
      <View style={styles.neutralBackground}>
        <SafeAreaView style={styles.lobbyContainer}>
          
          {/* Tıkırdayan Pano (Amber rengi harfler nötr siyah çerçevede kalıyor) */}
          <View style={styles.panoWrapper}>
            <SplitFlapBoard text="ICE BREAKERS" />
            <Text style={styles.neutralSubtitle}>ÇOKTAN SEÇMELİ GRUP OYUNU</Text>
          </View>

          {/* Minimalist Giriş Kartı */}
          <View style={styles.neutralCard}>
            <Text style={styles.cardHeader}>Oyuncuları Ekle</Text>
            
            <TextInput 
              style={styles.neutralInput} 
              placeholder="1. Oyuncu İsmi" 
              placeholderTextColor="#9ca3af"
              value={p1} 
              onChangeText={setP1} 
            />
            <TextInput 
              style={styles.neutralInput} 
              placeholder="2. Oyuncu İsmi" 
              placeholderTextColor="#9ca3af"
              value={p2} 
              onChangeText={setP2} 
            />

            {/* Modern, Net Buton */}
            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={() => {
                if(p1 && p2) initLocalGame([p1, p2]);
                else alert("Oyuna başlamak için en az iki isim girmelisiniz!");
              }}
            >
              <Text style={styles.actionButtonText}>Oyunu Başlat</Text>
            </TouchableOpacity>
          </View>

        </SafeAreaView>
      </View>
    );
  }

  // Diğer ekran durumları (CATEGORY_SELECTION, QUIZ vb.) şimdilik aynı kalabilir
  return null; 
}

const styles = StyleSheet.create({
  neutralBackground: {
    flex: 1,
    backgroundColor: '#1f2937', // Nötr koyu antrasit zemin
  },
  lobbyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: 20,
  },
  panoWrapper: {
    alignItems: 'center',
    marginTop: 40,
    width: '100%',
  },
  neutralSubtitle: {
    color: '#9ca3af', // Nötr açık gri
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 3,
    marginTop: 15,
  },
  neutralCard: {
    width: '90%',
    backgroundColor: '#111827', // Mat siyah/koyu gri kart
    padding: 25,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#374151', // İnce nötr çerçeve
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    marginBottom: 40,
  },
  cardHeader: {
    color: '#f3f4f6',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
    letterSpacing: 0.5,
  },
  neutralInput: {
    backgroundColor: '#1f2937',
    borderWidth: 1,
    borderColor: '#374151',
    padding: 14,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
    color: '#f3f4f6',
  },
  actionButton: {
    backgroundColor: '#f59e0b', // Kontrast sağlayan canlı amber/turuncu buton
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#f59e0b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    marginTop: 10,
  },
  actionButtonText: {
    color: '#111827', // Koyu renk yazı ile yüksek okunurluk
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});
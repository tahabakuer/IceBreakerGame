import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet } from 'react-native';
import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import { FLIPSIDE_THEME } from '@/constants/theme';

export default function ModalScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>SYSTEM_INFO</Text>
      
      {/* Artık monokrom temamıza uygun sabit bir separator kullanıyoruz */}
      <View style={styles.separator} />
      
      <EditScreenInfo path="app/modal.tsx" />

      {/* Brutalist koyu tema için her zaman 'light' status bar daha şık durur */}
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: FLIPSIDE_THEME.colors.background,
  },
  title: {
    fontSize: 16,
    fontWeight: '900',
    color: FLIPSIDE_THEME.colors.textPrimary,
    letterSpacing: 4,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
    backgroundColor: FLIPSIDE_THEME.colors.borderDark,
  },
});
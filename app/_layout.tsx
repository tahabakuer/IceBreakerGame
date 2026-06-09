import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import { FLIPSIDE_THEME } from '@/constants/theme';

// Splash screen'i assetler yüklenene kadar tut
SplashScreen.preventAutoHideAsync();

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

export default function RootLayout() {
  // Artık sadece SplashScreen hide/show mantığını yönetiyoruz
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    // Reanimated ve GestureHandler'ın tüm app'i sarması gerekir (Prod için kritik)
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: FLIPSIDE_THEME.colors.background }}>
      <Stack
        screenOptions={{
          headerShown: false, // Header'ları biz manuel kontrol edeceğiz
          contentStyle: { backgroundColor: FLIPSIDE_THEME.colors.background },
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen 
          name="modal" 
          options={{ 
            presentation: 'modal',
            headerShown: false 
          }} 
        />
      </Stack>
    </GestureHandlerRootView>
  );
}
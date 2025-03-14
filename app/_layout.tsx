import { Stack } from "expo-router";
import { View } from "react-native";
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { 
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_900Black 
} from '@expo-google-fonts/inter';
import { 
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_800ExtraBold,
} from '@expo-google-fonts/poppins';
import * as SplashScreen from 'expo-splash-screen';
import {useEffect} from 'react';
import "./globals.css";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_900Black,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <View className="flex-1 bg-primary">
      <StatusBar style="light" backgroundColor="#030014" />
      <Stack screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: 'transparent' },
        animation: 'slide_from_right'
      }}>
        <Stack.Screen 
          name="onboarding" 
          options={{ animation: 'none' }}
        />
        <Stack.Screen 
          name="(tabs)" 
          options={{ animation: 'fade' }}
        />
        <Stack.Screen 
          name="movies/[id]" 
          options={{ 
            animation: 'slide_from_right',
            presentation: 'card'
          }}
        />
      </Stack>
    </View>
  );
}

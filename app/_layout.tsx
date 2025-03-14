import { Stack } from "expo-router";
import { View } from "react-native";
import { useFonts } from 'expo-font';
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
      <Stack screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: 'transparent' }
      }}>
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="movies/[id]" />
      </Stack>
    </View>
  );
}

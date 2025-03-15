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
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import "./globals.css";

SplashScreen.preventAutoHideAsync();
const HAS_ONBOARDED = 'has_onboarded';

export default function RootLayout() {
  const [initialRoute, setInitialRoute] = useState<string | null>(null);
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
    async function checkOnboarding() {
      try {
        const hasOnboarded = await AsyncStorage.getItem(HAS_ONBOARDED);
        console.log('Has onboarded value:', hasOnboarded);
        
        if (hasOnboarded) {
          setInitialRoute('(tabs)');
        }else{
          setInitialRoute('onboarding');
        }

      } catch (error) {
        console.error('Error checking onboarding status:', error);
        setInitialRoute('onboarding');
      }
    }
    
    checkOnboarding();
  }, []);

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if ((!loaded && !error) || initialRoute === null) {
    return null;
  }
  
  return (
    <View className="flex-1 bg-primary">
      <StatusBar style="light" backgroundColor="#030014" />
      <Stack 
        initialRouteName={initialRoute}
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: 'transparent' },
          animation: 'slide_from_right'
        }}
      >
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

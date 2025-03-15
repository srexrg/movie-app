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
  Poppins_400Regular
} from '@expo-google-fonts/poppins';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OnboardingScreen, { HAS_ONBOARDED } from './screens/OnboardingScreen';
import "./globals.css";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [showOnboarding, setShowOnboarding] = useState<boolean | null>(null);
  const [loaded, error] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_900Black,
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
  });

  useEffect(() => {
    async function checkOnboarding() {
      try {
        AsyncStorage.removeItem(HAS_ONBOARDED);
        const hasOnboarded = await AsyncStorage.getItem(HAS_ONBOARDED);
        console.log('Has onboarded value:', hasOnboarded);
        
        setShowOnboarding(hasOnboarded !== 'true');
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        setShowOnboarding(true);
      }
    }
    
    checkOnboarding();
  }, []);

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
  };

  // Wait for fonts and onboarding check to complete
  if ((!loaded && !error) || showOnboarding === null) {
    return (
      <>
        <StatusBar style="light" backgroundColor="#030014" translucent={true} />
        <View style={{flex: 1, backgroundColor: "#030014"}} />
      </>
    );
  }
  
  // Always include StatusBar at the root level
  return (
    <>
      <StatusBar style="light" backgroundColor="#030014" translucent={true} />
      {showOnboarding ? (
        <View style={{flex: 1, backgroundColor: "#030014"}}>
          <OnboardingScreen onComplete={handleOnboardingComplete} />
        </View>
      ) : (
        <View className="flex-1 bg-primary">
          <Stack
            initialRouteName="(tabs)"
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: 'transparent' },
              animation: 'slide_from_right'
            }}
          >
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
      )}
    </>
  );
}
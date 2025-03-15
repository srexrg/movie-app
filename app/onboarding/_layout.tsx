import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function OnboardingLayout() {
  return (
    <>
      <StatusBar style="light" backgroundColor="#030014" translucent={true} />
      <Stack screenOptions={{ 
        headerShown: false, 
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: '#030014' } 
      }}>
        <Stack.Screen name="index" />
      </Stack>
    </>
  );
}
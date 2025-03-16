import { View, Text, Switch, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { FontAwesome5 } from '@expo/vector-icons';
import { storageService } from '@/app/services/storage';

type UserPreferences = {
  enableNotifications: boolean;
  darkMode: boolean;
};

export default function ProfileScreen() {
  const [savedMoviesCount, setSavedMoviesCount] = useState(0);
  const [savedSeriesCount, setSavedSeriesCount] = useState(0);
  const [userName, setUserName] = useState<string | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences>({
    enableNotifications: true,
    darkMode: true,
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    const [savedMovies, savedSeries, userPrefs, name] = await Promise.all([
      storageService.getSavedMovies(),
      storageService.getSavedSeries(),
      storageService.getUserPreferences(),
      storageService.getUserName()
    ]);
    
    setSavedMoviesCount(savedMovies.length);
    setSavedSeriesCount(savedSeries.length);
    setPreferences(prev => ({ ...prev, ...userPrefs }));
    setUserName(name);
  };

  const handleTogglePreference = async (key: keyof UserPreferences) => {
    const newPreferences = {
      ...preferences,
      [key]: !preferences[key],
    };
    setPreferences(newPreferences);
    await storageService.setUserPreferences(newPreferences);
  };

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <ScrollView className="flex-1">
        <View className="p-4">
          <View className="items-center mb-8">
            <View className="w-24 h-24 bg-secondary rounded-full items-center justify-center mb-4">
              <FontAwesome5 name="user-alt" size={40} color="#AB8BFF" />
            </View>
            <Text 
              className="text-white text-2xl"
              style={{ fontFamily: 'Poppins_700Bold' }}
            >
              {userName || 'Movie Enthusiast'}
            </Text>
          </View>

          <View className="bg-secondary rounded-2xl p-4 mb-6">
            <Text 
              className="text-white text-lg mb-4"
              style={{ fontFamily: 'Poppins_700Bold' }}
            >
              Statistics
            </Text>
            <View className="flex-row justify-around">
              <View className="items-center">
                <Text 
                  className="text-accent text-2xl"
                  style={{ fontFamily: 'Poppins_700Bold' }}
                >
                  {savedMoviesCount}
                </Text>
                <Text 
                  className="text-light-200"
                  style={{ fontFamily: 'Poppins_600SemiBold' }}
                >
                  Saved Movies
                </Text>
              </View>
              <View className="items-center">
                <Text 
                  className="text-accent text-2xl"
                  style={{ fontFamily: 'Poppins_700Bold' }}
                >
                  {savedSeriesCount}
                </Text>
                <Text 
                  className="text-light-200"
                  style={{ fontFamily: 'Poppins_600SemiBold' }}
                >
                  Saved Series
                </Text>
              </View>
              <View className="items-center">
                <Text 
                  className="text-accent text-2xl"
                  style={{ fontFamily: 'Poppins_700Bold' }}
                >
                  {savedMoviesCount + savedSeriesCount}
                </Text>
                <Text 
                  className="text-light-200"
                  style={{ fontFamily: 'Poppins_600SemiBold' }}
                >
                  Total Saved
                </Text>
              </View>
            </View>
          </View>

          <View className="bg-secondary rounded-2xl p-4">
            <Text 
              className="text-white text-lg mb-4"
              style={{ fontFamily: 'Poppins_700Bold' }}
            >
              Preferences
            </Text>
            <View className="space-y-4">
              <View className="flex-row justify-between items-center">
                <Text 
                  className="text-light-200"
                  style={{ fontFamily: 'Poppins_600SemiBold' }}
                >
                  Enable Notifications
                </Text>
                <Switch
                  value={preferences.enableNotifications}
                  onValueChange={() => handleTogglePreference('enableNotifications')}
                  trackColor={{ false: '#151312', true: '#AB8BFF' }}
                  thumbColor={preferences.enableNotifications ? '#fff' : '#9CA4AB'}
                />
              </View>
              <View className="flex-row justify-between items-center">
                <Text 
                  className="text-light-200"
                  style={{ fontFamily: 'Poppins_600SemiBold' }}
                >
                  Dark Mode
                </Text>
                <Switch
                  value={preferences.darkMode}
                  onValueChange={() => handleTogglePreference('darkMode')}
                  trackColor={{ false: '#151312', true: '#AB8BFF' }}
                  thumbColor={preferences.darkMode ? '#fff' : '#9CA4AB'}
                />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
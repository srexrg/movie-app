import { View, Text, FlatList, Dimensions } from 'react-native';
import { useCallback, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { Movie } from '@/app/types/movie';
import { storageService } from '@/app/services/storage';
import MovieCard from '@/app/components/MovieCard';

export default function SavedMovies() {
  const [savedMovies, setSavedMovies] = useState<Movie[]>([]);

  // Load saved movies when the tab comes into focus
  useFocusEffect(
    useCallback(() => {
      const loadSavedMovies = async () => {
        const movies = await storageService.getSavedMovies();
        setSavedMovies(movies);
      };

      loadSavedMovies();
    }, [])
  );

  // Define number of columns as a constant
  const numColumns = 2;

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <View className="px-2 py-6">
        <Text 
          className="text-white text-2xl mb-6 px-2" 
          style={{ fontFamily: 'Poppins_700Bold' }}
        >
          Saved Movies
        </Text>

        {savedMovies.length === 0 ? (
          <View className="flex-1 items-center justify-center mt-10">
            <Text 
              className="text-light-200 text-center" 
              style={{ fontFamily: 'Poppins_600SemiBold' }}
            >
              You haven't saved any movies yet
            </Text>
          </View>
        ) : (
          <FlatList
            key={`grid-${numColumns}`}
            data={savedMovies}
            keyExtractor={(item) => item.id.toString()}
            numColumns={numColumns}
            columnWrapperStyle={{
              justifyContent: 'space-between',
              gap: 8,
            }}
            renderItem={({ item }) => (
              <View className="mb-4" style={{ width: '48%' }}>
                <MovieCard movie={item} />
              </View>
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 2, paddingBottom: 20 }}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
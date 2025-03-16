import { View, Text, FlatList, Dimensions, TouchableOpacity } from 'react-native';
import { useCallback, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { Movie, Series } from '@/app/types/movie';
import { storageService } from '@/app/services/storage';
import MovieCard from '@/app/components/MovieCard';
import SeriesCard from '@/app/components/SeriesCard';

type ContentType = 'movies' | 'series';

export default function SavedContent() {
  const [savedMovies, setSavedMovies] = useState<Movie[]>([]);
  const [savedSeries, setSavedSeries] = useState<Series[]>([]);
  const [activeTab, setActiveTab] = useState<ContentType>('movies');

  useFocusEffect(
    useCallback(() => {
      const loadSavedContent = async () => {
        const [movies, series] = await Promise.all([
          storageService.getSavedMovies(),
          storageService.getSavedSeries()
        ]);
        
        setSavedMovies(movies);
        setSavedSeries(series);
      };

      loadSavedContent();
    }, [])
  );

  const numColumns = 2;

  const renderEmptyState = (type: ContentType) => (
    <View className="flex-1 items-center justify-center mt-10">
      <Text 
        className="text-light-200 text-center" 
        style={{ fontFamily: 'Poppins_600SemiBold' }}
      >
        You haven't saved any {type} yet
      </Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <View className="flex-1 px-2 py-6">
        <Text 
          className="text-white text-2xl mb-6 px-2" 
          style={{ fontFamily: 'Poppins_700Bold' }}
        >
          Saved Content
        </Text>

        {/* Tab Navigation */}
        <View className="flex-row mb-6 bg-secondary rounded-full mx-2">
          <TouchableOpacity
            onPress={() => setActiveTab('movies')}
            className={`flex-1 py-3 px-4 rounded-full ${
              activeTab === 'movies' ? 'bg-accent' : ''
            }`}
          >
            <Text 
              className={`text-center ${
                activeTab === 'movies' ? 'text-white' : 'text-light-200'
              }`}
              style={{ fontFamily: 'Poppins_600SemiBold' }}
            >
              Movies
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab('series')}
            className={`flex-1 py-3 px-4 rounded-full ${
              activeTab === 'series' ? 'bg-accent' : ''
            }`}
          >
            <Text 
              className={`text-center ${
                activeTab === 'series' ? 'text-white' : 'text-light-200'
              }`}
              style={{ fontFamily: 'Poppins_600SemiBold' }}
            >
              TV Series
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content Based on Active Tab */}
        {activeTab === 'movies' ? (
          savedMovies.length === 0 ? (
            renderEmptyState('movies')
          ) : (
            <FlatList
              key={`movies-grid-${numColumns}`}
              data={savedMovies}
              keyExtractor={(item) => `movie-${item.id.toString()}`}
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
          )
        ) : (
          savedSeries.length === 0 ? (
            renderEmptyState('series')
          ) : (
            <FlatList
              key={`series-grid-${numColumns}`}
              data={savedSeries}
              keyExtractor={(item) => `series-${item.id.toString()}`}
              numColumns={numColumns}
              columnWrapperStyle={{
                justifyContent: 'space-between',
                gap: 8,
              }}
              renderItem={({ item }) => (
                <View className="mb-4" style={{ width: '48%' }}>
                  <SeriesCard series={item} />
                </View>
              )}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 2, paddingBottom: 20 }}
            />
          )
        )}
      </View>
    </SafeAreaView>
  );
}
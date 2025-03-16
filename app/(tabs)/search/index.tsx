import { View, Text, TextInput, FlatList, ActivityIndicator, Dimensions, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';
import { Movie, Series } from '@/app/types/movie';
import { fetchMovies, fetchSeries, tmdbApi } from '@/app/services/tmdb/api';
import MovieCard from '@/app/components/MovieCard';
import SeriesCard from '@/app/components/SeriesCard';
import useDebounce from '@/app/hooks/useDebounce';

const DEBOUNCE_DELAY = 500;
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SPACING = 16;
const NUM_COLUMNS = 2;
const ITEM_WIDTH = (SCREEN_WIDTH - 32 - (SPACING * (NUM_COLUMNS - 1))) / NUM_COLUMNS;

type ContentType = 'movies' | 'series';

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [movieResults, setMovieResults] = useState<Movie[]>([]);
  const [seriesResults, setSeriesResults] = useState<Series[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [popularSeries, setPopularSeries] = useState<Series[]>([]);
  const [isLoadingPopular, setIsLoadingPopular] = useState(true);
  const [activeTab, setActiveTab] = useState<ContentType>('movies');
  
  const debouncedQuery = useDebounce(searchQuery, DEBOUNCE_DELAY);

  useEffect(() => {
    loadPopularContent();
  }, []);

  useEffect(() => {
    if (debouncedQuery.trim()) {
      handleSearch();
    } else {
      setMovieResults([]);
      setSeriesResults([]);
      setHasSearched(false);
    }
  }, [debouncedQuery]);

  const loadPopularContent = async () => {
    try {
      const [movieData, seriesData] = await Promise.all([
        tmdbApi.getPopularMovies(),
        tmdbApi.getPopularSeries()
      ]);
      
      setPopularMovies(movieData.results);
      setPopularSeries(seriesData.results);
    } catch (error) {
      console.error('Error loading popular content:', error);
    } finally {
      setIsLoadingPopular(false);
    }
  };

  const handleSearch = async () => {
    setIsLoading(true);
    setHasSearched(true);
    
    try {
      const [movies, series] = await Promise.all([
        fetchMovies({ query: debouncedQuery }),
        fetchSeries({ query: debouncedQuery })
      ]);
      
      setMovieResults(movies);
      setSeriesResults(series);
    } catch (error) {
      console.error('Search error:', error);
      setMovieResults([]);
      setSeriesResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const hasNoResults = movieResults.length === 0 && seriesResults.length === 0 && hasSearched;
  const currentResults = activeTab === 'movies' ? movieResults : seriesResults;
  const currentPopular = activeTab === 'movies' ? popularMovies : popularSeries;

  // Helper functions to properly type the renderItem function
  const renderMovieItem = ({ item }: { item: Movie }) => (
    <MovieCard movie={item} width={ITEM_WIDTH} />
  );
  
  const renderSeriesItem = ({ item }: { item: Series }) => (
    <SeriesCard series={item} width={ITEM_WIDTH} />
  );

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <View className="flex-1 px-4">
        <View className="flex-row items-center mb-6">
          <View className="flex-1 flex-row items-center bg-secondary rounded-full px-4 py-2">
            <FontAwesome5 name="search" size={16} color="#9CA4AB" />
            <TextInput
              className="flex-1 ml-2 text-white"
              style={{ fontFamily: 'Poppins_600SemiBold' }}
              placeholder="Search movies & TV series..."
              placeholderTextColor="#9CA4AB"
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
            />
          </View>
        </View>

        {/* Tab Navigation */}
        {(hasSearched || !isLoadingPopular) && (
          <View className="flex-row mb-6 bg-secondary rounded-full">
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
        )}

        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#AB8BFF" />
          </View>
        ) : hasNoResults ? (
          <View className="flex-1 items-center justify-center">
            <Text 
              className="text-white text-xl text-center mb-2"
              style={{ fontFamily: 'Poppins_700Bold' }}
            >
              No Results Found
            </Text>
            <Text 
              className="text-light-200 text-center"
              style={{ fontFamily: 'Poppins_600SemiBold' }}
            >
              Try searching with different keywords
            </Text>
          </View>
        ) : hasSearched ? (
          activeTab === 'movies' ? (
            <FlatList
              key={`movies-search-${NUM_COLUMNS}-columns`}
              data={movieResults}
              keyExtractor={(item) => `movie-${item.id.toString()}`}
              numColumns={NUM_COLUMNS}
              columnWrapperStyle={{
                gap: SPACING,
                marginBottom: SPACING
              }}
              renderItem={renderMovieItem}
            />
          ) : (
            <FlatList
              key={`series-search-${NUM_COLUMNS}-columns`}
              data={seriesResults}
              keyExtractor={(item) => `series-${item.id.toString()}`}
              numColumns={NUM_COLUMNS}
              columnWrapperStyle={{
                gap: SPACING,
                marginBottom: SPACING
              }}
              renderItem={renderSeriesItem}
            />
          )
        ) : isLoadingPopular ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#AB8BFF" />
          </View>
        ) : (
          <>
            <Text 
              className="text-white text-xl mb-4"
              style={{ fontFamily: 'Poppins_700Bold' }}
            >
              Popular {activeTab === 'movies' ? 'Movies' : 'TV Series'}
            </Text>
            {activeTab === 'movies' ? (
              <FlatList
                key={`popular-movies-${NUM_COLUMNS}-columns`}
                data={popularMovies}
                keyExtractor={(item) => `popular-movie-${item.id.toString()}`}
                numColumns={NUM_COLUMNS}
                columnWrapperStyle={{
                  gap: SPACING,
                  marginBottom: SPACING
                }}
                renderItem={renderMovieItem}
              />
            ) : (
              <FlatList
                key={`popular-series-${NUM_COLUMNS}-columns`}
                data={popularSeries}
                keyExtractor={(item) => `popular-series-${item.id.toString()}`}
                numColumns={NUM_COLUMNS}
                columnWrapperStyle={{
                  gap: SPACING,
                  marginBottom: SPACING
                }}
                renderItem={renderSeriesItem}
              />
            )}
          </>
        )}
      </View>
    </SafeAreaView>
  );
}
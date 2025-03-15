import { View, Text, TextInput, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';
import { Movie } from '@/app/types/movie';
import { fetchMovies } from '@/app/services/tmdb/api';
import MovieCard from '@/app/components/MovieCard';

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<Movie[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    setHasSearched(true);
    
    try {
      const movies = await fetchMovies({ query: searchQuery });
      setResults(movies);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <View className="flex-1 px-4">
        <View className="flex-row items-center space-x-2 mb-6">
          <View className="flex-1 flex-row items-center bg-secondary rounded-full px-4 py-2">
            <FontAwesome5 name="search" size={16} color="#9CA4AB" />
            <TextInput
              className="flex-1 ml-2 text-white"
              style={{ fontFamily: 'Poppins_600SemiBold' }}
              placeholder="Search movies..."
              placeholderTextColor="#9CA4AB"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
            />
          </View>
          <TouchableOpacity 
            className="bg-accent px-4 py-2 rounded-full"
            onPress={handleSearch}
          >
            <Text 
              className="text-white"
              style={{ fontFamily: 'Poppins_600SemiBold' }}
            >
              Search
            </Text>
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#AB8BFF" />
          </View>
        ) : results.length > 0 ? (
          <FlatList
            data={results}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 16 }}
            renderItem={({ item }) => (
              <MovieCard movie={item} />
            )}
          />
        ) : hasSearched ? (
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
        ) : (
          <View className="flex-1 items-center justify-center">
            <Text 
              className="text-white text-xl text-center mb-2"
              style={{ fontFamily: 'Poppins_700Bold' }}
            >
              Search Movies
            </Text>
            <Text 
              className="text-light-200 text-center"
              style={{ fontFamily: 'Poppins_600SemiBold' }}
            >
              Enter keywords to find movies
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
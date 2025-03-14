import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { tmdbApi } from '@/app/services/tmdb/api';
import { storageService } from '@/app/services/storage';
import { Movie } from '@/app/types/movie';

export default function MovieDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    loadMovie();
    checkIfSaved();
  }, [id]);

  const loadMovie = async () => {
    const movieData = await tmdbApi.getMovieById(Number(id));
    if (movieData) {
      setMovie(movieData);
    }
  };

  const checkIfSaved = async () => {
    const savedMovies = await storageService.getSavedMovies();
    setIsSaved(savedMovies.some(m => m.id === Number(id)));
  };

  const handleToggleSave = async () => {
    if (!movie) return;

    if (isSaved) {
      await storageService.removeMovie(movie.id);
    } else {
      await storageService.saveMovie(movie);
    }
    setIsSaved(!isSaved);
  };

  if (!movie) {
    return (
      <SafeAreaView className="flex-1 bg-primary">
        <View className="flex-1 items-center justify-center">
          <Text className="text-white text-xl" style={{ fontFamily: 'Poppins_600SemiBold' }}>
            Movie not found
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <View className="flex-1">
        <Image
          source={{ uri: movie.backdrop_path }}
          className="w-full h-64"
          resizeMode="cover"
        />
        <TouchableOpacity
          className="absolute top-4 left-4 z-10 bg-black/50 p-2 rounded-full"
          onPress={() => router.back()}
        >
          <FontAwesome5 name="arrow-left" size={20} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          className="absolute top-4 right-4 z-10 bg-black/50 p-2 rounded-full"
          onPress={handleToggleSave}
        >
          <FontAwesome5 
            name={isSaved ? "bookmark" : "bookmark-o"} 
            size={20} 
            color="white" 
          />
        </TouchableOpacity>
        <View className="flex-1 p-4">
          <Text 
            className="text-white text-2xl mb-2" 
            style={{ fontFamily: 'Poppins_700Bold' }}
          >
            {movie.title}
          </Text>
          <Text 
            className="text-light-300 mb-4"
            style={{ fontFamily: 'Poppins_600SemiBold' }}
          >
            {movie.release_date}
          </Text>
          <Text 
            className="text-light-200" 
            style={{ fontFamily: 'Poppins_600SemiBold' }}
          >
            {movie.overview}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
import { View, Text, Image, TouchableOpacity, ScrollView, Dimensions, Platform } from 'react-native';
import { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { Movie } from '@/app/types/movie';
import { storageService } from '@/app/services/storage';
import { tmdbApi } from '@/app/services/tmdb/api';
import { GENRES } from '@/app/services/tmdb/mockData';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const POSTER_HEIGHT = SCREEN_WIDTH * 1.2;

export default function MovieDetails() {
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
          <FontAwesome5 name="film" size={48} color="#AB8BFF" />
          <Text 
            className="text-white text-xl mt-4" 
            style={{ fontFamily: 'Poppins_600SemiBold' }}
          >
            Loading movie details...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View className="flex-1 bg-primary">
      <ScrollView className="flex-1" bounces={false} showsVerticalScrollIndicator={false}>
        {/* Backdrop Image */}
        <View className="w-full" style={{ height: POSTER_HEIGHT }}>
          <Image
            source={{ uri: movie.backdrop_path }}
            className="absolute w-full h-full"
            resizeMode="cover"
          />
          <View className="absolute inset-0 bg-gradient-to-b from-transparent to-primary" />
        </View>

        {/* Header Buttons with BlurView */}
        <View className="absolute top-0 w-full z-10">
          <SafeAreaView>
            <View className="w-full flex-row justify-between items-center px-4 py-2">
              <TouchableOpacity
                onPress={() => router.back()}
                className="rounded-full overflow-hidden"
              >
                <BlurView intensity={80} tint="dark" className="p-3">
                  <FontAwesome5 name="arrow-left" size={20} color="white" />
                </BlurView>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleToggleSave}
                className="rounded-full overflow-hidden"
              >
                <BlurView intensity={80} tint="dark" className="p-3">
                  <FontAwesome5 
                    name="bookmark"
                    size={20} 
                    color="white"
                    solid={isSaved}
                  />
                </BlurView>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </View>

        {/* Content Section */}
        <View className="px-4 -mt-40">
          <Animated.View 
            entering={FadeInDown.duration(600).springify()}
            className="bg-secondary/90 backdrop-blur-xl rounded-3xl p-6 mb-6"
          >
            {/* Title and Rating */}
            <Text 
              className="text-white text-3xl mb-3" 
              style={{ fontFamily: 'Poppins_700Bold' }}
            >
              {movie.title}
            </Text>
            
            <View className="flex-row items-center space-x-4 mb-6">
              <View className="bg-accent/90 px-4 py-2 rounded-xl flex-row items-center space-x-2">
                <FontAwesome5 name="star" size={16} color="#FFD700" solid />
                <Text 
                  className="text-white text-lg font-bold ml-2"
                  style={{ fontFamily: 'Poppins_600SemiBold' }}
                >
                  {movie.vote_average.toFixed(1)}
                </Text>
              </View>
              <Text 
                className="text-light-300 text-base ml-4"
                style={{ fontFamily: 'Poppins_600SemiBold' }}
              >
                {new Date(movie.release_date).getFullYear()}
              </Text>
            </View>

            {/* Genres */}
            <View className="flex-row flex-wrap gap-2 mb-6">
              {movie.genre_ids.map(genreId => (
                <Animated.View 
                  entering={FadeIn.delay(300)}
                  key={genreId} 
                  className="bg-dark-100/50 backdrop-blur-sm px-4 py-2 rounded-xl"
                >
                  <Text 
                    className="text-light-100 text-sm"
                    style={{ fontFamily: 'Poppins_600SemiBold' }}
                  >
                    {GENRES[genreId]}
                  </Text>
                </Animated.View>
              ))}
            </View>

            {/* Overview */}
            <View>
              <Text 
                className="text-white text-xl mb-3"
                style={{ fontFamily: 'Poppins_700Bold' }}
              >
                Overview
              </Text>
              <Text 
                className="text-light-200 text-base leading-6"
                style={{ fontFamily: 'Poppins_400Regular' }}
              >
                {movie.overview}
              </Text>
            </View>
          </Animated.View>
        </View>
      </ScrollView>
    </View>
  );
}
import { ScrollView, View, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import MovieSection from "../../components/MovieSection";
import { Movie } from "../../types/movie";
import { tmdbApi } from "../../services/tmdb/api";

export default function HomeScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [movies, setMovies] = useState<{
    topRated: Movie[];
    popular: Movie[];
    upcoming: Movie[];
  }>({
    topRated: [],
    popular: [],
    upcoming: []
  });

  useEffect(() => {
    async function loadMovies() {
      try {
        const [topRated, popular, upcoming] = await Promise.all([
          tmdbApi.getTopRatedMovies(),
          tmdbApi.getPopularMovies(),
          tmdbApi.getUpcomingMovies()
        ]);

        setMovies({
          topRated: topRated.results,
          popular: popular.results,
          upcoming: upcoming.results
        });
      } catch (error) {
        console.error('Failed to load movies:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadMovies();
  }, []);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-primary">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#AB8BFF" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="py-4">
          <MovieSection 
            title="Top Rated Movies" 
            movies={movies.topRated} 
          />
          <MovieSection 
            title="Popular Movies" 
            movies={movies.popular} 
          />
          <MovieSection 
            title="Upcoming Movies" 
            movies={movies.upcoming} 
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
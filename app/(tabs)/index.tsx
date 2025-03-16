import { ScrollView, View, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import MovieSection from "../components/MovieSection";
import SeriesSection from "../components/SeriesSection";
import TrendingSection from "../components/TrendingSection";
import { Movie, TrendingMovie, Series, TrendingSeries } from "../types/movie";
import { tmdbApi } from "../services/tmdb/api";

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);
  const [movies, setMovies] = useState<{
    topRated: Movie[];
    popular: Movie[];
    upcoming: Movie[];
    trending: TrendingMovie[];
  }>({
    topRated: [],
    popular: [],
    upcoming: [],
    trending: []
  });
  
  const [series, setSeries] = useState<{
    topRated: Series[];
    popular: Series[];
    onTheAir: Series[];
    trending: TrendingSeries[];
  }>({
    topRated: [],
    popular: [],
    onTheAir: [],
    trending: []
  });

  useEffect(() => {
    async function loadContent() {
      try {
        const [
          topRatedMovies, 
          popularMovies, 
          upcomingMovies, 
          trendingMovies,
          topRatedSeries,
          popularSeries,
          onTheAirSeries,
          trendingSeries
        ] = await Promise.all([
          tmdbApi.getTopRatedMovies(),
          tmdbApi.getPopularMovies(),
          tmdbApi.getUpcomingMovies(),
          tmdbApi.getTrendingMovies(),
          tmdbApi.getTopRatedSeries(),
          tmdbApi.getPopularSeries(),
          tmdbApi.getOnTheAirSeries(),
          tmdbApi.getTrendingSeries()
        ]);

        setMovies({
          topRated: topRatedMovies.results,
          popular: popularMovies.results,
          upcoming: upcomingMovies.results,
          trending: trendingMovies
        });

        setSeries({
          topRated: topRatedSeries.results,
          popular: popularSeries.results,
          onTheAir: onTheAirSeries.results,
          trending: trendingSeries
        });

      } catch (error) {
        console.error('Failed to load content:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadContent();
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
          {/* Movie Sections */}
          {movies.trending.length > 0 && (
            <TrendingSection trending={movies.trending} />
          )}
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

          {/* Series Sections */}
          <SeriesSection 
            title="Top Rated Series" 
            series={series.topRated} 
          />
          <SeriesSection 
            title="Popular Series" 
            series={series.popular} 
          />
          <SeriesSection 
            title="On The Air Series" 
            series={series.onTheAir} 
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

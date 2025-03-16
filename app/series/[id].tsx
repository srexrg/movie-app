import { View, Text, Image, TouchableOpacity, ScrollView, Dimensions, Platform, FlatList } from 'react-native';
import { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { WebView } from 'react-native-webview';
import { Series, SeriesDetails, MovieVideo, MovieCredit } from '@/app/types/movie';
import { storageService } from '@/app/services/storage';
import { fetchSeriesDetails, tmdbApi } from '@/app/services/tmdb/api';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const POSTER_HEIGHT = SCREEN_WIDTH * 1.2;
const DEFAULT_POSTER = "https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-38-picture-grey-c2ebdbb057f2a7614185931650f8cee23fa137b93812ccb132b9df511df1cfac.svg";

export default function SeriesDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [series, setSeries] = useState<Series | null>(null);
  const [seriesDetails, setSeriesDetails] = useState<SeriesDetails | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);
  const [selectedTrailer, setSelectedTrailer] = useState<MovieVideo | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSeries();
    checkIfSaved();
  }, [id]);

  const loadSeries = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const details = await fetchSeriesDetails(Number(id));
      setSeriesDetails(details);
      
      const seriesData = await tmdbApi.getSeriesById(Number(id));
      if (seriesData) {
        setSeries(seriesData);
      }

      // Find the official trailer
      if (details.videos?.results) {
        const trailer = details.videos.results.find(
          video => video.type === "Trailer" && video.site === "YouTube" && video.official
        ) || details.videos.results[0];
        setSelectedTrailer(trailer);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load series details';
      console.error('Error loading series:', errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const checkIfSaved = async () => {
    try {
      // Note: We'll need to update storage service to handle series
      const savedSeries = await storageService.getSavedSeries?.() || [];
      setIsSaved(savedSeries.some(s => s.id === Number(id)));
    } catch (error) {
      console.error('Error checking saved status:', error);
    }
  };

  const handleToggleSave = async () => {
    if (!series) return;

    try {
      // Note: We'll need to update storage service to handle series
      if (isSaved) {
        await storageService.removeSeries?.(series.id);
      } else {
        await storageService.saveSeries?.(series);
      }
      setIsSaved(!isSaved);
    } catch (error) {
      console.error('Error toggling save:', error);
    }
  };

  const renderCastMember = ({ item }: { item: MovieCredit }) => (
    <TouchableOpacity 
      onPress={() => router.push(`/movies/person/${item.id}`)}
      className="mr-4 items-center w-24"
    >
      <View className="w-24 h-24 rounded-full overflow-hidden mb-2">
        {item.profile_path ? (
          <Image
            source={{ uri: item.profile_path }}
            className="w-full h-full"
            resizeMode="cover"
          />
        ) : (
          <View className="w-full h-full bg-secondary items-center justify-center">
            <FontAwesome5 name="user" size={24} color="#9CA4AB" />
          </View>
        )}
      </View>
      <Text 
        className="text-white text-sm text-center" 
        numberOfLines={2}
        style={{ fontFamily: 'Poppins_600SemiBold' }}
      >
        {item.name}
      </Text>
      <Text 
        className="text-light-200 text-xs text-center" 
        numberOfLines={1}
        style={{ fontFamily: 'Poppins_400Regular' }}
      >
        {item.character}
      </Text>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-primary">
        <View className="flex-1 items-center justify-center">
          <FontAwesome5 name="film" size={48} color="#AB8BFF" />
          <Text 
            className="text-white text-xl mt-4" 
            style={{ fontFamily: 'Poppins_600SemiBold' }}
          >
            Loading series details...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-primary">
        <View className="flex-1">
          <TouchableOpacity
            className="absolute top-4 left-4 z-10 bg-black/50 p-2 rounded-full"
            onPress={() => router.back()}
          >
            <FontAwesome5 name="arrow-left" size={20} color="white" />
          </TouchableOpacity>
          <View className="flex-1 items-center justify-center p-4">
            <FontAwesome5 name="exclamation-circle" size={48} color="#AB8BFF" />
            <Text 
              className="text-white text-xl mt-4 text-center" 
              style={{ fontFamily: 'Poppins_600SemiBold' }}
            >
              {error}
            </Text>
            <TouchableOpacity
              onPress={loadSeries}
              className="mt-6 bg-accent px-6 py-3 rounded-full"
            >
              <Text 
                className="text-white" 
                style={{ fontFamily: 'Poppins_600SemiBold' }}
              >
                Try Again
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (!series || !seriesDetails) {
    return (
      <SafeAreaView className="flex-1 bg-primary">
        <View className="flex-1 items-center justify-center">
          <Text className="text-white text-xl" style={{ fontFamily: 'Poppins_600SemiBold' }}>
            Series not found
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View className="flex-1 bg-primary">
      {showTrailer && selectedTrailer ? (
        <View className="flex-1">
          <SafeAreaView>
            <TouchableOpacity
              onPress={() => setShowTrailer(false)}
              className="p-4"
            >
              <FontAwesome5 name="times" size={24} color="white" />
            </TouchableOpacity>
          </SafeAreaView>
          <WebView
            source={{ uri: `https://www.youtube.com/embed/${selectedTrailer.key}` }}
            style={{ flex: 1 }}
          />
        </View>
      ) : (
        <ScrollView className="flex-1" bounces={false} showsVerticalScrollIndicator={false}>
          {/* Backdrop Image */}
          <View className="w-full" style={{ height: POSTER_HEIGHT }}>
            <Image
              source={{ 
                uri: (seriesDetails?.backdrop_path || series?.backdrop_path) || DEFAULT_POSTER 
              }}
              className="absolute w-full h-full"
              resizeMode={(seriesDetails?.backdrop_path || series?.backdrop_path) ? "cover" : "contain"}
              style={!(seriesDetails?.backdrop_path || series?.backdrop_path) ? { padding: 32 } : undefined}
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
                {seriesDetails.name}
              </Text>
              
              <View className="flex-row items-center space-x-4 mb-6">
                <View className="bg-accent/90 px-4 py-2 rounded-xl flex-row items-center space-x-2">
                  <FontAwesome5 name="star" size={16} color="#FFD700" solid />
                  <Text 
                    className="text-white text-lg font-bold ml-2"
                    style={{ fontFamily: 'Poppins_600SemiBold' }}
                  >
                    {seriesDetails.vote_average.toFixed(1)}
                  </Text>
                </View>
                <Text 
                  className="text-light-300 text-base ml-4"
                  style={{ fontFamily: 'Poppins_600SemiBold' }}
                >
                  {new Date(seriesDetails.first_air_date).getFullYear()}
                  {seriesDetails.episode_run_time?.length ? ` • ${seriesDetails.episode_run_time[0]}m` : ''}
                </Text>
              </View>

              {/* Series Info */}
              <View className="flex-row flex-wrap mb-4">
                <Text 
                  className="text-light-200 text-base"
                  style={{ fontFamily: 'Poppins_600SemiBold' }}
                >
                  {seriesDetails.number_of_seasons} Season{seriesDetails.number_of_seasons !== 1 ? 's' : ''}, {seriesDetails.number_of_episodes} Episode{seriesDetails.number_of_episodes !== 1 ? 's' : ''}
                </Text>
              </View>

              {/* Trailer Button */}
              {selectedTrailer && (
                <TouchableOpacity
                  onPress={() => setShowTrailer(true)}
                  className="bg-accent mb-6 p-4 rounded-xl flex-row items-center justify-center"
                >
                  <FontAwesome5 name="play" size={16} color="white" solid />
                  <Text 
                    className="text-white text-lg ml-2"
                    style={{ fontFamily: 'Poppins_600SemiBold' }}
                  >
                    Watch Trailer
                  </Text>
                </TouchableOpacity>
              )}

              {/* Genres */}
              <View className="flex-row flex-wrap gap-2 mb-6">
                {seriesDetails.genres.map(genre => (
                  <Animated.View 
                    entering={FadeIn.delay(300)}
                    key={genre.id} 
                    className="bg-dark-100/50 backdrop-blur-sm px-4 py-2 rounded-xl"
                  >
                    <Text 
                      className="text-light-100 text-sm"
                      style={{ fontFamily: 'Poppins_600SemiBold' }}
                    >
                      {genre.name}
                    </Text>
                  </Animated.View>
                ))}
              </View>

              {/* Tagline if available */}
              {seriesDetails.tagline && (
                <View className="mb-4">
                  <Text 
                    className="text-accent italic text-base"
                    style={{ fontFamily: 'Poppins_600SemiBold' }}
                  >
                    "{seriesDetails.tagline}"
                  </Text>
                </View>
              )}

              {/* Overview */}
              <View className="mb-6">
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
                  {seriesDetails.overview || 'No overview available.'}
                </Text>
              </View>

              {/* Created By */}
              {seriesDetails.created_by && seriesDetails.created_by.length > 0 && (
                <View className="mb-6">
                  <Text 
                    className="text-white text-xl mb-3"
                    style={{ fontFamily: 'Poppins_700Bold' }}
                  >
                    Created By
                  </Text>
                  <View className="flex-row flex-wrap">
                    {seriesDetails.created_by.map((creator, index) => (
                      <Text 
                        key={creator.id} 
                        className="text-light-200 text-base"
                        style={{ fontFamily: 'Poppins_400Regular' }}
                      >
                        {creator.name}
                        {index < seriesDetails.created_by.length - 1 ? ', ' : ''}
                      </Text>
                    ))}
                  </View>
                </View>
              )}

              {/* Cast */}
              {seriesDetails.credits?.cast && seriesDetails.credits.cast.length > 0 && (
                <View className="mb-6">
                  <Text 
                    className="text-white text-xl mb-4"
                    style={{ fontFamily: 'Poppins_700Bold' }}
                  >
                    Cast
                  </Text>
                  <FlatList
                    data={seriesDetails.credits.cast.slice(0, 10)}
                    renderItem={renderCastMember}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                  />
                </View>
              )}

              {/* Season Info */}
              {seriesDetails.seasons && seriesDetails.seasons.length > 0 && (
                <View className="mb-6">
                  <Text 
                    className="text-white text-xl mb-3"
                    style={{ fontFamily: 'Poppins_700Bold' }}
                  >
                    Seasons
                  </Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {seriesDetails.seasons
                      .filter(season => season.season_number > 0) // Filter out special seasons
                      .map(season => (
                        <View key={season.id} className="mr-8 w-32">
                          <Image
                            source={{ 
                              uri: season.poster_path || DEFAULT_POSTER 
                            }}
                            style={{ width: 128, height: 192, borderRadius: 16 }}
                            resizeMode="cover"
                          />
                          <Text 
                            className="text-white text-sm mt-2"
                            style={{ fontFamily: 'Poppins_600SemiBold' }}
                          >
                            {season.name}
                          </Text>
                          <Text 
                            className="text-light-200 text-xs"
                            style={{ fontFamily: 'Poppins_400Regular' }}
                          >
                            {season.episode_count} episode{season.episode_count !== 1 ? 's' : ''}
                          </Text>
                        </View>
                      ))
                    }
                  </ScrollView>
                </View>
              )}

              {/* Networks */}
              {seriesDetails.networks && seriesDetails.networks.length > 0 && (
                <View>
                  <Text 
                    className="text-white text-xl mb-3"
                    style={{ fontFamily: 'Poppins_700Bold' }}
                  >
                    Network
                  </Text>
                  <View className="flex-row flex-wrap">
                    {seriesDetails.networks.map((network, index) => (
                      <Text 
                        key={network.id} 
                        className="text-light-200 text-base"
                        style={{ fontFamily: 'Poppins_400Regular' }}
                      >
                        {network.name}
                        {index < seriesDetails.networks.length - 1 ? ', ' : ''}
                      </Text>
                    ))}
                  </View>
                </View>
              )}
            </Animated.View>
          </View>
        </ScrollView>
      )}
    </View>
  );
}
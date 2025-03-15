import { View, Text, Image, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { useEffect, useState } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { PersonDetails } from '@/app/types/movie';
import { tmdbApi } from '@/app/services/tmdb/api';

const DEFAULT_MOVIE_POSTER = "https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-38-picture-grey-c2ebdbb057f2a7614185931650f8cee23fa137b93812ccb132b9df511df1cfac.svg";
const DEFAULT_AVATAR = "https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-4-user-grey-d8fe957375e70239d6abdd549fd7568c89281b2179b5f4470e2e12895792dfa5.svg";

export default function PersonDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [person, setPerson] = useState<PersonDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPersonDetails();
  }, [id]);

  const loadPersonDetails = async () => {
    try {
      const details = await tmdbApi.getPersonDetails(Number(id));
      setPerson(details);
    } catch (error) {
      console.error('Error loading person details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date: string | null) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderMovie = ({ item }: { item: PersonDetails['combined_credits']['cast'][0] }) => {
    const hasValidPosterPath = item.poster_path && item.poster_path.length > 0;
    
    return (
      <TouchableOpacity 
        onPress={() => router.push(`/movies/${item.id}`)}
        className="mr-4 w-32"
      >
        <View className="relative">
          {hasValidPosterPath ? (
            <Image
              source={{ uri: item.poster_path || DEFAULT_MOVIE_POSTER }}
              className="w-32 h-48 rounded-xl"
              resizeMode="cover"
            />
          ) : (
            <View className="w-32 h-48 rounded-xl bg-secondary items-center justify-center">
              <FontAwesome5 name="film" size={24} color="#9CA4AB" />
              <Text className="text-light-200 text-xs text-center mt-2 px-2" style={{ fontFamily: 'Poppins_400Regular' }}>
                No poster
              </Text>
            </View>
          )}
          <View className="absolute bottom-1 right-1 bg-accent px-2 py-1 rounded-lg">
            <Text className="text-white font-bold text-xs">
              {item.vote_average.toFixed(1)}
            </Text>
          </View>
        </View>
        <Text 
          numberOfLines={2} 
          className="text-white mt-2 text-sm"
          style={{ fontFamily: 'Poppins_600SemiBold' }}
        >
          {item.title}
        </Text>
        <Text 
          className="text-light-200 text-xs"
          style={{ fontFamily: 'Poppins_400Regular' }}
        >
          as {item.character}
        </Text>
      </TouchableOpacity>
    );
  };

  if (isLoading || !person) {
    return (
      <SafeAreaView className="flex-1 bg-primary">
        <View className="flex-1 items-center justify-center">
          <FontAwesome5 name="user" size={48} color="#AB8BFF" />
          <Text 
            className="text-white text-xl mt-4" 
            style={{ fontFamily: 'Poppins_600SemiBold' }}
          >
            Loading...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View className="flex-1 bg-primary">
      <ScrollView className="flex-1">
        {/* Header with back button */}
        <View className="absolute top-0 w-full z-10">
          <SafeAreaView>
            <TouchableOpacity
              onPress={() => router.back()}
              className="m-4 rounded-full overflow-hidden w-10"
            >
              <BlurView intensity={80} tint="dark" className="p-2">
                <FontAwesome5 name="arrow-left" size={20} color="white" />
              </BlurView>
            </TouchableOpacity>
          </SafeAreaView>
        </View>

        {/* Profile Section */}
        <View className="items-center pt-20 pb-6">
          <View className="w-48 h-48 rounded-full overflow-hidden mb-4">
            <Image
              source={{ uri: person.profile_path || DEFAULT_AVATAR }}
              className="w-full h-full"
              resizeMode={person.profile_path ? "cover" : "contain"}
              style={!person.profile_path ? { backgroundColor: '#151312', padding: 32 } : undefined}
            />
          </View>
          <Text 
            className="text-white text-3xl text-center px-4" 
            style={{ fontFamily: 'Poppins_700Bold' }}
          >
            {person.name}
          </Text>
          <Text 
            className="text-light-200 text-lg mt-1"
            style={{ fontFamily: 'Poppins_600SemiBold' }}
          >
            {person.known_for_department}
          </Text>
        </View>

        {/* Details Section */}
        <Animated.View 
          entering={FadeInDown.duration(600).springify()}
          className="bg-secondary/90 backdrop-blur-xl rounded-t-3xl p-6"
        >
          {/* Personal Info */}
          <View className="mb-6">
            <Text 
              className="text-white text-xl mb-4"
              style={{ fontFamily: 'Poppins_700Bold' }}
            >
              Personal Info
            </Text>
            <View className="space-y-3">
              <View>
                <Text 
                  className="text-light-100 text-sm"
                  style={{ fontFamily: 'Poppins_600SemiBold' }}
                >
                  Born
                </Text>
                <Text 
                  className="text-white text-base"
                  style={{ fontFamily: 'Poppins_400Regular' }}
                >
                  {formatDate(person.birthday)}
                  {person.place_of_birth ? ` in ${person.place_of_birth}` : ''}
                </Text>
              </View>
              {person.deathday && (
                <View>
                  <Text 
                    className="text-light-100 text-sm"
                    style={{ fontFamily: 'Poppins_600SemiBold' }}
                  >
                    Died
                  </Text>
                  <Text 
                    className="text-white text-base"
                    style={{ fontFamily: 'Poppins_400Regular' }}
                  >
                    {formatDate(person.deathday)}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Biography */}
          {person.biography && (
            <View className="mb-6">
              <Text 
                className="text-white text-xl mb-4"
                style={{ fontFamily: 'Poppins_700Bold' }}
              >
                Biography
              </Text>
              <Text 
                className="text-light-200 text-base leading-6"
                style={{ fontFamily: 'Poppins_400Regular' }}
              >
                {person.biography}
              </Text>
            </View>
          )}

          {/* Known For */}
          {person.combined_credits?.cast && person.combined_credits.cast.length > 0 && (
            <View className="mb-6">
              <Text 
                className="text-white text-xl mb-4"
                style={{ fontFamily: 'Poppins_700Bold' }}
              >
                Known For
              </Text>
              <FlatList
                data={person.combined_credits.cast
                  .filter(movie => movie.title && movie.title.trim().length > 0)
                  .sort((a, b) => b.vote_average - a.vote_average)
                  .slice(0, 10)
                }
                keyExtractor={(item) => `${item.id}-${item.character}`}
                renderItem={renderMovie}
                horizontal
                showsHorizontalScrollIndicator={false}
              />
            </View>
          )}
        </Animated.View>
      </ScrollView>
    </View>
  );
}
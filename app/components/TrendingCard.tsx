import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { TrendingCardProps } from '@/app/types/movie';
import { FontAwesome5 } from '@expo/vector-icons';

const DEFAULT_MOVIE_POSTER = "https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-38-picture-grey-c2ebdbb057f2a7614185931650f8cee23fa137b93812ccb132b9df511df1cfac.svg";

export default function TrendingCard({ movie, index }: TrendingCardProps) {
  const hasValidPosterUrl = movie.poster_url && movie.poster_url.length > 0;
  
  return (
    <Link href={`/movies/${movie.movie_id}`} asChild>
      <TouchableOpacity className="mr-8 w-36">
        <View className="relative">
          <Image
            source={{ uri: hasValidPosterUrl ? movie.poster_url : DEFAULT_MOVIE_POSTER }}
            style={styles.posterImage}
            resizeMode={hasValidPosterUrl ? "cover" : "contain"}
            className={!hasValidPosterUrl ? "bg-secondary p-4" : ""}
          />
          <View 
            className="absolute top-2 left-2 bg-accent/80 px-2 py-1 rounded-lg"
            style={{ opacity: index === 0 ? 1 : 0.8 }}
          >
            <Text 
              className="text-white font-bold text-xs"
              style={{ fontFamily: 'Poppins_700Bold' }}
            >
              #{index + 1}
            </Text>
          </View>
          <View className="absolute bottom-1 right-1 bg-dark-100/80 px-2 py-1 rounded-lg flex-row items-center">
            <FontAwesome5 name="users" size={10} color="white" solid />
            <Text className="text-white font-bold text-xs ml-1">
              {movie.count > 1000 ? `${(movie.count/1000).toFixed(1)}k` : movie.count}
            </Text>
          </View>
        </View>
        <Text 
          numberOfLines={2} 
          className="text-white mt-2 text-sm"
          style={{ fontFamily: 'Poppins_600SemiBold' }}
        >
          {movie.title}
        </Text>
      </TouchableOpacity>
    </Link>
  );
}

const styles = StyleSheet.create({
  posterImage: {
    width: 144,
    height: 216, 
    borderRadius: 16 
  }
});
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { Movie } from '../types/movie';

const DEFAULT_MOVIE_POSTER = "https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-38-picture-grey-c2ebdbb057f2a7614185931650f8cee23fa137b93812ccb132b9df511df1cfac.svg";

interface MovieCardProps {
  movie: Movie;
  width?: number;
}

export default function MovieCard({ movie, width = 128 }: MovieCardProps) {
  const imageHeight = (width / 2) * 3; // maintain 2:3 aspect ratio
  const hasValidPosterPath = movie.poster_path && movie.poster_path.length > 0;

  return (
    <Link href={`/movies/${movie.id}`} asChild>
      <TouchableOpacity style={{ width }}>
        <View className="relative">
          <Image
            source={{ uri: hasValidPosterPath ? movie.poster_path : DEFAULT_MOVIE_POSTER }}
            style={{ width, height: imageHeight, borderRadius: 16 }}
            resizeMode={hasValidPosterPath ? "cover" : "contain"}
            className={!hasValidPosterPath ? "bg-secondary p-4" : ""}
          />
          <View className="absolute bottom-1 right-1 bg-accent px-2 py-1 rounded-lg">
            <Text className="text-white font-bold text-xs">
              {movie.vote_average.toFixed(1)}
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
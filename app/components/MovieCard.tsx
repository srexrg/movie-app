import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { Movie } from '../types/movie';

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <Link href={`/movies/${movie.id}`} asChild>
      <TouchableOpacity className="mr-4 w-32">
        <View className="relative">
          <Image
            source={{ uri: movie.poster_path }}
            className="w-32 h-48 rounded-2xl"
            resizeMode="cover"
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
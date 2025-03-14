import { View, Text, ScrollView } from 'react-native';
import { Movie } from '../types/movie';
import MovieCard from './MovieCard';

interface MovieSectionProps {
  title: string;
  movies: Movie[];
}

export default function MovieSection({ title, movies }: MovieSectionProps) {
  return (
    <View className="mb-8">
      <Text 
        className="text-white text-xl mb-4 px-4"
        style={{ fontFamily: 'Poppins_700Bold' }}
      >
        {title}
      </Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
      >
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </ScrollView>
    </View>
  );
}
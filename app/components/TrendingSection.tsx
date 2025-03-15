
import { View, Text, ScrollView } from 'react-native';
import { TrendingMovie } from '../types/movie';
import TrendingCard from './TrendingCard';

interface TrendingSectionProps {
  trending: TrendingMovie[];
}

export default function TrendingSection({ trending }: TrendingSectionProps) {
  return (
    <View className="mb-8">
      <Text 
        className="text-white text-xl mb-4 px-4"
        style={{ fontFamily: 'Poppins_700Bold' }}
      >
        Trending This Week
      </Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
      >
        {trending.map((movie, index) => (
          <TrendingCard key={movie.movie_id} movie={movie} index={index} />
        ))}
      </ScrollView>
    </View>
  );
}
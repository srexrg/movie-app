import { View, Text, ScrollView } from 'react-native';
import { Series } from '../types/movie';
import SeriesCard from './SeriesCard';

interface SeriesSectionProps {
  title: string;
  series: Series[];
}

export default function SeriesSection({ title, series }: SeriesSectionProps) {
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
        {series.map((item) => (
          <SeriesCard key={item.id} series={item} />
        ))}
      </ScrollView>
    </View>
  );
}
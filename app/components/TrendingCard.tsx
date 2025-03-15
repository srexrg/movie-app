// filepath: c:\Sreerag\tmdb-app\app\components\TrendingCard.tsx
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { TrendingCardProps } from '@/app/types/movie';
import { FontAwesome5 } from '@expo/vector-icons';
import { useState } from 'react';

export default function TrendingCard({ movie, index }: TrendingCardProps) {
  const [imageError, setImageError] = useState(false);
  
  
  return (
    <Link href={`/movies/${movie.movie_id}`} asChild>
      <TouchableOpacity className="mr-8 w-36">
        <View className="relative">
          {!imageError ? (
            <Image
              source={{ uri: movie.poster_url }}
              style={styles.posterImage}
              resizeMode="cover"
              onError={(e) => {
                console.error(`Failed to load image for ${movie.title}: ${e.nativeEvent.error}`);
                setImageError(true);
              }}
            />
          ) : (
            <View style={[styles.posterImage, styles.fallbackContainer]}>
              <FontAwesome5 name="image" size={24} color="#9CA4AB" />
              <Text className="text-light-200 text-xs text-center mt-2 px-2">
                Image not available
              </Text>
            </View>
          )}
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
    width: 144, // w-36 = 144px
    height: 216, // Aspect ratio of 3:2 (1.5x the width)
    borderRadius: 16 // rounded-2xl
  },
  fallbackContainer: {
    backgroundColor: '#1F2937', // bg-secondary
    alignItems: 'center',
    justifyContent: 'center',
  }
});
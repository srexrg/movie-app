import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MovieSection from "../components/MovieSection";
import { mockTopMovies } from "../services/tmdb/mockData";

export default function Index() {
  return (
    <SafeAreaView className="flex-1 bg-primary">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="py-4">
          <MovieSection 
            title="Top Rated Movies" 
            movies={mockTopMovies.results} 
          />
          <MovieSection 
            title="Popular Movies" 
            movies={mockTopMovies.results} 
          />
          <MovieSection 
            title="Upcoming Movies" 
            movies={mockTopMovies.results} 
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

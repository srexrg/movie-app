import { MovieResponse } from "@/app/types/movie";
import { mockTopMovies } from "./mockData";

const tmdbApi = {
  getTopRatedMovies: async (): Promise<MovieResponse> => {
    // TODO: Replace with actual API call
    return mockTopMovies;
  },
  
  getPopularMovies: async (): Promise<MovieResponse> => {
    // TODO: Replace with actual API call
    return mockTopMovies;
  },
  
  getUpcomingMovies: async (): Promise<MovieResponse> => {
    // TODO: Replace with actual API call
    return mockTopMovies;
  },
  
  getMovieById: async (id: number) => {
    // TODO: Replace with actual API call
    return mockTopMovies.results.find(movie => movie.id === id);
  }
};

export { tmdbApi };
export default tmdbApi;
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Movie } from '@/app/types/movie';

const STORAGE_KEYS = {
  SAVED_MOVIES: 'saved_movies',
  USER_PREFERENCES: 'user_preferences',
  USER_NAME: 'user_name',
};

const storageService = {

  getSavedMovies: async (): Promise<Movie[]> => {
    try {
      const savedMovies = await AsyncStorage.getItem(STORAGE_KEYS.SAVED_MOVIES);
      return savedMovies ? JSON.parse(savedMovies) : [];
    } catch (error) {
      console.error('Error getting saved movies:', error);
      return [];
    }
  },

  saveMovie: async (movie: Movie): Promise<boolean> => {
    try {
      const savedMovies = await storageService.getSavedMovies();
      if (!savedMovies.find(m => m.id === movie.id)) {
        await AsyncStorage.setItem(
          STORAGE_KEYS.SAVED_MOVIES, 
          JSON.stringify([...savedMovies, movie])
        );
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error saving movie:', error);
      return false;
    }
  },

  removeMovie: async (movieId: number): Promise<boolean> => {
    try {
      const savedMovies = await storageService.getSavedMovies();
      const updatedMovies = savedMovies.filter(movie => movie.id !== movieId);
      await AsyncStorage.setItem(
        STORAGE_KEYS.SAVED_MOVIES,
        JSON.stringify(updatedMovies)
      );
      return true;
    } catch (error) {
      console.error('Error removing movie:', error);
      return false;
    }
  },


  getUserPreferences: async () => {
    try {
      const preferences = await AsyncStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
      return preferences ? JSON.parse(preferences) : {};
    } catch (error) {
      console.error('Error getting user preferences:', error);
      return {};
    }
  },

  setUserPreferences: async (preferences: object): Promise<boolean> => {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.USER_PREFERENCES,
        JSON.stringify(preferences)
      );
      return true;
    } catch (error) {
      console.error('Error setting user preferences:', error);
      return false;
    }
  },


  getUserName: async (): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.USER_NAME);
    } catch (error) {
      console.error('Error getting user name:', error);
      return null;
    }
  },

  setUserName: async (name: string): Promise<boolean> => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_NAME, name);
      return true;
    } catch (error) {
      console.error('Error setting user name:', error);
      return false;
    }
  },
};

export { storageService };
export default storageService;
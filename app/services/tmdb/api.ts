import { Movie, MovieDetails, MovieResponse, TrendingMovie, MovieCredit,PersonDetails } from "@/app/types/movie";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/";
const POSTER_SIZE = "w500";
const BACKDROP_SIZE = "original";
const PROFILE_SIZE = "w185";

export const TMDB_CONFIG = {
  BASE_URL: "https://api.themoviedb.org/3",
  API_KEY: process.env.EXPO_PUBLIC_MOVIE_API_KEY,
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${process.env.EXPO_PUBLIC_MOVIE_API_KEY}`,
  },
};


const formatImageUrl = (path: string | null, size: string): string => {
  if (!path) return "";

  if (path.startsWith("http")) return path;
  return `${IMAGE_BASE_URL}${size}${path}`;
};

export const fetchMovies = async ({
  query,
}: {
  query: string;
}): Promise<Movie[]> => {
  const endpoint = query
    ? `${TMDB_CONFIG.BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
    : `${TMDB_CONFIG.BASE_URL}/discover/movie?sort_by=popularity.desc`;

  const response = await fetch(endpoint, {
    method: "GET",
    headers: TMDB_CONFIG.headers,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch movies: ${response.statusText}`);
  }

  const data = await response.json();
  return data.results.map((movie: any) => ({
    ...movie,
    poster_path: formatImageUrl(movie.poster_path, POSTER_SIZE),
    backdrop_path: formatImageUrl(movie.backdrop_path, BACKDROP_SIZE),
  }));
};

export const fetchMovieDetails = async (
  movieId: string | number
): Promise<MovieDetails> => {
  try {
    const response = await fetch(
      `${TMDB_CONFIG.BASE_URL}/movie/${movieId}?append_to_response=credits,videos`,
      {
        method: "GET",
        headers: TMDB_CONFIG.headers,
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Movie not found (ID: ${movieId})`);
      }
      const errorData = await response.json();
      throw new Error(errorData.status_message || `Failed to fetch movie details: ${response.statusText}`);
    }

    const data = await response.json();
    if (!data) {
      throw new Error(`No data received for movie ID: ${movieId}`);
    }

    // Format image paths
    if (data.poster_path) {
      data.poster_path = formatImageUrl(data.poster_path, POSTER_SIZE);
    }
    
    if (data.backdrop_path) {
      data.backdrop_path = formatImageUrl(data.backdrop_path, BACKDROP_SIZE);
    }
    
    if (data.belongs_to_collection && data.belongs_to_collection.poster_path) {
      data.belongs_to_collection.poster_path = formatImageUrl(
        data.belongs_to_collection.poster_path,
        POSTER_SIZE
      );
      data.belongs_to_collection.backdrop_path = formatImageUrl(
        data.belongs_to_collection.backdrop_path,
        BACKDROP_SIZE
      );
    }


    if (data.credits?.cast) {
      data.credits.cast = data.credits.cast.map((castMember: MovieCredit) => ({
        ...castMember,
        profile_path: formatImageUrl(castMember.profile_path, PROFILE_SIZE)
      }));
    }
    
    return data;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    throw error;
  }
};

export const fetchTrendingMovies = async (): Promise<TrendingMovie[]> => {
  try {
    const response = await fetch(
      `${TMDB_CONFIG.BASE_URL}/trending/movie/week`,
      {
        method: "GET",
        headers: TMDB_CONFIG.headers,
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch trending movies: ${response.statusText}`);
    }

    const data = await response.json();
    
    return data.results.map((movie: any, index: number) => {

      const posterUrl = formatImageUrl(movie.poster_path, POSTER_SIZE);
      
      return {
        searchTerm: "trending",
        movie_id: movie.id,
        title: movie.title,
        count: movie.vote_count,
        poster_url: posterUrl,
      }
    });
  } catch (error) {
    console.error("Error fetching trending movies:", error);
    throw error;
  }
};

export const fetchPersonDetails = async (personId: number): Promise<PersonDetails> => {
  try {
    const response = await fetch(
      `${TMDB_CONFIG.BASE_URL}/person/${personId}?append_to_response=combined_credits`,
      {
        method: "GET",
        headers: TMDB_CONFIG.headers,
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch person details: ${response.statusText}`);
    }

    const data = await response.json();

    // Format image URLs
    if (data.profile_path) {
      data.profile_path = formatImageUrl(data.profile_path, PROFILE_SIZE);
    }

    if (data.combined_credits?.cast) {
      data.combined_credits.cast = data.combined_credits.cast.map((movie: any) => ({
        ...movie,
        poster_path: formatImageUrl(movie.poster_path, POSTER_SIZE),
      }));
    }

    return data;
  } catch (error) {
    console.error("Error fetching person details:", error);
    throw error;
  }
};

const tmdbApi = {
  getTopRatedMovies: async (): Promise<MovieResponse> => {
    try {
      const response = await fetch(
        `${TMDB_CONFIG.BASE_URL}/movie/top_rated`,
        {
          method: "GET",
          headers: TMDB_CONFIG.headers,
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch top rated movies: ${response.statusText}`);
      }

      const data = await response.json();
      

      data.results = data.results.map((movie: any) => ({
        ...movie,
        poster_path: formatImageUrl(movie.poster_path, POSTER_SIZE),
        backdrop_path: formatImageUrl(movie.backdrop_path, BACKDROP_SIZE),
      }));
      
      return data;
    } catch (error) {
      console.error("Error fetching top rated movies:", error);
      throw error;
    }
  },
  
  getPopularMovies: async (): Promise<MovieResponse> => {
    try {
      const response = await fetch(
        `${TMDB_CONFIG.BASE_URL}/movie/popular`,
        {
          method: "GET",
          headers: TMDB_CONFIG.headers,
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch popular movies: ${response.statusText}`);
      }

      const data = await response.json();
      
 
      data.results = data.results.map((movie: any) => ({
        ...movie,
        poster_path: formatImageUrl(movie.poster_path, POSTER_SIZE),
        backdrop_path: formatImageUrl(movie.backdrop_path, BACKDROP_SIZE),
      }));
      
      return data;
    } catch (error) {
      console.error("Error fetching popular movies:", error);
      throw error;
    }
  },
  
  getUpcomingMovies: async (): Promise<MovieResponse> => {
    try {
      const response = await fetch(
        `${TMDB_CONFIG.BASE_URL}/movie/upcoming`,
        {
          method: "GET",
          headers: TMDB_CONFIG.headers,
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch upcoming movies: ${response.statusText}`);
      }

      const data = await response.json();
      

      data.results = data.results.map((movie: any) => ({
        ...movie,
        poster_path: formatImageUrl(movie.poster_path, POSTER_SIZE),
        backdrop_path: formatImageUrl(movie.backdrop_path, BACKDROP_SIZE),
      }));
      
      return data;
    } catch (error) {
      console.error("Error fetching upcoming movies:", error);
      throw error;
    }
  },
  
  getMovieById: async (id: number): Promise<Movie | undefined> => {
    try {
      const movieDetails = await fetchMovieDetails(id);
      
      if (!movieDetails) {
        throw new Error(`Movie details not available for ID: ${id}`);
      }

      // Create Movie object from MovieDetails
      const movie: Movie = {
        id: movieDetails.id,
        title: movieDetails.title,
        adult: movieDetails.adult,
        backdrop_path: movieDetails.backdrop_path || '',
        genre_ids: movieDetails.genres?.map(genre => genre.id) || [],
        original_language: movieDetails.original_language,
        original_title: movieDetails.original_title,
        overview: movieDetails.overview || '',
        popularity: movieDetails.popularity,
        poster_path: movieDetails.poster_path || '',
        release_date: movieDetails.release_date,
        video: movieDetails.video,
        vote_average: movieDetails.vote_average,
        vote_count: movieDetails.vote_count
      };

      return movie;
    } catch (error) {
      console.error(`Error fetching movie by ID ${id}:`, error);
      throw error;
    }
  },
  
  getTrendingMovies: async (): Promise<TrendingMovie[]> => {
    return fetchTrendingMovies();
  },

  getPersonDetails: async (personId: number): Promise<PersonDetails> => {
    return fetchPersonDetails(personId);
  },
};

export { tmdbApi };
export default tmdbApi;
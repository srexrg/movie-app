export interface Movie {
  id: number;
  title: string;
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface TrendingMovie {
  searchTerm: string;
  movie_id: number;
  title: string;
  count: number;
  poster_url: string;
}

export interface MovieVideo {
  id: string;
  key: string;
  name: string;
  site: string;
  size: number;
  type: string;
  official: boolean;
}

export interface MovieCredit {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface MovieDetails {
  adult: boolean;
  backdrop_path: string | null;
  belongs_to_collection: {
    id: number;
    name: string;
    poster_path: string;
    backdrop_path: string;
  } | null;
  budget: number;
  genres: {
    id: number;
    name: string;
  }[];
  homepage: string | null;
  id: number;
  imdb_id: string | null;
  original_language: string;
  original_title: string;
  overview: string | null;
  popularity: number;
  poster_path: string | null;
  production_companies: {
    id: number;
    logo_path: string | null;
    name: string;
    origin_country: string;
  }[];
  production_countries: {
    iso_3166_1: string;
    name: string;
  }[];
  release_date: string;
  revenue: number;
  runtime: number | null;
  spoken_languages: {
    english_name: string;
    iso_639_1: string;
    name: string;
  }[];
  status: string;
  tagline: string | null;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
  videos?: {
    results: MovieVideo[];
  };
  credits?: {
    cast: MovieCredit[];
    crew: MovieCredit[];
  };
}

// TV Series types
export interface Series {
  id: number;
  name: string;
  backdrop_path: string;
  genre_ids: number[];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
}

export interface SeriesDetails {
  adult: boolean;
  backdrop_path: string | null;
  created_by: {
    id: number;
    name: string;
    profile_path: string | null;
  }[];
  episode_run_time: number[];
  first_air_date: string;
  genres: {
    id: number;
    name: string;
  }[];
  homepage: string | null;
  id: number;
  in_production: boolean;
  languages: string[];
  last_air_date: string;
  last_episode_to_air: {
    id: number;
    name: string;
    overview: string;
    air_date: string;
    episode_number: number;
    season_number: number;
  } | null;
  name: string;
  networks: {
    id: number;
    name: string;
    logo_path: string | null;
  }[];
  number_of_episodes: number;
  number_of_seasons: number;
  origin_country: string[];
  original_language: string;
  original_name: string;
  overview: string | null;
  popularity: number;
  poster_path: string | null;
  production_companies: {
    id: number;
    logo_path: string | null;
    name: string;
    origin_country: string;
  }[];
  seasons: {
    id: number;
    name: string;
    overview: string;
    air_date: string | null;
    episode_count: number;
    poster_path: string | null;
    season_number: number;
  }[];
  status: string;
  tagline: string | null;
  type: string;
  vote_average: number;
  vote_count: number;
  videos?: {
    results: MovieVideo[];
  };
  credits?: {
    cast: MovieCredit[];
    crew: MovieCredit[];
  };
}

export interface TrendingSeries {
  searchTerm: string;
  series_id: number;
  name: string;
  count: number;
  poster_url: string;
}

export interface SeriesResponse {
  page: number;
  results: Series[];
  total_pages: number;
  total_results: number;
}

export interface TrendingCardProps {
  movie: TrendingMovie;
  index: number;
}

export interface SeriesCardProps {
  series: Series;
  index?: number;
}

export interface MovieResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface PersonDetails {
  id: number;
  name: string;
  biography: string;
  birthday: string | null;
  deathday: string | null;
  place_of_birth: string | null;
  profile_path: string | null;
  known_for_department: string;
  popularity: number;
  combined_credits: {
    cast: {
      id: number;
      title?: string; // Movie title
      name?: string;  // TV series name
      poster_path: string | null;
      release_date?: string; // Movie release date
      first_air_date?: string; // TV series first air date
      character: string;
      vote_average: number;
      media_type: string; // 'movie' or 'tv'
    }[];
  };
}

export default {};
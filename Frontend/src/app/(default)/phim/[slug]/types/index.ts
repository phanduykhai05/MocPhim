export type Episode = {
  id: string;
  label: string;
  title: string;
  poster: string;
};

export type CommentItem = {
  id: string;
  author: string;
  time: string;
  content: string;
  likes: number;
  replies?: number;
};

export type TopMovie = {
  id: string;
  rank: number;
  title: string;
  subtitle: string;
  quality: string;
  episode: string;
  poster: string;
};

export type MovieInfo = {
  title: string;
  subtitle: string;
  year: string;
  rating: string;
  duration: string;
  country: string;
  director: string;
  status: string;
  quality: string;
  imdb: string;
  poster: string;
  backdrop: string;
  genres: string[];
  description: string;
};

export type MovieDetailData = {
  movie: MovieInfo;
  episodes: Episode[];
  comments: CommentItem[];
  topWeekMovies: TopMovie[];
};

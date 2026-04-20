export type WatchEpisode = {
  number: number;
  name: string;
};

export type WatchServer = {
  id: number;
  name: string;
};

export type WatchMovie = {
  slug: string;
  title: string;
  altTitle: string;
  year: number;
  quality: string;
  duration: string;
  description: string;
  poster: string;
  ageRating: string;
  imdbScore: number;
  sectionLabel: string;
  genres: string[];
  country: string;
  status: string;
  casts: string[];
  episodes: WatchEpisode[];
  servers: WatchServer[];
};

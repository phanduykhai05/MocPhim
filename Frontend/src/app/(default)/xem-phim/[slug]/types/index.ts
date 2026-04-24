export type WatchEpisode = {
  number: number;
  name: string;
  slug: string;
  linkEmbed: string;
};

export type WatchServer = {
  id: number;
  name: string;
  episodes: WatchEpisode[];
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
  imdbScore: number;
  genres: string[];
  country: string;
  status: string;
  casts: string[];
  servers: WatchServer[];
};

// export interface Show {
//   title: string;
//   link: string;
//   desc: string;
//   image: string;
//   year: string;
//   rating: string;
// }

// export interface IDs {
//   slug: string,
//   trakt: string,
//   imdb: string,
//   tmdb: string,
// }

/* eslint-disable camelcase */
export interface Show {
  title: string;
  year: number;
  ids: IDS;
  overview: string;
  first_aired: string;
  airs: Airs;
  runtime: number;
  certification: string;
  network: string;
  country: string;
  updated_at: string;
  trailer: null;
  homepage: string;
  status: string;
  rating: number;
  votes: number;
  comment_count: number;
  language: string;
  available_translations: string[];
  genres: string[];
  aired_episodes: number;
}

export interface Airs {
  day: string;
  time: string;
  timezone: string;
}

export interface IDS {
  trakt: number;
  slug: string;
  tvdb: number;
  imdb: string;
  tmdb: number;
}

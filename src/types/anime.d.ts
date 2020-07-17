export interface TopLevel {
  node: Node;
}

export interface Node {
  media: Media;
  mediaRecommendation: MediaRecommendation;
}

export interface Media {
  title: Title;
}

export interface Title {
  native: string;
}

export interface MediaRecommendation {
  coverImage: CoverImage;
  title: Title;
  siteUrl: string;
  description: string;
  episodes: number;
  genres: string[];
  averageScore: number;
  popularity: number;
  favourites: number;
  startDate: StartDate;
}

export interface CoverImage {
  color: string;
  extraLarge: string;
  large: string;
  medium: string;
}

export interface StartDate {
  year: number;
  month: number;
  day: number;
}

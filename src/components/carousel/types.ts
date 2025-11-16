// Types for Carousel components
export interface Anime {
  id: number | string;
  title?: {
    english?: string;
    romaji?: string;
    native?: string;
  };
  base_title?: string;
  coverImage?: string;
  cover_image?: string;
  bannerImage?: string;
  characterImages?: Array<{
    url: string;
    character: string;
    role: string;
  }>;
  episodeScreenshots?: Array<{
    url: string;
    type: string;
    source: string;
  }>;
  anilist_id?: number;
  count?: number;
  episodes?: number;
  averageScore?: number;
  average_score?: number;
  genres?: string[];
  first_date?: string;
  description?: string;
  status?: string;
  popularity?: number;
}

export interface ImageItem {
  url: string;
  label: string;
}

export interface CarouselProps {
  animes: Anime[];
}

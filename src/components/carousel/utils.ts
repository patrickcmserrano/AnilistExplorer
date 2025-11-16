import { Anime, ImageItem } from './types';

// Helper functions to get data from both old and new formats
export const getTitle = (anime: Anime): string => 
  anime.base_title || anime.title?.english || anime.title?.romaji || 'Unknown';

export const getCover = (anime: Anime): string | undefined => 
  anime.coverImage || anime.cover_image;

export const getScore = (anime: Anime): number | undefined => 
  anime.averageScore || anime.average_score;

export const getCount = (anime: Anime): number | undefined => 
  anime.count || anime.episodes;

// Get all available images for an anime
export const getAvailableImages = (anime: Anime): ImageItem[] => {
  const images: ImageItem[] = [];
  const cover = getCover(anime);

  // 1. Add cover image
  if (cover) {
    images.push({ url: cover, label: 'Cover' });
  }

  // 2. Add banner image if available
  if (anime.bannerImage) {
    images.push({ url: anime.bannerImage, label: 'Banner' });
  }

  // 3. Add episode screenshots (Jikan API / MyAnimeList)
  if (anime.episodeScreenshots && anime.episodeScreenshots.length > 0) {
    anime.episodeScreenshots.forEach((screenshot, idx) => {
      images.push({
        url: screenshot.url,
        label: `Screenshot ${idx + 1}`
      });
    });
  }

  // 4. Add character images (up to 15 per anime)
  if (anime.characterImages && anime.characterImages.length > 0) {
    anime.characterImages.slice(0, 15).forEach((char) => {
      images.push({
        url: char.url,
        label: `${char.character} (${char.role})`
      });
    });
  }

  return images.length > 0 ? images : [{ url: '/placeholder-anime.svg', label: 'Placeholder' }];
};

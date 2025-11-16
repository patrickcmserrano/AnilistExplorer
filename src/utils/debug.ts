// Debug utility for AnimeExplorer
export function debugLog(component: string, message: string, data?: any) {
  const timestamp = new Date().toLocaleTimeString();
  const style = 'color: #06B6D4; font-weight: bold;';
  
  if (data) {
    console.log(`%c[${timestamp}] ${component}`, style, message, data);
  } else {
    console.log(`%c[${timestamp}] ${component}`, style, message);
  }
}

export function debugAnime(component: string, anime: any) {
  debugLog(component, 'Anime Data:', {
    id: anime.id,
    title: anime.base_title || anime.title?.english || 'N/A',
    cover: anime.coverImage || anime.cover_image ? '✓' : '✗',
    genres: anime.genres?.length || 0,
    status: anime.status || 'N/A',
    episodes: anime.episodes || anime.count || 0,
  });
}

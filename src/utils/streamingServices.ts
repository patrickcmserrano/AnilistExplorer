/**
 * Extract streaming service name from URL
 */
export function getStreamingServiceName(url: string): string {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();

    // Map of domain patterns to service names
    const serviceMap: Record<string, string> = {
      'crunchyroll.com': 'Crunchyroll',
      'hulu.com': 'Hulu',
      'netflix.com': 'Netflix',
      'bilibili.tv': 'Bilibili',
      'bilibili.com': 'Bilibili',
      'iq.com': 'iQIYI',
      'wetv.vip': 'WeTV',
      'youtube.com': 'YouTube',
      'youtu.be': 'YouTube',
      'hoopladigital.com': 'Hoopla Digital',
      'disneyplus.com': 'Disney+',
      'amazon.com': 'Prime Video',
      'primevideo.com': 'Prime Video',
      'hidive.com': 'HIDIVE',
      'animeplanet.com': 'Anime Planet',
      'funimation.com': 'Crunchyroll',
      'wakanim.tv': 'Wakanim',
      'amazonprimevideo.com': 'Prime Video',
      'apple.com': 'Apple TV+',
      'paramountplus.com': 'Paramount+',
      'themoviedb.org': 'The Movie Database',
    };

    // Find matching service
    for (const [domain, serviceName] of Object.entries(serviceMap)) {
      if (hostname.includes(domain)) {
        return serviceName;
      }
    }

    // Fallback: extract from hostname
    const parts = hostname.split('.');
    const mainDomain = parts[parts.length - 2] || hostname;
    
    // Capitalize first letter
    return mainDomain.charAt(0).toUpperCase() + mainDomain.slice(1);
  } catch (error) {
    return 'Assistir';
  }
}

/**
 * Get streaming service icon emoji
 */
export function getStreamingIcon(url: string): string {
  const serviceName = getStreamingServiceName(url);
  
  const iconMap: Record<string, string> = {
    'Crunchyroll': '🍜',
    'Netflix': '🎬',
    'Hulu': '📺',
    'Prime Video': '🎥',
    'Disney+': '✨',
    'YouTube': '📹',
    'Bilibili': '🎨',
    'iQIYI': '🎭',
    'WeTV': '🌍',
    'HIDIVE': '🎪',
    'Hoopla Digital': '📚',
    'Anime Planet': '🌟',
    'Wakanim': '🎬',
    'Paramount+': '⭐',
    'Apple TV+': '🍎',
  };

  return iconMap[serviceName] || '🎬';
}

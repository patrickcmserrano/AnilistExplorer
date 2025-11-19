/**
 * Image optimization utilities for better performance
 */

/**
 * Generate optimized image URL with resize parameters
 * For AniList CDN, we can request specific sizes
 */
export function getOptimizedImageUrl(
  url: string,
  width?: number,
  quality: number = 85
): string {
  if (!url) return url;
  
  // For AniList CDN images, use their size parameters
  if (url.includes('anilist.co')) {
    // AniList already provides optimized images, but we can add quality hints
    return url;
  }
  
  // For other CDNs, return original URL
  return url;
}

/**
 * Get responsive image srcset for different screen sizes
 */
export function getImageSrcSet(url: string): string {
  if (!url || !url.includes('anilist.co')) return '';
  
  // Generate srcset for different screen densities
  return `${url} 1x, ${url} 2x`;
}

/**
 * Preload critical images for LCP optimization
 */
export function getPreloadLink(url: string, as: 'image' | 'fetch' = 'image'): string {
  return `<link rel="preload" href="${url}" as="${as}" fetchpriority="high">`;
}

/**
 * Check if WebP is supported and return appropriate format
 * Note: This is a client-side check, server-side should use Accept header
 */
export function supportsWebP(): Promise<boolean> {
  return new Promise((resolve) => {
    const webP = new Image();
    webP.onload = webP.onerror = () => {
      resolve(webP.height === 2);
    };
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  });
}

/**
 * Lazy load images with intersection observer
 */
export function setupLazyLoading() {
  if ('loading' in HTMLImageElement.prototype) {
    // Native lazy loading is supported
    return;
  }

  // Fallback for older browsers
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          observer.unobserve(img);
        }
      }
    });
  });

  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
}

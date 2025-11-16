import { useState, useEffect, useRef, useCallback } from 'react';

interface Anime {
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

interface Props {
  animes: Anime[];
}

export default function CoverCarousel({ animes: initialAnimes }: Props) {
  const [currentAnimeIndex, setCurrentAnimeIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [showInfo, setShowInfo] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Helper functions to get data from both old and new formats
  const getTitle = (anime: Anime) => anime.base_title || anime.title?.english || anime.title?.romaji || 'Unknown';
  const getCover = (anime: Anime) => anime.coverImage || anime.cover_image;
  const getScore = (anime: Anime) => anime.averageScore || anime.average_score;
  const getCount = (anime: Anime) => anime.count || anime.episodes;

  const currentAnime = initialAnimes[currentAnimeIndex];
  if (!currentAnime) return null;

  // Get all available images for current anime
  const getAvailableImages = (anime: Anime) => {
    const images: Array<{ url: string; label: string }> = [];
    
    const cover = getCover(anime);
    
    // 1. Add cover image (extraLarge quality)
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
    
    // 4. Add character images (up to 15 per anime!)
    if (anime.characterImages && anime.characterImages.length > 0) {
      anime.characterImages.forEach((char) => {
        images.push({ 
          url: char.url, 
          label: `${char.character} (${char.role})`
        });
      });
    }
    
    return images.length > 0 ? images : [{ url: '/placeholder-anime.svg', label: 'Placeholder' }];
  };

  const availableImages = getAvailableImages(currentAnime);
  const currentImage = availableImages[currentImageIndex] || availableImages[0];

  const title = getTitle(currentAnime);
  const score = getScore(currentAnime);
  const count = getCount(currentAnime);

  // Navigate to next anime (scroll down)
  const nextAnime = useCallback(() => {
    setCurrentAnimeIndex((prev) => (prev + 1) % initialAnimes.length);
    setCurrentImageIndex(0); // Reset image index when changing anime
  }, [initialAnimes.length]);

  // Navigate to previous anime (scroll up)
  const prevAnime = useCallback(() => {
    setCurrentAnimeIndex((prev) => 
      prev === 0 ? initialAnimes.length - 1 : prev - 1
    );
    setCurrentImageIndex(0); // Reset image index when changing anime
  }, [initialAnimes.length]);

  // Navigate to next image (arrow right)
  const nextImage = useCallback(() => {
    if (availableImages.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % availableImages.length);
    }
  }, [availableImages.length]);

  // Navigate to previous image (arrow left)
  const prevImage = useCallback(() => {
    if (availableImages.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? availableImages.length - 1 : prev - 1
      );
    }
  }, [availableImages.length]);

  // Toggle fullscreen
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      carouselRef.current?.requestFullscreen().catch(() => {
        setIsFullscreen(true);
      });
    } else {
      document.exitFullscreen();
    }
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only respond if fullscreen or focused on carousel
      if (!isFullscreen && document.activeElement !== carouselRef.current) return;

      switch (e.key) {
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          nextImage();
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          prevImage();
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          nextAnime();
          break;
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          prevAnime();
          break;
        case 'Enter':
          e.preventDefault();
          window.location.href = `/anime/${currentAnime.id}`;
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'i':
        case 'I':
          e.preventDefault();
          setShowInfo(!showInfo);
          break;
        case 'Escape':
          e.preventDefault();
          if (isFullscreen && document.fullscreenElement) {
            document.exitFullscreen();
          }
          break;
        default:
          break;
      }
    };

    // Handle fullscreen change events
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [isFullscreen, nextImage, prevImage, nextAnime, prevAnime, currentAnime.id, toggleFullscreen, showInfo]);

  if (!currentAnime || initialAnimes.length === 0) {
    return null;
  }

  // Calculate progress percentage (based on anime index)
  const progress = ((currentAnimeIndex + 1) / initialAnimes.length) * 100;

  return (
    <>
      {/* Carousel Container */}
      <div
        ref={carouselRef}
        className={`relative w-full ${
          isFullscreen ? 'fixed inset-0 z-50' : 'aspect-video rounded-2xl overflow-hidden'
        } bg-black shadow-2xl group`}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* Background image with blur */}
        <div
          className="absolute inset-0 transition-all duration-500"
          style={{
            backgroundImage: `url(${currentImage?.url})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(20px) brightness(0.3)',
          }}
        />

        {/* Main image */}
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
          <img
            key={`${currentAnime.id}-${currentImageIndex}`}
            src={currentImage?.url}
            alt={`${title} - ${currentImage?.label}`}
            className="h-full w-auto object-contain animate-fade-in"
            onError={(e) => { e.currentTarget.src = '/placeholder-anime.svg'; }}
          />
        </div>

        {/* Info Overlay - Top */}
        {showInfo && (
          <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent p-6 transition-opacity duration-300">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 line-clamp-2">
              {title}
            </h1>
            {currentAnime.description && (
              <p className="text-gray-300 text-sm md:text-base max-w-2xl line-clamp-2">
                {currentAnime.description}
              </p>
            )}
            <div className="flex flex-wrap gap-3 mt-3">
              {score && (
                <span className="flex items-center gap-1 text-yellow-400 text-sm">
                  <span>⭐</span>
                  <span>{score}%</span>
                </span>
              )}
              {count && (
                <span className="flex items-center gap-1 text-blue-400 text-sm">
                  <span>📦</span>
                  <span>{currentAnime.count} releases</span>
                </span>
              )}
              {currentAnime.genres && currentAnime.genres.length > 0 && (
                <div className="flex gap-2">
                  {currentAnime.genres.slice(0, 3).map(genre => (
                    <span
                      key={genre}
                      className="px-2 py-1 bg-purple-600/80 rounded text-white text-xs"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Info Overlay - Bottom with controls hint */}
        {showInfo && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6">
            <div className="flex items-center justify-between">
              <div className="text-gray-400 text-sm">
                <div className="mb-2 flex items-center gap-4">
                  <span>
                    Anime {currentAnimeIndex + 1} de {initialAnimes.length}
                  </span>
                  {availableImages.length > 1 && (
                    <span className="text-purple-400">
                      Imagem {currentImageIndex + 1} de {availableImages.length} ({currentImage?.label})
                    </span>
                  )}
                </div>
                <div className="flex gap-3 text-xs flex-wrap">
                  <span>← → ou A/D: Trocar imagem</span>
                  <span>↑ ↓ ou W/S: Trocar anime</span>
                  <span>Enter: Abrir</span>
                  <span>F: Tela cheia</span>
                  <span>I: Info</span>
                </div>
              </div>
              <div className="text-right">
                {currentAnime.popularity && (
                  <div className="text-sm text-purple-400">
                    🔥 {currentAnime.popularity.toLocaleString()} fãs
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800/50">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Navigation Buttons - Left (Previous Image) */}
        <button
          onClick={prevImage}
          disabled={availableImages.length <= 1}
          className={`absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 text-white hover:bg-black/80 transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
            isHovering ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}
          aria-label="Imagem anterior"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Navigation Buttons - Right (Next Image) */}
        <button
          onClick={nextImage}
          disabled={availableImages.length <= 1}
          className={`absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 text-white hover:bg-black/80 transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
            isHovering ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}
          aria-label="Próxima imagem"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Navigation Buttons - Top (Previous Anime) */}
        <button
          onClick={prevAnime}
          className={`absolute top-4 left-1/2 -translate-x-1/2 p-2 rounded-full bg-purple-600/80 text-white hover:bg-purple-700 transition-all ${
            isHovering ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}
          aria-label="Anime anterior"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>

        {/* Navigation Buttons - Bottom (Next Anime) */}
        <button
          onClick={nextAnime}
          className={`absolute bottom-20 left-1/2 -translate-x-1/2 p-2 rounded-full bg-purple-600/80 text-white hover:bg-purple-700 transition-all ${
            isHovering ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}
          aria-label="Próximo anime"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Floating Action Buttons - Top Right */}
        <div
          className={`absolute top-4 right-4 flex gap-2 transition-opacity duration-300 ${
            isHovering ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}
        >
          {/* Info Toggle */}
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="p-2 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors"
            title="Toggle info (I)"
            aria-label="Alternar informações"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
            </svg>
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors"
            title="Toggle fullscreen (F)"
            aria-label="Alternar tela cheia"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              {isFullscreen ? (
                <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
              ) : (
                <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
              )}
            </svg>
          </button>

          {/* Open Anime Button */}
          <a
            href={`/anime/${currentAnime.id}`}
            className="p-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-colors"
            title="Abrir anime (Enter)"
            aria-label="Abrir página do anime"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>

        {/* Keyboard hint - center (visible only on hover) */}
        {!showInfo && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center text-white/60">
              <p className="text-lg">Pressione I para mostrar informações</p>
            </div>
          </div>
        )}
      </div>

      {/* Mobile-friendly hint below carousel */}
      <div className="mt-2 text-xs text-gray-400 text-center md:hidden">
        👆 Deslize ou use os botões • ← → : Trocar imagem • ↑ ↓ : Trocar anime
      </div>

      {/* Styles for fade animation */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.3s ease-in;
        }
      `}</style>
    </>
  );
}

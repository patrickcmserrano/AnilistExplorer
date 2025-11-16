import { useState, useRef, useCallback, useMemo } from 'react';
import { CarouselProps } from './types';
import { getTitle, getCover, getScore, getCount, getAvailableImages } from './utils';
import { useKeyboardNavigation } from './useKeyboardNavigation';
import { useTouchNavigation } from './useTouchNavigation';
import { useFullscreen } from './useFullscreen';
import CarouselImageDisplay from './CarouselImageDisplay';
import CarouselInfoOverlay from './CarouselInfoOverlay';
import CarouselNavigationButtons from './CarouselNavigationButtons';
import CarouselActionButtons from './CarouselActionButtons';
import CarouselProgressBar from './CarouselProgressBar';

export default function CoverCarousel({ animes: initialAnimes }: CarouselProps) {
  const [currentAnimeIndex, setCurrentAnimeIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [showInfo, setShowInfo] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);

  const currentAnime = initialAnimes[currentAnimeIndex];
  
  if (!currentAnime || initialAnimes.length === 0) return null;

  // Get all available images (memoized for performance)
  const availableImages = useMemo(() => getAvailableImages(currentAnime), [currentAnime]);
  const currentImage = availableImages[currentImageIndex] || availableImages[0];
  
  // Get anime data
  const title = getTitle(currentAnime);
  const score = getScore(currentAnime);
  const count = getCount(currentAnime);

  // Navigation handlers
  const nextAnime = useCallback(() => {
    setCurrentAnimeIndex((prev) => (prev + 1) % initialAnimes.length);
    setCurrentImageIndex(0);
  }, [initialAnimes.length]);

  const prevAnime = useCallback(() => {
    setCurrentAnimeIndex((prev) => prev === 0 ? initialAnimes.length - 1 : prev - 1);
    setCurrentImageIndex(0);
  }, [initialAnimes.length]);

  const nextImage = useCallback(() => {
    if (availableImages.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % availableImages.length);
    }
  }, [availableImages.length]);

  const prevImage = useCallback(() => {
    if (availableImages.length > 1) {
      setCurrentImageIndex((prev) => prev === 0 ? availableImages.length - 1 : prev - 1);
    }
  }, [availableImages.length]);

  const toggleInfo = useCallback(() => setShowInfo((prev) => !prev), []);

  // Custom hooks for interactions
  const { isFullscreen, toggleFullscreen } = useFullscreen({ carouselRef });

  useKeyboardNavigation({
    isFullscreen,
    carouselRef,
    nextImage,
    prevImage,
    nextAnime,
    prevAnime,
    currentAnimeId: currentAnime.id,
    toggleFullscreen,
    toggleInfo
  });

  useTouchNavigation({
    carouselRef,
    nextImage,
    prevImage,
    nextAnime,
    prevAnime
  });

  // Calculate progress percentage
  const progress = ((currentAnimeIndex + 1) / initialAnimes.length) * 100;

  return (
    <>
      {/* Carousel Container */}
      <div
        ref={carouselRef}
        className={`relative w-full ${
          isFullscreen 
            ? 'fixed inset-0 z-50' 
            : 'h-[70vh] min-h-[400px] max-h-[800px] md:aspect-video md:h-auto rounded-2xl overflow-hidden'
        } bg-black shadow-2xl group`}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        tabIndex={0}
      >
        {/* Image Display */}
        <CarouselImageDisplay
          imageUrl={currentImage.url}
          imageLabel={currentImage.label}
          animeTitle={title}
          animeId={currentAnime.id}
          imageIndex={currentImageIndex}
        />

        {/* Info Overlay */}
        {showInfo && (
          <CarouselInfoOverlay
            anime={currentAnime}
            title={title}
            score={score}
            count={count}
            currentAnimeIndex={currentAnimeIndex}
            totalAnimes={initialAnimes.length}
            currentImageIndex={currentImageIndex}
            totalImages={availableImages.length}
            currentImage={currentImage}
          />
        )}

        {/* Progress Bar */}
        <CarouselProgressBar progress={progress} />

        {/* Navigation Buttons */}
        <CarouselNavigationButtons
          onPrevImage={prevImage}
          onNextImage={nextImage}
          onPrevAnime={prevAnime}
          onNextAnime={nextAnime}
          hasMultipleImages={availableImages.length > 1}
          isHovering={isHovering}
        />

        {/* Action Buttons */}
        <CarouselActionButtons
          animeId={currentAnime.id}
          isFullscreen={isFullscreen}
          isHovering={isHovering}
          onToggleInfo={toggleInfo}
          onToggleFullscreen={toggleFullscreen}
        />

        {/* Info hint when hidden */}
        {!showInfo && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center text-white/70 bg-black/50 px-4 py-3 rounded-lg">
              <p className="text-sm md:text-lg">Pressione I para mostrar informações</p>
              <p className="text-xs md:text-sm mt-1 md:hidden">ou toque no ícone ℹ️</p>
            </div>
          </div>
        )}
      </div>

      {/* Mobile hint below carousel */}
      <div className="mt-3 text-xs md:text-sm text-gray-400 text-center">
        <div className="flex flex-wrap gap-3 justify-center items-center">
          <span className="md:hidden">👆 Deslize para navegar</span>
          <span className="hidden md:inline">🖱️ Passe o mouse e use os botões ou teclado</span>
          <span className="hidden md:inline">•</span>
          <span>← → : Trocar imagem</span>
          <span className="hidden sm:inline">•</span>
          <span className="hidden sm:inline">↑ ↓ : Trocar anime</span>
        </div>
      </div>
    </>
  );
}

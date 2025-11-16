import { useEffect, RefObject } from 'react';

interface UseKeyboardNavigationProps {
  isFullscreen: boolean;
  carouselRef: RefObject<HTMLDivElement>;
  nextImage: () => void;
  prevImage: () => void;
  nextAnime: () => void;
  prevAnime: () => void;
  currentAnimeId: number | string;
  toggleFullscreen: () => void;
  toggleInfo: () => void;
}

export const useKeyboardNavigation = ({
  isFullscreen,
  carouselRef,
  nextImage,
  prevImage,
  nextAnime,
  prevAnime,
  currentAnimeId,
  toggleFullscreen,
  toggleInfo
}: UseKeyboardNavigationProps) => {
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
          window.location.href = `/anime/${currentAnimeId}`;
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'i':
        case 'I':
          e.preventDefault();
          toggleInfo();
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

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, nextImage, prevImage, nextAnime, prevAnime, currentAnimeId, toggleFullscreen, toggleInfo, carouselRef]);
};

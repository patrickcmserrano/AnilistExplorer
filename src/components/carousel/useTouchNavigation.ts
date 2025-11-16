import { useEffect, useRef, RefObject } from 'react';

interface UseTouchNavigationProps {
  carouselRef: RefObject<HTMLDivElement>;
  nextImage: () => void;
  prevImage: () => void;
  nextAnime: () => void;
  prevAnime: () => void;
}

export const useTouchNavigation = ({
  carouselRef,
  nextImage,
  prevImage,
  nextAnime,
  prevAnime
}: UseTouchNavigationProps) => {
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      touchStart.current = { x: touch.clientX, y: touch.clientY };
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStart.current) return;
      
      const touch = e.touches[0];
      const deltaX = touch.clientX - touchStart.current.x;
      const deltaY = touch.clientY - touchStart.current.y;

      // Horizontal swipe for images
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
        if (deltaX > 0) {
          prevImage();
        } else {
          nextImage();
        }
        touchStart.current = null; // Reset to prevent multiple triggers
      } 
      // Vertical swipe for animes
      else if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 50) {
        if (deltaY > 0) {
          nextAnime();
        } else {
          prevAnime();
        }
        touchStart.current = null;
      }
    };

    const handleTouchEnd = () => {
      touchStart.current = null;
    };

    const ref = carouselRef.current;
    if (ref) {
      ref.addEventListener('touchstart', handleTouchStart);
      ref.addEventListener('touchmove', handleTouchMove);
      ref.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      if (ref) {
        ref.removeEventListener('touchstart', handleTouchStart);
        ref.removeEventListener('touchmove', handleTouchMove);
        ref.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, [carouselRef, nextImage, prevImage, nextAnime, prevAnime]);
};

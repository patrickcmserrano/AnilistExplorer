interface CarouselNavigationButtonsProps {
  onPrevImage: () => void;
  onNextImage: () => void;
  onPrevAnime: () => void;
  onNextAnime: () => void;
  hasMultipleImages: boolean;
  isHovering: boolean;
}

export default function CarouselNavigationButtons({
  onPrevImage,
  onNextImage,
  onPrevAnime,
  onNextAnime,
  hasMultipleImages,
  isHovering
}: CarouselNavigationButtonsProps) {
  return (
    <>
      {/* Left - Previous Image */}
      <button
        onClick={onPrevImage}
        disabled={!hasMultipleImages}
        className={`absolute left-2 md:left-4 top-1/2 -translate-y-1/2 p-2 md:p-3 rounded-full bg-black/70 text-white hover:bg-black/90 active:bg-black transition-all disabled:opacity-20 disabled:cursor-not-allowed touch-manipulation ${
          isHovering || hasMultipleImages ? 'opacity-100 md:opacity-0 md:group-hover:opacity-100' : 'opacity-0'
        }`}
        aria-label="Imagem anterior"
      >
        <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Right - Next Image */}
      <button
        onClick={onNextImage}
        disabled={!hasMultipleImages}
        className={`absolute right-2 md:right-4 top-1/2 -translate-y-1/2 p-2 md:p-3 rounded-full bg-black/70 text-white hover:bg-black/90 active:bg-black transition-all disabled:opacity-20 disabled:cursor-not-allowed touch-manipulation ${
          isHovering || hasMultipleImages ? 'opacity-100 md:opacity-0 md:group-hover:opacity-100' : 'opacity-0'
        }`}
        aria-label="Próxima imagem"
      >
        <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Top - Previous Anime */}
      <button
        onClick={onPrevAnime}
        className={`absolute top-8 md:top-4 left-1/2 -translate-x-1/2 p-1.5 md:p-2 rounded-full bg-purple-600/90 text-white hover:bg-purple-700 active:bg-purple-800 transition-all touch-manipulation ${
          isHovering ? 'opacity-100 md:opacity-0 md:group-hover:opacity-100' : 'opacity-0 md:group-hover:opacity-100'
        }`}
        aria-label="Anime anterior"
      >
        <svg className="w-3 h-3 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7" />
        </svg>
      </button>

      {/* Bottom - Next Anime */}
      <button
        onClick={onNextAnime}
        className={`absolute bottom-12 md:bottom-20 left-1/2 -translate-x-1/2 p-1.5 md:p-2 rounded-full bg-purple-600/90 text-white hover:bg-purple-700 active:bg-purple-800 transition-all touch-manipulation ${
          isHovering ? 'opacity-100 md:opacity-0 md:group-hover:opacity-100' : 'opacity-0 md:group-hover:opacity-100'
        }`}
        aria-label="Próximo anime"
      >
        <svg className="w-3 h-3 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </>
  );
}

interface CarouselActionButtonsProps {
  animeId: number | string;
  isFullscreen: boolean;
  isHovering: boolean;
  onToggleInfo: () => void;
  onToggleFullscreen: () => void;
}

export default function CarouselActionButtons({
  animeId,
  isFullscreen,
  isHovering,
  onToggleInfo,
  onToggleFullscreen
}: CarouselActionButtonsProps) {
  return (
    <div
      className={`absolute top-2 md:top-4 right-2 md:right-4 flex gap-1.5 md:gap-2 transition-opacity duration-300 ${
        isHovering ? 'opacity-100' : 'opacity-80 md:opacity-0 md:group-hover:opacity-100'
      }`}
    >
      {/* Info Toggle */}
      <button
        onClick={onToggleInfo}
        className="p-2 md:p-2.5 rounded-full bg-black/70 hover:bg-black/90 active:bg-black text-white transition-colors touch-manipulation"
        title="Toggle info (I)"
        aria-label="Alternar informações"
      >
        <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
        </svg>
      </button>

      {/* Fullscreen Toggle */}
      <button
        onClick={onToggleFullscreen}
        className="p-2 md:p-2.5 rounded-full bg-black/70 hover:bg-black/90 active:bg-black text-white transition-colors touch-manipulation"
        title="Toggle fullscreen (F)"
        aria-label="Alternar tela cheia"
      >
        <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24">
          {isFullscreen ? (
            <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
          ) : (
            <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
          )}
        </svg>
      </button>

      {/* Open Anime Button */}
      <a
        href={`/anime/${animeId}`}
        className="p-2 md:p-2.5 rounded-full bg-blue-600/90 hover:bg-blue-700 active:bg-blue-800 text-white transition-colors touch-manipulation"
        title="Abrir anime (Enter)"
        aria-label="Abrir página do anime"
      >
        <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </a>
    </div>
  );
}

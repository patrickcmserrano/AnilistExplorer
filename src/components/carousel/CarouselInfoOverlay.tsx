import { Anime, ImageItem } from './types';

interface CarouselInfoOverlayProps {
  anime: Anime;
  title: string;
  score?: number;
  count?: number;
  currentAnimeIndex: number;
  totalAnimes: number;
  currentImageIndex: number;
  totalImages: number;
  currentImage: ImageItem;
}

export default function CarouselInfoOverlay({
  anime,
  title,
  score,
  count,
  currentAnimeIndex,
  totalAnimes,
  currentImageIndex,
  totalImages,
  currentImage
}: CarouselInfoOverlayProps) {
  return (
    <>
      {/* Top Info */}
      <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/90 via-black/50 to-transparent p-2 md:p-6 transition-opacity duration-300 pointer-events-none">
        <h1 className="text-base md:text-3xl lg:text-4xl font-bold text-white mb-1 md:mb-2 line-clamp-1 md:line-clamp-2">
          {title}
        </h1>
        {anime.description && (
          <p className="text-gray-300 text-xs md:text-sm lg:text-base max-w-2xl line-clamp-1 md:line-clamp-2 hidden sm:block">
            {anime.description}
          </p>
        )}
        <div className="flex flex-wrap gap-1.5 md:gap-3 mt-1.5 md:mt-3">
          {score && (
            <span className="flex items-center gap-0.5 md:gap-1 text-yellow-400 text-xs md:text-sm">
              <span>⭐</span>
              <span>{score}%</span>
            </span>
          )}
          {count && (
            <span className="flex items-center gap-0.5 md:gap-1 text-blue-400 text-xs md:text-sm">
              <span>📦</span>
              <span className="hidden sm:inline">{count} episódios</span>
              <span className="sm:hidden">{count}ep</span>
            </span>
          )}
          {anime.genres && anime.genres.length > 0 && (
            <div className="flex gap-1 md:gap-2">
              {anime.genres.slice(0, 3).map(genre => (
                <span
                  key={genre}
                  className="px-1.5 md:px-2 py-0.5 md:py-1 bg-purple-600/80 rounded text-white text-xs"
                >
                  {genre}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Info */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-2 md:p-6 pointer-events-none">
        <div className="flex items-center justify-between flex-col sm:flex-row gap-1 md:gap-2">
          <div className="text-gray-400 text-xs md:text-sm w-full sm:w-auto">
            <div className="mb-0.5 md:mb-2 flex items-center gap-1.5 md:gap-4 justify-center sm:justify-start flex-wrap">
              <span className="text-xs md:text-sm">
                {currentAnimeIndex + 1}/{totalAnimes}
              </span>
              {totalImages > 1 && (
                <span className="text-purple-400 text-xs md:text-sm truncate max-w-[120px] md:max-w-none">
                  {currentImageIndex + 1}/{totalImages}
                  <span className="hidden sm:inline"> ({currentImage.label})</span>
                </span>
              )}
              {anime.popularity && (
                <span className="text-purple-400 text-xs md:text-sm sm:hidden">
                  🔥 {(anime.popularity / 1000).toFixed(0)}k
                </span>
              )}
            </div>
            <div className="hidden md:flex gap-3 text-xs flex-wrap">
              <span>← → ou A/D: Trocar imagem</span>
              <span>↑ ↓ ou W/S: Trocar anime</span>
              <span>Enter: Abrir</span>
              <span>F: Tela cheia</span>
              <span>I: Info</span>
            </div>
            <div className="hidden sm:flex md:hidden gap-2 text-xs flex-wrap justify-center">
              <span>↔️ Imagem</span>
              <span>↕️ Anime</span>
            </div>
          </div>
          <div className="text-center sm:text-right hidden sm:block">
            {anime.popularity && (
              <div className="text-xs md:text-sm text-purple-400">
                🔥 {anime.popularity.toLocaleString()} fãs
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

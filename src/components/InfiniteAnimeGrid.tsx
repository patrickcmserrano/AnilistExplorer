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
  anilist_id?: number;
  count?: number;
  episodes?: number;
  averageScore?: number;
  average_score?: number;
  seeders?: number;
  leechers?: number;
  genres?: string[];
  first_date?: string;
  status?: string;
  popularity?: number;
  seasonYear?: number;
}

interface Props {
  animes: Anime[];
  sortBy?: string;
}

const ITEMS_PER_PAGE = 60;

export default function InfiniteAnimeGrid({ animes: initialAnimes, sortBy = 'popularity' }: Props) {
  const [allAnimes, setAllAnimes] = useState<Anime[]>(initialAnimes);
  const [displayedAnimes, setDisplayedAnimes] = useState<Anime[]>(initialAnimes.slice(0, ITEMS_PER_PAGE));
  const [currentPage, setCurrentPage] = useState(1);
  const [sortMethod, setSortMethod] = useState(sortBy);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  // Sort animes helper function
  const sortAnimes = useCallback((animes: Anime[], method: string) => {
    const sorted = [...animes];
    
    switch(method) {
      case 'popularity':
        sorted.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
        break;
      case 'rating':
        sorted.sort((a, b) => (b.averageScore || b.average_score || 0) - (a.averageScore || a.average_score || 0));
        break;
      case 'episodes':
        sorted.sort((a, b) => (b.episodes || b.count || 0) - (a.episodes || a.count || 0));
        break;
      case 'year':
        sorted.sort((a, b) => {
          const yearA = a.seasonYear || new Date(a.first_date || 0).getFullYear() || 0;
          const yearB = b.seasonYear || new Date(b.first_date || 0).getFullYear() || 0;
          return yearB - yearA;
        });
        break;
      case 'title':
        sorted.sort((a, b) => {
          const titleA = a.base_title || a.title?.english || a.title?.romaji || '';
          const titleB = b.base_title || b.title?.english || b.title?.romaji || '';
          return titleA.localeCompare(titleB);
        });
        break;
    }
    
    return sorted;
  }, []);

  // Update displayed animes when sort changes
  useEffect(() => {
    setCurrentPage(1);
    const sorted = sortAnimes(allAnimes, sortMethod);
    setDisplayedAnimes(sorted.slice(0, ITEMS_PER_PAGE));
  }, [sortMethod, allAnimes, sortAnimes]);

  // Expose update function for SearchBar
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).updateInfiniteGrid = (newAnimes: Anime[]) => {
        setAllAnimes(newAnimes);
        setCurrentPage(1);
        const sorted = sortAnimes(newAnimes, sortMethod);
        setDisplayedAnimes(sorted.slice(0, ITEMS_PER_PAGE));
      };
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        delete (window as any).updateInfiniteGrid;
      }
    };
  }, [sortMethod, sortAnimes]);

  // Load more animes from existing data
  const loadMore = useCallback(() => {
    if (isLoadingMore) return;
    
    const sorted = sortAnimes(allAnimes, sortMethod);
    const nextPage = currentPage + 1;
    const endIndex = nextPage * ITEMS_PER_PAGE;
    
    if (endIndex <= sorted.length) {
      setIsLoadingMore(true);
      setTimeout(() => {
        setDisplayedAnimes(sorted.slice(0, endIndex));
        setCurrentPage(nextPage);
        setIsLoadingMore(false);
      }, 300);
    }
  }, [currentPage, isLoadingMore, allAnimes, sortMethod, sortAnimes]);

  const hasMore = displayedAnimes.length < allAnimes.length;

  return (
    <div className="w-full">
      {/* Sort Controls */}
      <div className="mb-6 space-y-3">
        <div className="text-xs text-gray-500 font-medium uppercase tracking-wider">Ordenar por</div>
        
        <div className="flex gap-2 flex-wrap">
          {[
            { value: 'popularity', label: '🔥 Mais Populares' },
            { value: 'rating', label: '⭐ Melhores Avaliadas' },
            { value: 'year', label: '📅 Mais Recentes' },
            { value: 'episodes', label: '📺 Mais Episódios' },
            { value: 'title', label: '🔤 A-Z' },
          ].map(option => (
            <button
              key={option.value}
              onClick={() => setSortMethod(option.value)}
              className={`px-3 py-2 text-sm rounded-lg font-medium transition-all whitespace-nowrap ${
                sortMethod === option.value
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg ring-2 ring-blue-400/50'
                  : 'bg-gray-800/50 text-gray-300 border border-gray-700/50 hover:bg-gray-700/50 hover:border-gray-600/50'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>
            <span className="text-white font-semibold">{displayedAnimes.length}</span>
            <span> / </span>
            <span className="text-white font-semibold">{allAnimes.length}</span>
          </span>
        </div>
      </div>

      {/* Anime Grid */}
      <div 
        ref={gridRef}
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
      >
        {displayedAnimes.length > 0 ? (
          displayedAnimes.map((anime, idx) => {
            const title = anime.base_title || anime.title?.english || anime.title?.romaji || 'Unknown';
            const coverImage = anime.coverImage || anime.cover_image;
            const uniqueKey = `anime-${anime.id}-${idx}`;
            
            return (
              <a key={uniqueKey} href={`/anime/${anime.id}`} className="group block">
                <article className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-lg ring-2 ring-transparent hover:ring-blue-500/50 transition-all">
                  <img 
                    src={coverImage || '/placeholder-anime.svg'} 
                    alt={title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
                    loading="lazy" 
                    onError={(e) => { e.currentTarget.src = '/placeholder-anime.svg'; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <h3 className="text-white font-semibold text-sm line-clamp-2 mb-1">{title}</h3>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-gray-300">{anime.count || anime.episodes || 0} episódios</span>
                        {(anime.averageScore || anime.average_score) && (
                          <span className="text-yellow-400">★ {anime.averageScore || anime.average_score}%</span>
                        )}
                      </div>
                      {anime.popularity && (
                        <div className="text-xs text-purple-400 mb-1">
                          🔥 {anime.popularity.toLocaleString()} fãs
                        </div>
                      )}
                      {anime.genres && anime.genres.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {anime.genres.slice(0, 2).map((genre, gIdx) => (
                            <span key={`${anime.id}-genre-${gIdx}`} className="text-xs px-2 py-0.5 bg-blue-600/80 rounded-full text-white">
                              {genre}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/90 to-transparent group-hover:opacity-0 transition-opacity">
                    <h3 className="text-white font-medium text-xs line-clamp-2">{title}</h3>
                  </div>
                </article>
              </a>
            );
          })
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-400">📺 Nenhum anime encontrado</p>
          </div>
        )}
      </div>

      {/* Loading indicator */}
      {isLoadingMore && (
        <div className="w-full py-8 flex justify-center">
          <div className="flex items-center gap-2">
            <div className="animate-spin w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full" />
            <span className="text-gray-400">Carregando mais animes...</span>
          </div>
        </div>
      )}

      {/* Load More button */}
      {hasMore && !isLoadingMore && (
        <div className="w-full py-8 flex justify-center">
          <button
            onClick={loadMore}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl"
          >
            Carregar Mais Animes
          </button>
        </div>
      )}

      {/* End of results */}
      {!hasMore && displayedAnimes.length > 0 && (
        <div className="w-full py-8 flex justify-center">
          <div className="text-center space-y-2">
            <p className="text-gray-300 text-sm">
              Você explorou todos os {displayedAnimes.length} animes disponíveis! 🎉
            </p>
            <p className="text-gray-500 text-xs">
              💡 Dica: Para adicionar novos animes, execute <code className="bg-slate-800 px-2 py-1 rounded">npm run scrape</code> localmente
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

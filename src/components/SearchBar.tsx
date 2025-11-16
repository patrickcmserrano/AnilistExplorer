import { useState, useMemo, useEffect } from 'react';

interface Anime {
  id: number | string;
  title?: {
    english?: string;
    romaji?: string;
    native?: string;
  };
  base_title?: string;
  genres?: string[];
  status?: string;
  coverImage?: string;
  cover_image?: string;
  count?: number;
  episodes?: number;
  first_date?: string;
  averageScore?: number;
  average_score?: number;
  seeders?: number;
  leechers?: number;
}

interface Props {
  animes: Anime[];
}

export default function SearchBar({ animes }: Props) {
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // Helper to get title variants (english, romaji, base_title) for better search coverage
  const getTitle = (anime: Anime) => anime.base_title || anime.title?.english || anime.title?.romaji || '';
  const getTitleVariants = (anime: Anime) => {
    const variants: string[] = [];
    if (anime.base_title) variants.push(anime.base_title);
    if (anime.title?.english) variants.push(anime.title.english);
    if (anime.title?.romaji) variants.push(anime.title.romaji);
    return variants.join(' | ');
  };

  const genres = useMemo(() => {
    const allGenres = animes.flatMap(a => a.genres || []);
    return [...new Set(allGenres)].sort();
  }, [animes]);

  const filteredAnimes = useMemo(() => {
    return animes.filter(anime => {
      const titleCombined = getTitleVariants(anime).toLowerCase();
      const matchesQuery =
        query === '' || titleCombined.includes(query.toLowerCase()) || (getTitle(anime) || '').toLowerCase().includes(query.toLowerCase());
      const matchesGenre = selectedGenre === '' || anime.genres?.includes(selectedGenre);
      const matchesStatus = selectedStatus === '' || anime.status === selectedStatus;
      return matchesQuery && matchesGenre && matchesStatus;
    });
  }, [animes, query, selectedGenre, selectedStatus]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        // Debug logs to help trace why searches return no results
        // eslint-disable-next-line no-console
        console.log('[SearchBar] query:', query, 'filtered:', filteredAnimes.length, 'window.updateInfiniteGrid?', !!(window as any).updateInfiniteGrid);
        if ((window as any).updateInfiniteGrid) {
          (window as any).updateInfiniteGrid(filteredAnimes);
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn('[SearchBar] updateInfiniteGrid failed', e);
      }
    }
  }, [filteredAnimes]);

  return (
    <div className="mb-6" suppressHydrationWarning>
      {/* Search Bar with Filters Toggle */}
      <div className="flex gap-3 items-center mb-4" suppressHydrationWarning>
        {/* Search Input */}
        <div className="flex-1 relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
          <input
            type="text"
            placeholder="Buscar..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 text-sm bg-gray-800/50 border border-gray-700/50 rounded-lg focus:outline-none focus:border-blue-500/50 text-white placeholder-gray-500 transition"
          />
        </div>

        {/* Filters Toggle Button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`px-4 py-2.5 text-sm font-medium rounded-lg transition whitespace-nowrap ${
            showFilters
              ? 'bg-blue-600/30 text-blue-300 border border-blue-500/30'
              : 'bg-gray-800/50 text-gray-400 border border-gray-700/50 hover:bg-gray-700/50'
          }`}
        >
          {showFilters ? '✕' : '⚙️'} Filtros
        </button>
      </div>

      {/* Collapsible Filters Panel */}
      {showFilters && (
        <div className="mb-4 p-4 bg-gray-800/30 rounded-lg border border-gray-700/30 backdrop-blur-sm">
          <div className="flex gap-3 flex-wrap items-end">
            {/* Genre Filter */}
            <div className="flex-1 min-w-[180px]">
              <label className="block text-xs text-gray-400 mb-2 font-medium">Gênero</label>
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500/50 transition"
              >
                <option value="">Todos os gêneros</option>
                {genres.map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex-1 min-w-[180px]">
              <label className="block text-xs text-gray-400 mb-2 font-medium">Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500/50 transition"
              >
                <option value="">Todos os status</option>
                <option value="FINISHED">Finalizado</option>
                <option value="RELEASING">Em lançamento</option>
                <option value="NOT_YET_RELEASED">Não lançado</option>
              </select>
            </div>

            {/* Clear Filters Button */}
            {(selectedGenre || selectedStatus) && (
              <button
                onClick={() => {
                  setSelectedGenre('');
                  setSelectedStatus('');
                }}
                className="px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition"
              >
                🔄 Limpar
              </button>
            )}
          </div>
        </div>
      )}

      {/* Results Counter */}
      <div className="flex items-center justify-between text-sm">
        <div className="text-gray-400">
          <span className="font-semibold text-white">{filteredAnimes.length}</span>
          <span> animes</span>
        </div>
        {(selectedGenre || selectedStatus) && (
          <div className="text-xs text-blue-400">
            Filtros aplicados
          </div>
        )}
      </div>
    </div>
  );
}

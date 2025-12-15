/**
 * Reusable component for displaying filtered anime lists (Watch Later or Favorites)
 */

import { useState, useMemo, useEffect } from 'react';
import AnimeCardQuickActions from './AnimeCardQuickActions';


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
    genres?: string[];
    status?: string;
    count?: number;
    episodes?: number;
    averageScore?: number;
    average_score?: number;
    popularity?: number;
    seasonYear?: number;
}

interface AnimeListPageProps {
    animes: Anime[];
    listType: 'watch-later' | 'favorites';
    onClearAll?: () => void;
}

export default function AnimeListPage({ animes: initialAnimes, listType, onClearAll }: AnimeListPageProps) {
    const [animes, setAnimes] = useState<Anime[]>(initialAnimes);
    const [query, setQuery] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [sortMethod, setSortMethod] = useState('addedRecent');

    // Load animes from window global if available (set by Astro page)
    useEffect(() => {
        if (typeof window !== 'undefined') {
            // Check if this is a shared list first
            const sharedAnimes = (window as any).__SHARED_ANIMES__;
            if (sharedAnimes && Array.isArray(sharedAnimes)) {
                setAnimes(sharedAnimes);
                return;
            }

            // Otherwise load regular list
            const globalKey = listType === 'watch-later' ? '__WATCH_LATER_ANIMES__' : '__FAVORITES_ANIMES__';
            const loadedAnimes = (window as any)[globalKey];
            if (loadedAnimes && Array.isArray(loadedAnimes)) {
                setAnimes(loadedAnimes);
            }
        }
    }, [listType]);

    // Handle clear all with window global function
    const handleClearAll = () => {
        if (typeof window !== 'undefined') {
            const clearFn = listType === 'watch-later'
                ? (window as any).__CLEAR_WATCH_LATER__
                : (window as any).__CLEAR_FAVORITES__;
            if (clearFn && typeof clearFn === 'function') {
                if (confirm(`Tem certeza que deseja limpar toda a lista de ${listType === 'watch-later' ? 'Watch Later' : 'Favoritos'}?`)) {
                    clearFn();
                }
            }
        }
    };

    const getTitle = (anime: Anime) =>
        anime.base_title || anime.title?.english || anime.title?.romaji || 'Unknown';

    const getTitleVariants = (anime: Anime) => {
        const variants: string[] = [];
        if (anime.base_title) variants.push(anime.base_title);
        if (anime.title?.english) variants.push(anime.title.english);
        if (anime.title?.romaji) variants.push(anime.title.romaji);
        return variants.join(' | ');
    };

    // Extract all unique genres
    const genres = useMemo(() => {
        const allGenres = animes.flatMap(a => a.genres || []);
        return [...new Set(allGenres)].sort();
    }, [animes]);

    // Filter and sort animes
    const processedAnimes = useMemo(() => {
        // Filter
        let filtered = animes.filter(anime => {
            const titleCombined = getTitleVariants(anime).toLowerCase();
            const matchesQuery = query === '' || titleCombined.includes(query.toLowerCase());
            const matchesGenre = selectedGenre === '' || anime.genres?.includes(selectedGenre);
            const matchesStatus = selectedStatus === '' || anime.status === selectedStatus;
            return matchesQuery && matchesGenre && matchesStatus;
        });

        // Sort
        const sorted = [...filtered];
        switch (sortMethod) {
            case 'addedRecent':
                // Already in order of addition (newest first)
                break;
            case 'popularity':
                sorted.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
                break;
            case 'rating':
                sorted.sort((a, b) => (b.averageScore || b.average_score || 0) - (a.averageScore || a.average_score || 0));
                break;
            case 'title':
                sorted.sort((a, b) => getTitle(a).localeCompare(getTitle(b)));
                break;
        }

        return sorted;
    }, [animes, query, selectedGenre, selectedStatus, sortMethod]);

    const listTitle = listType === 'watch-later' ? '🕒 Watch Later' : '❤️ Favoritos';
    const emptyMessage = listType === 'watch-later'
        ? 'Nenhum anime em Watch Later ainda! Navegue e adicione animes que você quer assistir depois.'
        : 'Nenhum favorito ainda! Adicione animes que você ama aos seus favoritos.';

    return (
        <div className="w-full space-y-6">
            {/* Header with Title and Clear Button */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white">{listTitle}</h2>
                    <p className="text-sm text-gray-400 mt-1">
                        {animes.length} {animes.length === 1 ? 'anime' : 'animes'}
                    </p>
                </div>
                {animes.length > 0 && (
                    <button
                        onClick={handleClearAll}
                        className="px-4 py-2 text-sm bg-red-600/20 border border-red-500/50 text-red-300 rounded-lg hover:bg-red-600/30 transition"
                    >
                        🗑️ Limpar Tudo
                    </button>
                )}
            </div>

            {animes.length === 0 ? (
                <div className="text-center py-16 bg-slate-800/30 rounded-lg border border-slate-700/50">
                    <p className="text-gray-300 text-lg mb-2">📺 Lista Vazia</p>
                    <p className="text-gray-500 text-sm max-w-md mx-auto">{emptyMessage}</p>
                </div>
            ) : (
                <>
                    {/* Search and Filters */}
                    <div className="space-y-4">
                        {/* Search Bar */}
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
                            <input
                                type="text"
                                placeholder="Buscar..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="w-full pl-9 pr-3 py-2.5 text-sm bg-gray-800/50 border border-gray-700/50 rounded-lg focus:outline-none focus:border-blue-500/50 text-white placeholder-gray-500 transition"
                            />
                        </div>

                        {/* Filter Row */}
                        <div className="flex gap-3 flex-wrap">
                            {/* Genre Filter */}
                            <select
                                value={selectedGenre}
                                onChange={(e) => setSelectedGenre(e.target.value)}
                                className="px-3 py-2 text-sm bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500/50 transition"
                            >
                                <option value="">Todos os gêneros</option>
                                {genres.map(genre => (
                                    <option key={genre} value={genre}>{genre}</option>
                                ))}
                            </select>

                            {/* Status Filter */}
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="px-3 py-2 text-sm bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500/50 transition"
                            >
                                <option value="">Todos os status</option>
                                <option value="FINISHED">Finalizado</option>
                                <option value="RELEASING">Em lançamento</option>
                                <option value="NOT_YET_RELEASED">Não lançado</option>
                            </select>

                            {/* Clear Filters */}
                            {(selectedGenre || selectedStatus || query) && (
                                <button
                                    onClick={() => {
                                        setQuery('');
                                        setSelectedGenre('');
                                        setSelectedStatus('');
                                    }}
                                    className="px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition"
                                >
                                    🔄 Limpar Filtros
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Sort Controls */}
                    <div className="space-y-3">
                        <div className="text-xs text-gray-500 font-medium uppercase">Ordenar por</div>
                        <div className="flex gap-2 flex-wrap">
                            {[
                                { value: 'addedRecent', label: '🕒 Adicionados Recentemente' },
                                { value: 'popularity', label: '🔥 Popularidade' },
                                { value: 'rating', label: '⭐ Avaliação' },
                                { value: 'title', label: '🔤 A-Z' },
                            ].map(option => (
                                <button
                                    key={option.value}
                                    onClick={() => setSortMethod(option.value)}
                                    className={`px-3 py-2 text-sm rounded-lg font-medium transition-all whitespace-nowrap ${sortMethod === option.value
                                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                                        : 'bg-gray-800/50 text-gray-300 border border-gray-700/50 hover:bg-gray-700/50'
                                        }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Results Count */}
                    <div className="text-sm text-gray-400">
                        Mostrando <span className="text-white font-semibold">{processedAnimes.length}</span> de{' '}
                        <span className="text-white font-semibold">{animes.length}</span>
                    </div>

                    {/* Anime Grid */}
                    {processedAnimes.length === 0 ? (
                        <div className="text-center py-12 bg-slate-800/20 rounded-lg">
                            <p className="text-gray-400">📺 Nenhum anime encontrado com os filtros atuais</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                            {processedAnimes.map((anime, idx) => {
                                const title = getTitle(anime);
                                const coverImage = anime.coverImage || anime.cover_image;
                                const uniqueKey = `anime-${anime.id}-${idx}`;

                                return (
                                    <a key={uniqueKey} href={`${import.meta.env.BASE_URL}anime/${anime.id}/`} className="group block">
                                        <article className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-lg ring-2 ring-transparent hover:ring-blue-500/50 transition-all">
                                            <img
                                                src={coverImage || '/placeholder-anime.svg'}
                                                alt={title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                loading="lazy"
                                                onError={(e) => { e.currentTarget.src = '/placeholder-anime.svg'; }}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                                {/* Quick Action Buttons - Top Right */}
                                                <div className="absolute top-2 right-2 z-10">
                                                    <AnimeCardQuickActions
                                                        animeId={anime.id}
                                                        animeTitle={title}
                                                        animeCover={coverImage}
                                                    />
                                                </div>

                                                {/* Card Info - Bottom */}
                                                <div className="absolute bottom-0 left-0 right-0 p-3">
                                                    <h3 className="text-white font-semibold text-sm line-clamp-2 mb-1">{title}</h3>
                                                    <div className="flex items-center justify-between text-xs mb-1">
                                                        <span className="text-gray-300">{anime.count || anime.episodes || 0} ep</span>
                                                        {(anime.averageScore || anime.average_score) && (
                                                            <span className="text-yellow-400">★ {anime.averageScore || anime.average_score}%</span>
                                                        )}
                                                    </div>
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
                            })}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

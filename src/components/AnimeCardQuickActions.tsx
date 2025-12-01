/**
 * Compact quick action buttons for anime cards
 * Allows adding to watch later and favorites directly from the grid
 */

import { useState, useEffect } from 'react';
import { useAnimeList } from '../utils/useAnimeList';

interface AnimeCardQuickActionsProps {
    animeId: number | string;
    animeTitle: string;
    animeCover?: string;
}

export default function AnimeCardQuickActions({ animeId, animeTitle, animeCover }: AnimeCardQuickActionsProps) {
    const {
        isInWatchLater,
        toggleWatchLater,
        isInFavorites,
        toggleFavorites,
    } = useAnimeList();

    const [inWatchLater, setInWatchLater] = useState(false);
    const [inFavorites, setInFavorites] = useState(false);

    // Check initial state
    useEffect(() => {
        setInWatchLater(isInWatchLater(animeId));
        setInFavorites(isInFavorites(animeId));
    }, [animeId, isInWatchLater, isInFavorites]);

    const handleWatchLater = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigation to detail page
        e.stopPropagation();

        const wasInList = inWatchLater;
        const success = toggleWatchLater({
            id: animeId,
            title: animeTitle,
            coverImage: animeCover,
        });

        if (success) {
            setInWatchLater(!wasInList);
        }
    };

    const handleFavorites = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigation to detail page
        e.stopPropagation();

        const wasInList = inFavorites;
        const success = toggleFavorites({
            id: animeId,
            title: animeTitle,
            coverImage: animeCover,
        });

        if (success) {
            setInFavorites(!wasInList);
        }
    };

    return (
        <div className="flex gap-1.5">
            {/* Watch Later Button */}
            <button
                onClick={handleWatchLater}
                className={`
          p-1.5 rounded-md backdrop-blur-sm transition-all duration-200 transform hover:scale-110
          ${inWatchLater
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-black/60 text-white/80 hover:bg-blue-600/80 hover:text-white'
                    }
        `}
                title={inWatchLater ? 'Remove from watch later' : 'Add to watch later'}
                aria-label={inWatchLater ? 'Remove from watch later' : 'Add to watch later'}
            >
                <span className="text-sm">{inWatchLater ? '✓' : '🕒'}</span>
            </button>

            {/* Favorites Button */}
            <button
                onClick={handleFavorites}
                className={`
          p-1.5 rounded-md backdrop-blur-sm transition-all duration-200 transform hover:scale-110
          ${inFavorites
                        ? 'bg-gradient-to-r from-pink-600 to-red-600 text-white shadow-lg'
                        : 'bg-black/60 text-white/80 hover:bg-pink-600/80 hover:text-white'
                    }
        `}
                title={inFavorites ? 'Remove from favorites' : 'Add to favorites'}
                aria-label={inFavorites ? 'Remove from favorites' : 'Add to favorites'}
            >
                <span className="text-sm">{inFavorites ? '❤️' : '🤍'}</span>
            </button>
        </div>
    );
}

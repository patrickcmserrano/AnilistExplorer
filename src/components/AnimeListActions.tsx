/**
 * Action buttons component for adding/removing anime from watch later and favorites lists
 */

import { useState, useEffect } from 'react';
import { useAnimeList } from '../utils/useAnimeList';

interface AnimeListActionsProps {
    animeId: number | string;
    animeTitle: string;
    animeCover?: string;
}

export default function AnimeListActions({ animeId, animeTitle, animeCover }: AnimeListActionsProps) {
    const {
        isInWatchLater,
        toggleWatchLater,
        isInFavorites,
        toggleFavorites,
    } = useAnimeList();

    const [inWatchLater, setInWatchLater] = useState(false);
    const [inFavorites, setInFavorites] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    // Check initial state
    useEffect(() => {
        setInWatchLater(isInWatchLater(animeId));
        setInFavorites(isInFavorites(animeId));
    }, [animeId, isInWatchLater, isInFavorites]);

    const showNotification = (message: string) => {
        setToastMessage(message);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    const handleWatchLater = () => {
        const wasInList = inWatchLater;
        const success = toggleWatchLater({
            id: animeId,
            title: animeTitle,
            coverImage: animeCover,
        });

        if (success) {
            setInWatchLater(!wasInList);
            showNotification(
                wasInList
                    ? '🗑️ Removido de Watch Later'
                    : '🕒 Adicionado a Watch Later'
            );
        }
    };

    const handleFavorites = () => {
        const wasInList = inFavorites;
        const success = toggleFavorites({
            id: animeId,
            title: animeTitle,
            coverImage: animeCover,
        });

        if (success) {
            setInFavorites(!wasInList);
            showNotification(
                wasInList
                    ? '💔 Removido dos Favoritos'
                    : '❤️ Adicionado aos Favoritos'
            );
        }
    };

    return (
        <>
            <div className="flex gap-3 flex-wrap">
                {/* Watch Later Button */}
                <button
                    onClick={handleWatchLater}
                    className={`
            flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm
            transition-all duration-200 transform hover:scale-105
            ${inWatchLater
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 hover:bg-blue-700'
                            : 'bg-slate-800 text-slate-300 border-2 border-slate-600 hover:border-blue-500 hover:text-blue-400'
                        }
          `}
                    aria-label={inWatchLater ? 'Remove from watch later' : 'Add to watch later'}
                >
                    <span className="text-lg">{inWatchLater ? '✓' : '🕒'}</span>
                    <span>Watch Later</span>
                </button>

                {/* Favorites Button */}
                <button
                    onClick={handleFavorites}
                    className={`
            flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm
            transition-all duration-200 transform hover:scale-105
            ${inFavorites
                            ? 'bg-gradient-to-r from-pink-600 to-red-600 text-white shadow-lg shadow-pink-500/30 hover:from-pink-700 hover:to-red-700'
                            : 'bg-slate-800 text-slate-300 border-2 border-slate-600 hover:border-pink-500 hover:text-pink-400'
                        }
          `}
                    aria-label={inFavorites ? 'Remove from favorites' : 'Add to favorites'}
                >
                    <span className="text-lg">{inFavorites ? '❤️' : '🤍'}</span>
                    <span>Favoritos</span>
                </button>
            </div>

            {/* Toast Notification */}
            {showToast && (
                <div className="fixed bottom-8 right-8 z-50 animate-slide-up">
                    <div className="bg-slate-800 border border-slate-600 text-white px-6 py-3 rounded-lg shadow-2xl flex items-center gap-3">
                        <span className="text-sm font-medium">{toastMessage}</span>
                    </div>
                </div>
            )}

            {/* Animation styles */}
            <style>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
        </>
    );
}

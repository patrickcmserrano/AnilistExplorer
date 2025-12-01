/**
 * React hooks for managing anime watch later and favorites lists
 */

import { useState, useEffect, useCallback } from 'react';
import { watchLater, favorites, type AnimeListItem } from './localStorage';

export interface AnimeItem {
    id: number | string;
    title: string;
    coverImage?: string;
}

export function useAnimeList() {
    const [watchLaterItems, setWatchLaterItems] = useState<AnimeListItem[]>([]);
    const [favoritesItems, setFavoritesItems] = useState<AnimeListItem[]>([]);

    // Load initial data from localStorage
    useEffect(() => {
        setWatchLaterItems(watchLater.getAll());
        setFavoritesItems(favorites.getAll());
    }, []);

    // Watch Later Functions
    const addToWatchLater = useCallback((anime: AnimeItem) => {
        const success = watchLater.add(anime);
        if (success) {
            setWatchLaterItems(watchLater.getAll());
        }
        return success;
    }, []);

    const removeFromWatchLater = useCallback((id: number | string) => {
        const success = watchLater.remove(id);
        if (success) {
            setWatchLaterItems(watchLater.getAll());
        }
        return success;
    }, []);

    const isInWatchLater = useCallback((id: number | string) => {
        return watchLater.has(id);
    }, []);

    const toggleWatchLater = useCallback((anime: AnimeItem) => {
        if (isInWatchLater(anime.id)) {
            return removeFromWatchLater(anime.id);
        } else {
            return addToWatchLater(anime);
        }
    }, [isInWatchLater, removeFromWatchLater, addToWatchLater]);

    const clearWatchLater = useCallback(() => {
        const success = watchLater.clear();
        if (success) {
            setWatchLaterItems([]);
        }
        return success;
    }, []);

    // Favorites Functions
    const addToFavorites = useCallback((anime: AnimeItem) => {
        const success = favorites.add(anime);
        if (success) {
            setFavoritesItems(favorites.getAll());
        }
        return success;
    }, []);

    const removeFromFavorites = useCallback((id: number | string) => {
        const success = favorites.remove(id);
        if (success) {
            setFavoritesItems(favorites.getAll());
        }
        return success;
    }, []);

    const isInFavorites = useCallback((id: number | string) => {
        return favorites.has(id);
    }, []);

    const toggleFavorites = useCallback((anime: AnimeItem) => {
        if (isInFavorites(anime.id)) {
            return removeFromFavorites(anime.id);
        } else {
            return addToFavorites(anime);
        }
    }, [isInFavorites, removeFromFavorites, addToFavorites]);

    const clearFavorites = useCallback(() => {
        const success = favorites.clear();
        if (success) {
            setFavoritesItems([]);
        }
        return success;
    }, []);

    return {
        // Watch Later
        watchLaterItems,
        addToWatchLater,
        removeFromWatchLater,
        isInWatchLater,
        toggleWatchLater,
        clearWatchLater,

        // Favorites
        favoritesItems,
        addToFavorites,
        removeFromFavorites,
        isInFavorites,
        toggleFavorites,
        clearFavorites,
    };
}

/**
 * Type-safe localStorage utilities for anime lists
 * Handles watch later and favorites persistence with error handling
 */

export interface AnimeListItem {
    id: number | string;
    title: string;
    coverImage?: string;
    addedAt: number; // timestamp
}

const WATCH_LATER_KEY = 'anilist_watch_later';
const FAVORITES_KEY = 'anilist_favorites';

/**
 * Check if we're in a browser environment
 */
const isBrowser = typeof window !== 'undefined';

/**
 * Generic function to load data from localStorage
 */
function loadFromStorage<T>(key: string, defaultValue: T): T {
    if (!isBrowser) return defaultValue;

    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.warn(`Failed to load ${key} from localStorage:`, error);
        return defaultValue;
    }
}

/**
 * Generic function to save data to localStorage
 */
function saveToStorage<T>(key: string, value: T): boolean {
    if (!isBrowser) return false;

    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error(`Failed to save ${key} to localStorage:`, error);
        return false;
    }
}

/**
 * Watch Later List Functions
 */
export const watchLater = {
    getAll: (): AnimeListItem[] => {
        return loadFromStorage<AnimeListItem[]>(WATCH_LATER_KEY, []);
    },

    add: (item: Omit<AnimeListItem, 'addedAt'>): boolean => {
        const items = watchLater.getAll();
        const newItem: AnimeListItem = {
            ...item,
            addedAt: Date.now()
        };

        // Avoid duplicates
        if (items.some(i => i.id === item.id)) {
            return false;
        }

        items.unshift(newItem); // Add to beginning
        return saveToStorage(WATCH_LATER_KEY, items);
    },

    remove: (id: number | string): boolean => {
        const items = watchLater.getAll();
        const filtered = items.filter(i => i.id !== id);
        return saveToStorage(WATCH_LATER_KEY, filtered);
    },

    has: (id: number | string): boolean => {
        const items = watchLater.getAll();
        return items.some(i => i.id === id);
    },

    clear: (): boolean => {
        return saveToStorage(WATCH_LATER_KEY, []);
    },

    getIds: (): (number | string)[] => {
        return watchLater.getAll().map(i => i.id);
    }
};

/**
 * Favorites List Functions
 */
export const favorites = {
    getAll: (): AnimeListItem[] => {
        return loadFromStorage<AnimeListItem[]>(FAVORITES_KEY, []);
    },

    add: (item: Omit<AnimeListItem, 'addedAt'>): boolean => {
        const items = favorites.getAll();
        const newItem: AnimeListItem = {
            ...item,
            addedAt: Date.now()
        };

        // Avoid duplicates
        if (items.some(i => i.id === item.id)) {
            return false;
        }

        items.unshift(newItem); // Add to beginning
        return saveToStorage(FAVORITES_KEY, items);
    },

    remove: (id: number | string): boolean => {
        const items = favorites.getAll();
        const filtered = items.filter(i => i.id !== id);
        return saveToStorage(FAVORITES_KEY, filtered);
    },

    has: (id: number | string): boolean => {
        const items = favorites.getAll();
        return items.some(i => i.id === id);
    },

    clear: (): boolean => {
        return saveToStorage(FAVORITES_KEY, []);
    },

    getIds: (): (number | string)[] => {
        return favorites.getAll().map(i => i.id);
    }
};

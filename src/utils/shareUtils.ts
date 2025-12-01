/**
 * Utilities for sharing anime lists via URLs and JSON export/import
 * No authentication or backend required
 */

export type ListType = 'watch-later' | 'favorites';

export interface SharedListData {
    listType: ListType;
    animeIds: (number | string)[];
}

export interface ExportData {
    listType: ListType;
    exportedAt: string;
    count: number;
    animes: Array<{
        id: number | string;
        title: string;
        coverImage?: string;
    }>;
}

/**
 * Encode anime IDs to URL-safe base64 string
 */
export function encodeListToUrl(listType: ListType, animeIds: (number | string)[]): string {
    if (animeIds.length === 0) return '';

    // Join IDs with commas
    const idsString = animeIds.join(',');

    // Base64 encode (browser-safe)
    const encoded = btoa(idsString);

    // Format: listType:encodedIds
    return `${listType}:${encoded}`;
}

/**
 * Decode URL hash to get list type and anime IDs
 */
export function decodeUrlToList(urlHash: string): SharedListData | null {
    try {
        // Remove leading # if present
        const hash = urlHash.startsWith('#') ? urlHash.slice(1) : urlHash;

        // Split by colon
        const [listType, encoded] = hash.split(':');

        if (!listType || !encoded) return null;
        if (listType !== 'watch-later' && listType !== 'favorites') return null;

        // Base64 decode
        const idsString = atob(encoded);

        // Split by comma and convert to numbers
        const animeIds = idsString.split(',').map(id => {
            const num = Number(id);
            return isNaN(num) ? id : num;
        });

        return {
            listType: listType as ListType,
            animeIds
        };
    } catch (error) {
        console.error('Failed to decode URL:', error);
        return null;
    }
}

/**
 * Check if encoding the list would result in a URL that's too long
 * Most browsers support ~2000 chars total URL length
 */
export function isUrlSafe(animeIds: (number | string)[]): boolean {
    const encoded = encodeListToUrl('watch-later', animeIds);
    // Conservative limit: 1500 chars for the hash (leaving room for domain + path)
    return encoded.length <= 1500;
}

/**
 * Generate shareable URL with current origin
 */
export function generateShareableUrl(listType: ListType, animeIds: (number | string)[]): string {
    const encoded = encodeListToUrl(listType, animeIds);
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const baseUrl = import.meta.env.BASE_URL;
    return `${origin}${baseUrl}shared#${encoded}`;
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
    if (typeof navigator === 'undefined') return false;

    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (error) {
        // Fallback for older browsers
        try {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            const success = document.execCommand('copy');
            document.body.removeChild(textarea);
            return success;
        } catch (fallbackError) {
            console.error('Failed to copy to clipboard:', fallbackError);
            return false;
        }
    }
}

/**
 * Export list to JSON file
 */
export function exportListToJson(listType: ListType, animes: ExportData['animes']): void {
    const exportData: ExportData = {
        listType,
        exportedAt: new Date().toISOString(),
        count: animes.length,
        animes
    };

    const json = JSON.stringify(exportData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `anilist-${listType}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

/**
 * Import list from JSON string
 */
export function importListFromJson(jsonString: string): ExportData | null {
    try {
        const data = JSON.parse(jsonString) as ExportData;

        // Validate structure
        if (!data.listType || !data.animes || !Array.isArray(data.animes)) {
            throw new Error('Invalid JSON structure');
        }

        return data;
    } catch (error) {
        console.error('Failed to parse JSON:', error);
        return null;
    }
}

/**
 * Read file as text
 */
export function readFileAsText(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result as string;
            resolve(text);
        };
        reader.onerror = reject;
        reader.readAsText(file);
    });
}

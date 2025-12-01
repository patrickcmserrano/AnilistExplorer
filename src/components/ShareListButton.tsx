/**
 * Share button component for list pages with modal UI
 * Supports URL sharing and JSON export/import
 */

import { useState, useRef, useEffect } from 'react';
import {
    generateShareableUrl,
    copyToClipboard,
    exportListToJson,
    importListFromJson,
    readFileAsText,
    isUrlSafe,
    type ListType
} from '../utils/shareUtils';
import { watchLater, favorites } from '../utils/localStorage';

interface ShareListButtonProps {
    listType: ListType;
    animes: Array<{
        id: number | string;
        title?: { english?: string; romaji?: string };
        base_title?: string;
        coverImage?: string;
        cover_image?: string;
    }>;
}

export default function ShareListButton({ listType, animes: initialAnimes }: ShareListButtonProps) {
    const [animes, setAnimes] = useState(initialAnimes);
    const [showModal, setShowModal] = useState(false);
    const [shareUrl, setShareUrl] = useState('');
    const [copied, setCopied] = useState(false);
    const [urlTooLong, setUrlTooLong] = useState(false);
    const [importError, setImportError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Load animes from window global
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const globalKey = listType === 'watch-later' ? '__WATCH_LATER_ANIMES__' : '__FAVORITES_ANIMES__';
            const loadedAnimes = (window as any)[globalKey];
            if (loadedAnimes && Array.isArray(loadedAnimes)) {
                setAnimes(loadedAnimes);
            }
        }
    }, [listType]);

    const handleShare = () => {
        const animeIds = animes.map(a => a.id);

        // Check URL length
        const isSafe = isUrlSafe(animeIds);
        setUrlTooLong(!isSafe);

        if (isSafe) {
            const url = generateShareableUrl(listType, animeIds);
            setShareUrl(url);
        }

        setShowModal(true);
        setCopied(false);
        setImportError('');
    };

    const handleCopyLink = async () => {
        const success = await copyToClipboard(shareUrl);
        if (success) {
            setCopied(true);
            setTimeout(() => setCopied(false), 3000);
        }
    };

    const handleExportJson = () => {
        const exportAnimes = animes.map(anime => ({
            id: anime.id,
            title: anime.base_title || anime.title?.english || anime.title?.romaji || 'Unknown',
            coverImage: anime.coverImage || anime.cover_image
        }));

        exportListToJson(listType, exportAnimes);
    };

    const handleImportJson = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            const text = await readFileAsText(file);
            const data = importListFromJson(text);

            if (!data) {
                setImportError('Invalid JSON file format');
                return;
            }

            // Import to localStorage
            const storage = listType === 'watch-later' ? watchLater : favorites;

            // Add each anime to the list
            let importedCount = 0;
            for (const anime of data.animes) {
                const success = storage.add({
                    id: anime.id,
                    title: anime.title,
                    coverImage: anime.coverImage
                });
                if (success) importedCount++;
            }

            // Reload page to show updated list
            alert(`Successfully imported ${importedCount} anime(s) to your ${listType === 'watch-later' ? 'Watch Later' : 'Favorites'} list!`);
            window.location.reload();
        } catch (error) {
            setImportError('Failed to read file');
            console.error(error);
        }
    };

    const listTitle = listType === 'watch-later' ? 'Watch Later' : 'Favorites';

    return (
        <>
            {/* Share Button */}
            <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600/20 border border-purple-500/50 text-purple-300 rounded-lg hover:bg-purple-600/30 transition text-sm font-medium"
            >
                <span>📤</span>
                <span>Share List</span>
            </button>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
                    <div className="bg-slate-800 rounded-xl border border-slate-700 max-w-lg w-full p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        {/* Header */}
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-white">Share Your {listTitle} List</h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 hover:text-white transition"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Content */}
                        <div className="space-y-6">
                            {/* URL Sharing */}
                            {!urlTooLong ? (
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-sm text-gray-400 mb-2">
                                            Share Link ({animes.length} anime{animes.length !== 1 ? 's' : ''})
                                        </p>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={shareUrl}
                                                readOnly
                                                className="flex-1 px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white text-sm"
                                                onClick={(e) => e.currentTarget.select()}
                                            />
                                            <button
                                                onClick={handleCopyLink}
                                                className={`px-4 py-2 rounded-lg font-medium text-sm transition ${copied
                                                    ? 'bg-green-600 text-white'
                                                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                                                    }`}
                                            >
                                                {copied ? '✓ Copied!' : '📋 Copy'}
                                            </button>
                                        </div>
                                    </div>

                                    <p className="text-xs text-gray-500">
                                        Anyone with this link can view your list (read-only)
                                    </p>
                                </div>
                            ) : (
                                <div className="bg-yellow-900/20 border border-yellow-500/50 rounded-lg p-4">
                                    <p className="text-yellow-300 text-sm">
                                        ⚠️ Your list is too large for URL sharing ({animes.length} animes). Please use JSON export instead.
                                    </p>
                                </div>
                            )}

                            {/* Divider */}
                            <div className="flex items-center gap-3">
                                <div className="flex-1 h-px bg-slate-700"></div>
                                <span className="text-gray-500 text-sm">OR</span>
                                <div className="flex-1 h-px bg-slate-700"></div>
                            </div>

                            {/* JSON Export/Import */}
                            <div className="space-y-3">
                                <p className="text-sm text-gray-400">File Export/Import</p>

                                <div className="flex gap-2">
                                    <button
                                        onClick={handleExportJson}
                                        className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition"
                                    >
                                        💾 Download JSON
                                    </button>

                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition"
                                    >
                                        📥 Import JSON
                                    </button>
                                </div>

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".json"
                                    onChange={handleImportJson}
                                    className="hidden"
                                />

                                {importError && (
                                    <p className="text-red-400 text-sm">❌ {importError}</p>
                                )}

                                <p className="text-xs text-gray-500">
                                    Import will add animes to your current list
                                </p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="mt-6 pt-4 border-t border-slate-700">
                            <button
                                onClick={() => setShowModal(false)}
                                className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

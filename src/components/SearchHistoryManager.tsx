import React from 'react';
import { Clock, X, TrendingUp, BarChart3 } from 'lucide-react';
import { useSearch } from '../contexts/SearchContext';

interface SearchHistoryManagerProps {
    isOpen: boolean;
    onClose: () => void;
}

const SearchHistoryManager: React.FC<SearchHistoryManagerProps> = ({ isOpen, onClose }) => {
    const { searchHistory, clearSearchHistory } = useSearch();

    // Get search analytics from localStorage
    const getSearchAnalytics = () => {
        try {
            const analytics = localStorage.getItem('bookbuddy-search-analytics');
            return analytics ? JSON.parse(analytics) : {};
        } catch {
            return {};
        }
    };

    const searchAnalytics = getSearchAnalytics();

    const removeFromHistory = (queryToRemove: string) => {
        const currentHistory = [...searchHistory];
        const updatedHistory = currentHistory.filter(query => query !== queryToRemove);

        // Update localStorage
        try {
            localStorage.setItem('bookbuddy-search-history', JSON.stringify(updatedHistory));
        } catch {
            // Fail silently
        }

        // Force a page refresh to update the state (or implement a more sophisticated state management)
        window.location.reload();
    };

    const exportSearchData = () => {
        const data = {
            searchHistory,
            searchAnalytics,
            exportDate: new Date().toISOString(),
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `bookbuddy-search-data-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                            <BarChart3 className="w-5 h-5" />
                            Search History & Analytics
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="overflow-y-auto max-h-[60vh]">
                    {/* Search History */}
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-medium text-gray-800 flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                Recent Searches ({searchHistory.length})
                            </h3>
                            <button
                                onClick={clearSearchHistory}
                                className="text-sm text-red-600 hover:text-red-700 transition-colors"
                            >
                                Clear All
                            </button>
                        </div>

                        {searchHistory.length === 0 ? (
                            <p className="text-gray-500 text-center py-4">No search history yet</p>
                        ) : (
                            <div className="space-y-2">
                                {searchHistory.map((query, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                    >
                                        <span className="text-gray-700">{query}</span>
                                        <button
                                            onClick={() => removeFromHistory(query)}
                                            className="p-1 hover:bg-gray-200 rounded transition-colors"
                                        >
                                            <X className="w-4 h-4 text-gray-500" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Search Analytics */}
                    <div className="p-6">
                        <h3 className="font-medium text-gray-800 flex items-center gap-2 mb-4">
                            <TrendingUp className="w-4 h-4" />
                            Popular Searches
                        </h3>

                        {Object.keys(searchAnalytics).length === 0 ? (
                            <p className="text-gray-500 text-center py-4">No search analytics yet</p>
                        ) : (
                            <div className="space-y-2">
                                {Object.entries(searchAnalytics)
                                    .sort(([, a], [, b]) => (b as number) - (a as number))
                                    .slice(0, 10)
                                    .map(([query, count]) => (
                                        <div
                                            key={query}
                                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                        >
                                            <span className="text-gray-700">{query}</span>
                                            <span className="text-sm text-gray-500 bg-gray-200 px-2 py-1 rounded">
                                                {count} searches
                                            </span>
                                        </div>
                                    ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="p-6 border-t border-gray-200">
                    <div className="flex gap-3">
                        <button
                            onClick={exportSearchData}
                            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors"
                        >
                            Export Data
                        </button>
                        <button
                            onClick={onClose}
                            className="flex-1 bg-lime-400 hover:bg-lime-500 text-gray-900 py-2 px-4 rounded-lg font-medium transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchHistoryManager;

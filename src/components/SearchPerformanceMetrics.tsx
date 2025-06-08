import React, { useEffect, useState } from 'react';
import { Clock, Search, TrendingUp, Users } from 'lucide-react';

interface SearchMetrics {
    totalSearches: number;
    averageSearchTime: number;
    topSearchTerms: Array<{ term: string; count: number }>;
    searchesThisSession: number;
    lastSearchTime: number | null;
}

const SearchPerformanceMetrics: React.FC = () => {
    const [metrics, setMetrics] = useState<SearchMetrics>({
        totalSearches: 0,
        averageSearchTime: 0,
        topSearchTerms: [],
        searchesThisSession: 0,
        lastSearchTime: null,
    });

    useEffect(() => {
        const loadMetrics = () => {
            try {
                // Get search analytics
                const analytics = localStorage.getItem('bookbuddy-search-analytics');
                const searchData = analytics ? JSON.parse(analytics) : {};

                // Get performance data
                const performanceData = localStorage.getItem('bookbuddy-search-performance');
                const performance = performanceData ? JSON.parse(performanceData) : {
                    searchTimes: [],
                    sessionSearches: 0,
                    lastSearchTime: null,
                };

                // Calculate metrics
                const totalSearches = Object.values(searchData).reduce((sum: number, count) => sum + (count as number), 0);
                const averageSearchTime = performance.searchTimes.length > 0
                    ? performance.searchTimes.reduce((sum: number, time: number) => sum + time, 0) / performance.searchTimes.length
                    : 0;

                const topSearchTerms = Object.entries(searchData)
                    .map(([term, count]) => ({ term, count: count as number }))
                    .sort((a, b) => b.count - a.count)
                    .slice(0, 5);

                setMetrics({
                    totalSearches,
                    averageSearchTime,
                    topSearchTerms,
                    searchesThisSession: performance.sessionSearches,
                    lastSearchTime: performance.lastSearchTime,
                });
            } catch (error) {
                console.error('Error loading search metrics:', error);
            }
        };

        loadMetrics();

        // Listen for search events to update metrics
        const handleSearchPerformed = () => {
            setTimeout(loadMetrics, 100); // Small delay to ensure data is saved
        };

        window.addEventListener('searchPerformed', handleSearchPerformed);
        return () => window.removeEventListener('searchPerformed', handleSearchPerformed);
    }, []);

    const formatTime = (ms: number) => {
        if (ms < 1000) return `${Math.round(ms)}ms`;
        return `${(ms / 1000).toFixed(1)}s`;
    };

    const formatLastSearchTime = (timestamp: number | null) => {
        if (!timestamp) return 'Never';
        const now = Date.now();
        const diff = now - timestamp;

        if (diff < 60000) return 'Just now';
        if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
        return `${Math.floor(diff / 86400000)}d ago`;
    };

    return (
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Search Performance
            </h3>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                    <Search className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-900">{metrics.totalSearches}</div>
                    <div className="text-sm text-blue-600">Total Searches</div>
                </div>

                <div className="text-center p-4 bg-green-50 rounded-xl">
                    <Clock className="w-6 h-6 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-900">{formatTime(metrics.averageSearchTime)}</div>
                    <div className="text-sm text-green-600">Avg Search Time</div>
                </div>

                <div className="text-center p-4 bg-purple-50 rounded-xl">
                    <Users className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-purple-900">{metrics.searchesThisSession}</div>
                    <div className="text-sm text-purple-600">This Session</div>
                </div>

                <div className="text-center p-4 bg-orange-50 rounded-xl">
                    <Clock className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                    <div className="text-lg font-bold text-orange-900">{formatLastSearchTime(metrics.lastSearchTime)}</div>
                    <div className="text-sm text-orange-600">Last Search</div>
                </div>
            </div>

            {metrics.topSearchTerms.length > 0 && (
                <div>
                    <h4 className="font-medium text-gray-800 mb-3">Top Search Terms</h4>
                    <div className="space-y-2">
                        {metrics.topSearchTerms.map((item, index) => (
                            <div key={item.term} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <span className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium">
                                        {index + 1}
                                    </span>
                                    <span className="text-gray-700">{item.term}</span>
                                </div>
                                <span className="text-sm text-gray-500 bg-gray-200 px-2 py-1 rounded">
                                    {item.count}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchPerformanceMetrics;

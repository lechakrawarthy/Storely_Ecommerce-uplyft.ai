import React, { useState, useEffect } from 'react';
import { useSearch } from '../contexts/SearchContext';
import {
    basicSearchTests,
    performanceSearchTests,
    edgeCaseTests,
    runSearchTestSuite,
    generateTestReport,
    benchmarkSearch,
    type SearchTestSuite
} from '../utils/searchTestUtils';
import { searchProducts } from '../data/products';
import type { Product } from '../data/products';
import { Play, Download, CheckCircle, XCircle, Clock, Database } from 'lucide-react';

interface BenchmarkResults {
    averageTime: number;
    minTime: number;
    maxTime: number;
    totalTime: number;
    throughput: number;
}

const SearchTestPage: React.FC = () => {
    const { performSearch, searchResults, isSearching } = useSearch();
    const [testResults, setTestResults] = useState<SearchTestSuite[]>([]);
    const [isRunningTests, setIsRunningTests] = useState(false);
    const [testReport, setTestReport] = useState<string>('');
    const [benchmarkResults, setBenchmarkResults] = useState<BenchmarkResults | null>(null);
    const [selectedTestSuite, setSelectedTestSuite] = useState<string>('all');

    // Wrapper function to adapt performSearch for testing
    const testSearchFunction = async (query: string, filters = {}): Promise<Product[]> => {
        return new Promise((resolve) => {
            performSearch(query);
            // Wait for search to complete
            setTimeout(() => {
                resolve(searchResults);
            }, 500);
        });
    };

    const runAllTests = async () => {
        setIsRunningTests(true);
        setTestResults([]);

        try {
            const suites: SearchTestSuite[] = [];

            if (selectedTestSuite === 'all' || selectedTestSuite === 'basic') {
                const basicSuite = await runSearchTestSuite('Basic Search Tests', basicSearchTests, testSearchFunction);
                suites.push(basicSuite);
            }

            if (selectedTestSuite === 'all' || selectedTestSuite === 'performance') {
                const performanceSuite = await runSearchTestSuite('Performance Tests', performanceSearchTests, testSearchFunction);
                suites.push(performanceSuite);
            }

            if (selectedTestSuite === 'all' || selectedTestSuite === 'edge') {
                const edgeCaseSuite = await runSearchTestSuite('Edge Case Tests', edgeCaseTests, testSearchFunction);
                suites.push(edgeCaseSuite);
            }

            setTestResults(suites);

            // Generate test report
            const report = generateTestReport(suites);
            setTestReport(report);
        } catch (error) {
            console.error('Error running tests:', error);
        } finally {
            setIsRunningTests(false);
        }
    };

    const runBenchmark = async () => {
        setIsRunningTests(true);

        try {
            const testQueries = ['book', 'fiction', 'science', 'mystery', 'romance'];
            const benchmark = await benchmarkSearch(testQueries, 5, testSearchFunction);
            setBenchmarkResults(benchmark);
        } catch (error) {
            console.error('Error running benchmark:', error);
        } finally {
            setIsRunningTests(false);
        }
    };

    const downloadReport = () => {
        if (!testReport) return;

        const blob = new Blob([testReport], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `search-test-report-${new Date().toISOString().split('T')[0]}.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const clearCache = () => {
        localStorage.removeItem('bookbuddy-search-cache');
        localStorage.removeItem('bookbuddy-search-analytics');
        localStorage.removeItem('bookbuddy-search-performance');
        localStorage.removeItem('bookbuddy-search-history');
        alert('Search cache and data cleared successfully!');
    };

    const calculateSummaryStats = () => {
        const totalTests = testResults.reduce((sum, suite) => sum + suite.results.length, 0);
        const totalPassed = testResults.reduce((sum, suite) =>
            sum + suite.results.filter(r => r.success).length, 0
        );
        const totalTime = testResults.reduce((sum, suite) =>
            sum + suite.results.reduce((suiteSum, r) => suiteSum + r.executionTime, 0), 0
        );

        return {
            totalTests,
            totalPassed,
            totalFailed: totalTests - totalPassed,
            successRate: totalTests > 0 ? ((totalPassed / totalTests) * 100) : 0,
            averageTime: totalTests > 0 ? (totalTime / totalTests) : 0
        };
    };

    const stats = calculateSummaryStats();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-8">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Search Functionality Test Suite</h1>
                    <p className="text-gray-600">
                        Comprehensive testing for BookBuddy's enhanced search functionality including
                        debouncing, caching, filtering, and performance metrics.
                    </p>
                </div>

                {/* Test Controls */}
                <div className="glass-card rounded-2xl p-6 mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Test Controls</h2>

                    <div className="flex flex-wrap gap-4 mb-6">
                        <select
                            value={selectedTestSuite}
                            onChange={(e) => setSelectedTestSuite(e.target.value)}
                            className="px-4 py-2 border border-gray-200 rounded-lg"
                        >
                            <option value="all">All Test Suites</option>
                            <option value="basic">Basic Search Tests</option>
                            <option value="performance">Performance Tests</option>
                            <option value="edge">Edge Case Tests</option>
                        </select>

                        <button
                            onClick={runAllTests}
                            disabled={isRunningTests}
                            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-6 py-2 rounded-lg transition-colors"
                        >
                            <Play className="w-4 h-4" />
                            {isRunningTests ? 'Running Tests...' : 'Run Tests'}
                        </button>

                        <button
                            onClick={runBenchmark}
                            disabled={isRunningTests}
                            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white px-6 py-2 rounded-lg transition-colors"
                        >
                            <Clock className="w-4 h-4" />
                            Run Benchmark
                        </button>

                        <button
                            onClick={clearCache}
                            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors"
                        >
                            <Database className="w-4 h-4" />
                            Clear Cache
                        </button>

                        {testReport && (
                            <button
                                onClick={downloadReport}
                                className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
                            >
                                <Download className="w-4 h-4" />
                                Download Report
                            </button>
                        )}
                    </div>
                </div>

                {/* Summary Stats */}
                {testResults.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
                        <div className="glass-card rounded-xl p-4 text-center">
                            <div className="text-2xl font-bold text-gray-900">{stats.totalTests}</div>
                            <div className="text-sm text-gray-600">Total Tests</div>
                        </div>
                        <div className="glass-card rounded-xl p-4 text-center">
                            <div className="text-2xl font-bold text-green-600">{stats.totalPassed}</div>
                            <div className="text-sm text-gray-600">Passed</div>
                        </div>
                        <div className="glass-card rounded-xl p-4 text-center">
                            <div className="text-2xl font-bold text-red-600">{stats.totalFailed}</div>
                            <div className="text-sm text-gray-600">Failed</div>
                        </div>
                        <div className="glass-card rounded-xl p-4 text-center">
                            <div className="text-2xl font-bold text-blue-600">{stats.successRate.toFixed(1)}%</div>
                            <div className="text-sm text-gray-600">Success Rate</div>
                        </div>
                        <div className="glass-card rounded-xl p-4 text-center">
                            <div className="text-2xl font-bold text-purple-600">{stats.averageTime.toFixed(1)}ms</div>
                            <div className="text-sm text-gray-600">Avg Time</div>
                        </div>
                    </div>
                )}

                {/* Benchmark Results */}
                {benchmarkResults && (
                    <div className="glass-card rounded-2xl p-6 mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Performance Benchmark</h2>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="text-center">
                                <div className="text-lg font-bold text-gray-900">{benchmarkResults.averageTime.toFixed(2)}ms</div>
                                <div className="text-sm text-gray-600">Average Time</div>
                            </div>
                            <div className="text-center">
                                <div className="text-lg font-bold text-gray-900">{benchmarkResults.minTime.toFixed(2)}ms</div>
                                <div className="text-sm text-gray-600">Min Time</div>
                            </div>
                            <div className="text-center">
                                <div className="text-lg font-bold text-gray-900">{benchmarkResults.maxTime.toFixed(2)}ms</div>
                                <div className="text-sm text-gray-600">Max Time</div>
                            </div>
                            <div className="text-center">
                                <div className="text-lg font-bold text-gray-900">{benchmarkResults.throughput.toFixed(1)}</div>
                                <div className="text-sm text-gray-600">Searches/sec</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Test Results */}
                {testResults.map((suite, suiteIndex) => (
                    <div key={suiteIndex} className="glass-card rounded-2xl p-6 mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">{suite.testName}</h2>

                        <div className="mb-4">
                            <div className="text-sm text-gray-600">
                                {suite.results.filter(r => r.success).length}/{suite.results.length} tests passed
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-2">Test</th>
                                        <th className="text-left py-2">Query</th>
                                        <th className="text-center py-2">Results</th>
                                        <th className="text-center py-2">Time (ms)</th>
                                        <th className="text-center py-2">Cache</th>
                                        <th className="text-center py-2">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {suite.tests.map((test, testIndex) => {
                                        const result = suite.results[testIndex];
                                        return (
                                            <tr key={testIndex} className="border-b border-gray-100">
                                                <td className="py-2 font-medium">{test.name}</td>
                                                <td className="py-2 font-mono text-xs">
                                                    {result.query.length > 30
                                                        ? result.query.substring(0, 30) + '...'
                                                        : result.query || '(empty)'}
                                                </td>
                                                <td className="py-2 text-center">{result.resultCount}</td>
                                                <td className="py-2 text-center">{result.executionTime.toFixed(1)}</td>
                                                <td className="py-2 text-center">
                                                    {result.cacheHit ? '✅' : '❌'}
                                                </td>
                                                <td className="py-2 text-center">
                                                    {result.success ? (
                                                        <CheckCircle className="w-4 h-4 text-green-500 mx-auto" />
                                                    ) : (
                                                        <XCircle className="w-4 h-4 text-red-500 mx-auto" />
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Failed tests details */}
                        {suite.results.some(r => !r.success) && (
                            <div className="mt-4 p-4 bg-red-50 rounded-lg">
                                <h4 className="font-semibold text-red-800 mb-2">Failed Tests:</h4>
                                {suite.results.filter(r => !r.success).map((result, index) => (
                                    <div key={index} className="text-sm text-red-700 mb-1">
                                        <strong>Query:</strong> {result.query || '(empty)'} - {result.error}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}

                {/* Loading State */}
                {isRunningTests && (
                    <div className="glass-card rounded-2xl p-8 text-center">
                        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="text-gray-600">Running tests... This may take a few moments.</p>
                    </div>
                )}

                {/* Instructions */}
                <div className="glass-card rounded-2xl p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Test Instructions</h2>
                    <div className="space-y-2 text-sm text-gray-600">
                        <p><strong>Basic Tests:</strong> Test core search functionality including empty queries, single/multi-word searches, and basic filtering.</p>
                        <p><strong>Performance Tests:</strong> Test search performance with large queries, special characters, and mixed case inputs.</p>
                        <p><strong>Edge Cases:</strong> Test security (SQL injection, XSS), Unicode support, and very long queries.</p>
                        <p><strong>Benchmark:</strong> Measures search throughput and response times with common queries.</p>
                        <p><strong>Clear Cache:</strong> Removes all stored search data including cache, analytics, performance metrics, and history.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchTestPage;

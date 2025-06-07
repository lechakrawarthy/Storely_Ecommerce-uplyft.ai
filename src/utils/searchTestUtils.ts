// Search functionality testing utilities
import type { Product, SearchFilters } from '../data/products';

export interface SearchTestResult {
    query: string;
    filters: SearchFilters;
    resultCount: number;
    executionTime: number;
    cacheHit: boolean;
    success: boolean;
    error?: string;
}

export interface SearchTestSuite {
    testName: string;
    tests: SearchTest[];
    results: SearchTestResult[];
}

export interface SearchTest {
    name: string;
    query: string;
    filters: Partial<SearchFilters>;
    expectedMinResults: number;
    expectedMaxResults?: number;
}

// Pre-defined test suites for comprehensive search testing
export const basicSearchTests: SearchTest[] = [
    {
        name: "Empty query test",
        query: "",
        filters: {},
        expectedMinResults: 0,
        expectedMaxResults: 0
    },
    {
        name: "Single word search",
        query: "book",
        filters: {},
        expectedMinResults: 1
    },
    {
        name: "Multi-word search",
        query: "science fiction",
        filters: {},
        expectedMinResults: 0
    },
    {
        name: "Category filter test",
        query: "",
        filters: { category: "Fiction" },
        expectedMinResults: 1
    },
    {
        name: "Price range filter test",
        query: "",
        filters: { priceRange: [0, 1000] as [number, number] },
        expectedMinResults: 1
    },
    {
        name: "Rating filter test",
        query: "",
        filters: { rating: 4 },
        expectedMinResults: 1
    },
    {
        name: "In stock filter test",
        query: "",
        filters: { inStock: true },
        expectedMinResults: 1
    },
    {
        name: "Combined filters test",
        query: "book",
        filters: {
            category: "Fiction",
            priceRange: [0, 2000] as [number, number],
            rating: 3,
            inStock: true
        },
        expectedMinResults: 0
    }
];

export const performanceSearchTests: SearchTest[] = [
    {
        name: "Large query performance test",
        query: "a".repeat(100),
        filters: {},
        expectedMinResults: 0
    },
    {
        name: "Special characters test",
        query: "book!@#$%^&*()",
        filters: {},
        expectedMinResults: 0
    },
    {
        name: "Number search test",
        query: "123",
        filters: {},
        expectedMinResults: 0
    },
    {
        name: "Mixed case search test",
        query: "BOOK book Book",
        filters: {},
        expectedMinResults: 0
    }
];

export const edgeCaseTests: SearchTest[] = [
    {
        name: "SQL injection attempt",
        query: "'; DROP TABLE products; --",
        filters: {},
        expectedMinResults: 0
    },
    {
        name: "XSS attempt",
        query: "<script>alert('xss')</script>",
        filters: {},
        expectedMinResults: 0
    },
    {
        name: "Unicode characters",
        query: "书籍 📚 книга",
        filters: {},
        expectedMinResults: 0
    },
    {
        name: "Very long query",
        query: "book ".repeat(50),
        filters: {},
        expectedMinResults: 0
    }
];

// Test execution functions
export const runSearchTest = async (
    test: SearchTest,
    searchFunction: (query: string, filters?: Partial<SearchFilters>) => Promise<Product[]>
): Promise<SearchTestResult> => {
    const startTime = performance.now();

    try {
        const results = await searchFunction(test.query, test.filters);
        const endTime = performance.now();
        const executionTime = endTime - startTime;

        const success = results.length >= test.expectedMinResults &&
            (test.expectedMaxResults === undefined || results.length <= test.expectedMaxResults);

        return {
            query: test.query,
            filters: test.filters as SearchFilters,
            resultCount: results.length,
            executionTime,
            cacheHit: executionTime < 5, // Assume cache hit if very fast
            success,
            error: success ? undefined : `Expected ${test.expectedMinResults}-${test.expectedMaxResults || '∞'} results, got ${results.length}`
        };
    } catch (error) {
        const endTime = performance.now();
        return {
            query: test.query,
            filters: test.filters as SearchFilters,
            resultCount: 0,
            executionTime: endTime - startTime,
            cacheHit: false,
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
};

export const runSearchTestSuite = async (
    suiteName: string,
    tests: SearchTest[],
    searchFunction: (query: string, filters?: Partial<SearchFilters>) => Promise<Product[]>
): Promise<SearchTestSuite> => {
    const results: SearchTestResult[] = [];

    for (const test of tests) {
        const result = await runSearchTest(test, searchFunction);
        results.push(result);

        // Add small delay to prevent overwhelming the system
        await new Promise(resolve => setTimeout(resolve, 50));
    }

    return {
        testName: suiteName,
        tests,
        results
    };
};

// Test report generation
export const generateTestReport = (testSuites: SearchTestSuite[]): string => {
    let report = "# Search Functionality Test Report\n\n";
    report += `Generated: ${new Date().toISOString()}\n\n`;

    let totalTests = 0;
    let totalPassed = 0;
    let totalExecutionTime = 0;

    for (const suite of testSuites) {
        report += `## ${suite.testName}\n\n`;

        const passed = suite.results.filter(r => r.success).length;
        const total = suite.results.length;
        const suiteTime = suite.results.reduce((sum, r) => sum + r.executionTime, 0);

        report += `**Results:** ${passed}/${total} tests passed\n`;
        report += `**Total Execution Time:** ${suiteTime.toFixed(2)}ms\n`;
        report += `**Average Execution Time:** ${(suiteTime / total).toFixed(2)}ms\n\n`;

        // Individual test results
        report += "| Test | Query | Results | Time (ms) | Status |\n";
        report += "|------|-------|---------|-----------|--------|\n";

        for (let i = 0; i < suite.tests.length; i++) {
            const test = suite.tests[i];
            const result = suite.results[i];
            const status = result.success ? "✅ PASS" : "❌ FAIL";
            const query = result.query.length > 20 ? result.query.substring(0, 20) + "..." : result.query;

            report += `| ${test.name} | \`${query}\` | ${result.resultCount} | ${result.executionTime.toFixed(2)} | ${status} |\n`;
        }

        report += "\n";

        // Failed tests details
        const failedTests = suite.results.filter(r => !r.success);
        if (failedTests.length > 0) {
            report += "### Failed Tests Details\n\n";
            for (const failed of failedTests) {
                report += `- **Query:** \`${failed.query}\`\n`;
                report += `  **Error:** ${failed.error}\n\n`;
            }
        }

        totalTests += total;
        totalPassed += passed;
        totalExecutionTime += suiteTime;
    }

    // Summary
    report += "## Summary\n\n";
    report += `**Total Tests:** ${totalTests}\n`;
    report += `**Total Passed:** ${totalPassed}\n`;
    report += `**Total Failed:** ${totalTests - totalPassed}\n`;
    report += `**Success Rate:** ${((totalPassed / totalTests) * 100).toFixed(1)}%\n`;
    report += `**Total Execution Time:** ${totalExecutionTime.toFixed(2)}ms\n`;
    report += `**Average Test Time:** ${(totalExecutionTime / totalTests).toFixed(2)}ms\n`;

    return report;
};

// Performance benchmarking
export const benchmarkSearch = async (
    queries: string[],
    iterations: number,
    searchFunction: (query: string) => Promise<Product[]>
): Promise<{
    averageTime: number;
    minTime: number;
    maxTime: number;
    totalTime: number;
    throughput: number;
}> => {
    const times: number[] = [];

    for (let i = 0; i < iterations; i++) {
        for (const query of queries) {
            const startTime = performance.now();
            await searchFunction(query);
            const endTime = performance.now();
            times.push(endTime - startTime);
        }
    }

    const totalTime = times.reduce((sum, time) => sum + time, 0);
    const averageTime = totalTime / times.length;
    const minTime = Math.min(...times);
    const maxTime = Math.max(...times);
    const throughput = (times.length / totalTime) * 1000; // searches per second

    return {
        averageTime,
        minTime,
        maxTime,
        totalTime,
        throughput
    };
};

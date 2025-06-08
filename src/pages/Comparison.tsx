import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import MobileProductComparison from "../components/MobileProductComparison";
import { useComparison } from "../hooks/use-comparison";

const Comparison = () => {
    const { compareList } = useComparison();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            {/* Header */}
            <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
                <div className="flex items-center justify-between p-4">
                    <Link
                        to="/"
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" />
                        <span>Back</span>
                    </Link>
                    <h1 className="font-semibold text-lg">
                        Compare Products ({compareList.length})
                    </h1>
                    <div className="w-16" /> {/* Spacer for centering */}
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                {compareList.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-gray-500 mb-4">
                            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No products to compare</h3>
                            <p className="text-gray-500 mb-6">
                                Add products to your comparison list to see them here
                            </p>
                            <Link
                                to="/"
                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Browse Products
                            </Link>
                        </div>
                    </div>
                ) : (
                    <MobileProductComparison isOpen={true} onClose={() => { }} />
                )}
            </div>
        </div>
    );
};

export default Comparison;

import React, { useState } from 'react';
import { X, ChevronDown, ChevronUp, Sliders, Check } from '../utils/icons';

interface FilterOption {
    id: string;
    label: string;
    count?: number;
}

interface FilterSection {
    id: string;
    title: string;
    type: 'checkbox' | 'range' | 'radio';
    options?: FilterOption[];
    min?: number;
    max?: number;
    value?: any;
}

interface MobileFiltersSheetProps {
    isOpen: boolean;
    onClose: () => void;
    filters: FilterSection[];
    onFiltersChange: (filters: any) => void;
    onClearAll: () => void;
    activeFiltersCount: number;
}

const MobileFiltersSheet: React.FC<MobileFiltersSheetProps> = ({
    isOpen,
    onClose,
    filters,
    onFiltersChange,
    onClearAll,
    activeFiltersCount
}) => {
    const [expandedSections, setExpandedSections] = useState<string[]>(['category', 'price']);
    const [localFilters, setLocalFilters] = useState<any>({});

    const toggleSection = (sectionId: string) => {
        setExpandedSections(prev =>
            prev.includes(sectionId)
                ? prev.filter(id => id !== sectionId)
                : [...prev, sectionId]
        );
    };

    const handleFilterChange = (sectionId: string, value: any) => {
        setLocalFilters(prev => ({
            ...prev,
            [sectionId]: value
        }));
    };

    const applyFilters = () => {
        onFiltersChange(localFilters);
        onClose();
    };

    const clearAllFilters = () => {
        setLocalFilters({});
        onClearAll();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] lg:hidden">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Sheet */}
            <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl transform transition-transform duration-300 ease-out max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <Sliders className="w-6 h-6 text-gray-700" />
                        <h2 className="text-xl font-semibold text-gray-900">Filters</h2>
                        {activeFiltersCount > 0 && (
                            <span className="bg-pastel-500 text-white text-sm font-medium px-2 py-1 rounded-full">
                                {activeFiltersCount}
                            </span>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-6 h-6 text-gray-600" />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto">
                    <div className="p-6 space-y-6">
                        {filters.map((section) => (
                            <div key={section.id} className="border border-gray-200 rounded-2xl overflow-hidden">
                                {/* Section Header */}
                                <button
                                    onClick={() => toggleSection(section.id)}
                                    className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                                >
                                    <span className="font-medium text-gray-900">{section.title}</span>
                                    {expandedSections.includes(section.id) ? (
                                        <ChevronUp className="w-5 h-5 text-gray-600" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5 text-gray-600" />
                                    )}
                                </button>

                                {/* Section Content */}
                                {expandedSections.includes(section.id) && (
                                    <div className="p-4 bg-white">
                                        {section.type === 'checkbox' && section.options && (
                                            <div className="space-y-3">
                                                {section.options.map((option) => (
                                                    <label
                                                        key={option.id}
                                                        className="flex items-center justify-between cursor-pointer group"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className="relative">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={localFilters[section.id]?.includes(option.id) || false}
                                                                    onChange={(e) => {
                                                                        const currentValues = localFilters[section.id] || [];
                                                                        const newValues = e.target.checked
                                                                            ? [...currentValues, option.id]
                                                                            : currentValues.filter((v: string) => v !== option.id);
                                                                        handleFilterChange(section.id, newValues);
                                                                    }}
                                                                    className="sr-only"
                                                                />
                                                                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${localFilters[section.id]?.includes(option.id)
                                                                    ? 'bg-pastel-500 border-pastel-500'
                                                                    : 'border-gray-300 group-hover:border-pastel-300'
                                                                    }`}>
                                                                    {localFilters[section.id]?.includes(option.id) && (
                                                                        <Check className="w-3 h-3 text-white" />
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <span className="text-gray-800">{option.label}</span>
                                                        </div>
                                                        {option.count && (
                                                            <span className="text-sm text-gray-500">({option.count})</span>
                                                        )}
                                                    </label>
                                                ))}
                                            </div>
                                        )}

                                        {section.type === 'range' && section.min !== undefined && section.max !== undefined && (
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between text-sm text-gray-600">
                                                    <span>₹{section.min}</span>
                                                    <span>₹{section.max}</span>
                                                </div>
                                                <div className="relative">
                                                    <input
                                                        type="range"
                                                        min={section.min}
                                                        max={section.max}
                                                        value={localFilters[section.id] || section.max}
                                                        onChange={(e) => handleFilterChange(section.id, parseInt(e.target.value))}
                                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                                                        style={{
                                                            background: `linear-gradient(to right, #94a3b8 0%, #94a3b8 ${((localFilters[section.id] || section.max) - section.min) / (section.max - section.min) * 100
                                                                }%, #e2e8f0 ${((localFilters[section.id] || section.max) - section.min) / (section.max - section.min) * 100
                                                                }%, #e2e8f0 100%)`
                                                        }}
                                                    />
                                                </div>
                                                <div className="text-center">
                                                    <span className="inline-block bg-pastel-100 text-pastel-800 px-3 py-1 rounded-full text-sm font-medium">
                                                        Up to ₹{localFilters[section.id] || section.max}
                                                    </span>
                                                </div>
                                            </div>
                                        )}

                                        {section.type === 'radio' && section.options && (
                                            <div className="space-y-3">
                                                {section.options.map((option) => (
                                                    <label
                                                        key={option.id}
                                                        className="flex items-center justify-between cursor-pointer group"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className="relative">
                                                                <input
                                                                    type="radio"
                                                                    name={section.id}
                                                                    checked={localFilters[section.id] === option.id}
                                                                    onChange={() => handleFilterChange(section.id, option.id)}
                                                                    className="sr-only"
                                                                />
                                                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${localFilters[section.id] === option.id
                                                                    ? 'bg-pastel-500 border-pastel-500'
                                                                    : 'border-gray-300 group-hover:border-pastel-300'
                                                                    }`}>
                                                                    {localFilters[section.id] === option.id && (
                                                                        <div className="w-2 h-2 bg-white rounded-full" />
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <span className="text-gray-800">{option.label}</span>
                                                        </div>
                                                        {option.count && (
                                                            <span className="text-sm text-gray-500">({option.count})</span>
                                                        )}
                                                    </label>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-200 bg-white">
                    <div className="flex gap-3">
                        <button
                            onClick={clearAllFilters}
                            className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                        >
                            Clear All
                        </button>
                        <button
                            onClick={applyFilters}
                            className="flex-1 py-3 px-4 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-colors"
                        >
                            Apply Filters
                        </button>
                    </div>
                </div>
            </div>

            <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #94a3b8;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        }

        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #94a3b8;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        }
      `}</style>
        </div>
    );
};

export default MobileFiltersSheet;

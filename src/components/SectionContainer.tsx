import React, { ReactNode } from 'react';

interface SectionContainerProps {
    title?: string;
    children: ReactNode;
}

const SectionContainer = ({ title, children }: SectionContainerProps) => (
    <div className="bg-white rounded-3xl shadow-xl p-8 my-6 relative">
        {title && <h2 className="text-3xl font-bold mb-4 text-gray-800">{title}</h2>}
        {children}
    </div>
);

export default SectionContainer;

import React from 'react';

interface AIAttributionBadgeProps {
    /** Optional field name for specific ARIA labeling */
    field?: string;
    /** Additional CSS classes */
    className?: string;
}

/**
 * AIAttributionBadge
 * 
 * Granular disclosure component to be placed next to AI-extracted fields.
 * Follows industry best practices for progressive transparency.
 */
export const AIAttributionBadge: React.FC<AIAttributionBadgeProps> = ({ field, className = "" }) => {
    return (
        <span
            className={`inline-flex items-center gap-1 px-1.5 py-0.5 ml-2 text-[10px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 rounded opacity-80 ${className}`}
            title={field ? `Value for ${field} was extracted by AI` : "Field extracted by AI"}
            role="note"
            aria-label={field ? `AI-extracted ${field}` : "AI-extracted field"}
        >
            <svg
                className="w-3 h-3"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
            >
                <path d="M12 2L14.3 9.7L22 12L14.3 14.3L12 22L9.7 14.3L2 12L9.7 9.7L12 2Z" fill="currentColor" />
            </svg>
            AI
        </span>
    );
};

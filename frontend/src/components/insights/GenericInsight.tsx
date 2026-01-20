/**
 * GenericInsight - Fallback display for anomaly, hotspot, and trend insights.
 * Renders known metadata fields dynamically.
 */
import type { SpatialInsightType } from '../../types/spatial';

export interface GenericInsightProps {
    type: SpatialInsightType;
    metadata?: Record<string, unknown>;
}

interface MetadataField {
    key: string;
    label: string;
    format?: (value: unknown) => string;
}

const knownFields: MetadataField[] = [
    { key: 'alert_type', label: 'Alert Type' },
    {
        key: 'response_time_target_hours',
        label: 'Response Target',
        format: (v) => `${v} hours`,
    },
    {
        key: 'recurrence_years',
        label: 'Recurrence',
        format: (v) => `${v} year${Number(v) !== 1 ? 's' : ''}`,
    },
    { key: 'recommended_solution', label: 'Recommendation' },
    { key: 'trend_direction', label: 'Direction' },
    {
        key: 'confidence_score',
        label: 'Confidence',
        format: (v) => `${Math.round(Number(v) * 100)}%`,
    },
    { key: 'affected_area_sq_miles', label: 'Area', format: (v) => `${v} sq mi` },
];

export function GenericInsight({ type, metadata }: GenericInsightProps) {
    if (!metadata || Object.keys(metadata).length === 0) {
        return null;
    }

    // Filter to only known fields that exist in metadata
    const displayFields = knownFields.filter(
        (field) => metadata[field.key] !== undefined && metadata[field.key] !== null
    );

    if (displayFields.length === 0) {
        return null;
    }

    return (
        <div
            className="space-y-1.5 text-xs"
            data-testid={`generic-insight-metadata-${type}`}
        >
            {displayFields.map((field) => {
                const value = metadata[field.key];
                const displayValue = field.format
                    ? field.format(value)
                    : String(value);

                return (
                    <div key={field.key} className="flex items-start gap-2 text-gray-300">
                        <span className="text-gray-500 shrink-0">{field.label}:</span>
                        <span className="break-words">{displayValue}</span>
                    </div>
                );
            })}
        </div>
    );
}

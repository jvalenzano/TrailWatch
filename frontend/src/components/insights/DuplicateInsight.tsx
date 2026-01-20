/**
 * DuplicateInsight - Displays duplicate detection metadata.
 * Shows: similarity score, distance, shared features.
 */
import type { DuplicateMetadata } from '../../types/spatial';

export interface DuplicateInsightProps {
    metadata: DuplicateMetadata;
}

const featureLabels: Record<string, string> = {
    photo: 'Photo',
    hazard_type: 'Hazard Type',
    location: 'Location',
    description: 'Description',
    trail_name: 'Trail Name',
    timestamp: 'Timestamp',
};

export function DuplicateInsight({ metadata }: DuplicateInsightProps) {
    const similarityPercent = Math.round(metadata.similarity_score * 100);
    const distanceDisplay =
        metadata.distance_meters < 1000
            ? `${Math.round(metadata.distance_meters)}m`
            : `${(metadata.distance_meters / 1000).toFixed(1)}km`;

    return (
        <div className="space-y-1.5 text-xs" data-testid="duplicate-insight-metadata">
            {/* Similarity and distance */}
            <div className="flex items-center gap-2 text-gray-300">
                <span className="font-semibold text-amber-400">
                    {similarityPercent}% similar
                </span>
                <span className="text-gray-500">&bull;</span>
                <span>{distanceDisplay} apart</span>
            </div>

            {/* Shared features */}
            {metadata.shared_features.length > 0 && (
                <div className="flex items-center gap-2 text-gray-300">
                    <span className="text-gray-500">Shared:</span>
                    <div className="flex flex-wrap gap-1">
                        {metadata.shared_features.map((feature) => (
                            <span
                                key={feature}
                                className="px-1.5 py-0.5 bg-gray-700/50 rounded text-gray-300"
                            >
                                {featureLabels[feature] || feature}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

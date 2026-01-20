/**
 * BiasInsight - Displays consistency check / bias detection metadata.
 * Shows: deviation percentage, affected districts, check type.
 */
import type { ConsistencyCheckMetadata } from '../../types/spatial';

export interface BiasInsightProps {
    metadata: ConsistencyCheckMetadata;
}

const checkTypeLabels: Record<ConsistencyCheckMetadata['check_type'], string> = {
    district_bias: 'District Bias',
    temporal_anomaly: 'Temporal Anomaly',
    geographic_gap: 'Geographic Gap',
};

export function BiasInsight({ metadata }: BiasInsightProps) {
    return (
        <div className="space-y-1.5 text-xs" data-testid="bias-insight-metadata">
            {/* Check type */}
            <div className="flex items-center gap-2 text-gray-300">
                <span className="text-gray-500">Type:</span>
                <span>{checkTypeLabels[metadata.check_type]}</span>
            </div>

            {/* Deviation percentage (if present) */}
            {metadata.deviation_percentage !== undefined && (
                <div className="flex items-center gap-2 text-gray-300">
                    <span
                        className={`font-semibold ${
                            metadata.deviation_percentage > 30
                                ? 'text-red-400'
                                : metadata.deviation_percentage > 15
                                ? 'text-yellow-400'
                                : 'text-green-400'
                        }`}
                    >
                        {Math.round(metadata.deviation_percentage)}% deviation
                    </span>
                    <span className="text-gray-500">from expected</span>
                </div>
            )}

            {/* Affected districts (if present) */}
            {metadata.affected_districts && metadata.affected_districts.length > 0 && (
                <div className="flex items-start gap-2 text-gray-300">
                    <span className="text-gray-500 shrink-0">Affected:</span>
                    <div className="flex flex-wrap gap-1">
                        {metadata.affected_districts.map((district) => (
                            <span
                                key={district}
                                className="px-1.5 py-0.5 bg-gray-700/50 rounded text-gray-300"
                            >
                                {district}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

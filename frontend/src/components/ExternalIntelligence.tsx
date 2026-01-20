import type { ExternalIntelligence as ExternalIntelligenceType } from '../types/report';

interface ExternalIntelligenceProps {
    sources: ExternalIntelligenceType[];
}

/**
 * Component to display external intelligence sources (social media, blogs, etc.)
 * that corroborate or provide context for a hazard report.
 */
export function ExternalIntelligence({ sources }: ExternalIntelligenceProps) {
    if (!sources || sources.length === 0) {
        return null;
    }

    const getSourceIcon = (sourceType: string) => {
        switch (sourceType) {
            case 'social_media':
                return '🐦';
            case 'blog':
                return '📝';
            case 'forum':
                return '💬';
            default:
                return '🔗';
        }
    };

    const getSourceColor = (sourceType: string) => {
        switch (sourceType) {
            case 'social_media':
                return 'border-blue-500/30 bg-blue-500/10';
            case 'blog':
                return 'border-purple-500/30 bg-purple-500/10';
            case 'forum':
                return 'border-orange-500/30 bg-orange-500/10';
            default:
                return 'border-gray-500/30 bg-gray-500/10';
        }
    };

    return (
        <div className="mt-4">
            <div className="flex items-center gap-2 mb-3">
                <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                    External Intelligence
                </h4>
                <span className="text-xs text-gray-500">({sources.length} source{sources.length !== 1 ? 's' : ''})</span>
            </div>
            <div className="space-y-3">
                {sources.map((source, idx) => (
                    <div
                        key={idx}
                        className={`p-3 rounded-lg border ${getSourceColor(source.source_type)}`}
                    >
                        <div className="flex items-start gap-3">
                            <span className="text-xl">{getSourceIcon(source.source_type)}</span>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm font-medium text-gray-300">
                                        {source.label}
                                    </span>
                                    {source.posted_at && (
                                        <span className="text-xs text-gray-500">
                                            {new Date(source.posted_at).toLocaleString()}
                                        </span>
                                    )}
                                </div>
                                {source.excerpt && (
                                    <p className="text-xs text-gray-400 italic mb-2">
                                        "{source.excerpt}"
                                    </p>
                                )}
                                <div className="mt-2">
                                    <img
                                        src={source.asset_url}
                                        alt={source.label}
                                        className="max-w-full h-auto rounded border border-gray-600/50"
                                        style={{ maxHeight: '200px' }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

/**
 * Analytics Utility
 * 
 * Centralized schema for tracking AI transparency events and user engagement.
 */

export const ANALYTICS_EVENTS = {
    REASONING_PANEL_EXPANDED: 'reasoning_panel_expanded',
    REASONING_PANEL_DISMISSED: 'reasoning_panel_dismissed',
    CONFIDENCE_INDICATOR_CLICKED: 'confidence_indicator_clicked',
    AI_ATTRIBUTION_BADGE_HOVERED: 'ai_attribution_badge_hovered',
} as const;

export type AnalyticsEvent = typeof ANALYTICS_EVENTS[keyof typeof ANALYTICS_EVENTS];

/**
 * Tracks a custom event with properties.
 * 
 * Implementation note: Currently logs to console in development.
 * Future integration point for full analytics providers.
 */
export const trackEvent = (
    event: AnalyticsEvent,
    properties: Record<string, any> = {}
) => {
    const payload = {
        event,
        properties: {
            ...properties,
            timestamp: new Date().toISOString(),
            environment: import.meta.env.MODE,
        },
    };

    if (import.meta.env.DEV) {
        console.log(`[Analytics] ${event}`, payload.properties);
    }

    // Future: analytics provider integration (e.g., Mixpanel, Segment)
    // window.analytics?.track(event, payload.properties);
};

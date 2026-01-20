/**
 * HazardMarkerIcon - SVG icons for different hazard types.
 * Used for map markers and UI elements to indicate hazard category.
 * Follows WF7 wireframe specifications.
 */

export interface HazardMarkerIconProps {
    /** Type of hazard to show icon for */
    hazardType: string;
    /** Size in pixels (default: 24) */
    size?: number;
    /** Tailwind color class (default: 'text-red-500') */
    colorClass?: string;
    /** Additional CSS classes */
    className?: string;
}

/**
 * Bridge icon for structures hazard type
 */
function BridgeIcon({ size, className }: { size: number; className: string }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            {/* Bridge deck */}
            <path d="M3 10h18" />
            {/* Bridge arches */}
            <path d="M5 10c0-3.5 3-6 7-6s7 2.5 7 6" />
            {/* Pillars */}
            <path d="M5 10v8" />
            <path d="M19 10v8" />
            <path d="M12 10v8" />
            {/* Ground */}
            <path d="M3 18h18" />
        </svg>
    );
}

/**
 * Tree icon for obstruction hazard type
 */
function TreeIcon({ size, className }: { size: number; className: string }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            {/* Tree trunk */}
            <path d="M12 22v-7" />
            {/* Tree crown layers */}
            <path d="M12 3l-7 9h4l-3 5h12l-3-5h4l-7-9z" />
        </svg>
    );
}

/**
 * Water/flood icon for flooding hazard type
 */
function WaterIcon({ size, className }: { size: number; className: string }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            {/* Water waves */}
            <path d="M3 10c2-1 4-1 6 0s4 1 6 0 4-1 6 0" />
            <path d="M3 14c2-1 4-1 6 0s4 1 6 0 4-1 6 0" />
            <path d="M3 18c2-1 4-1 6 0s4 1 6 0 4-1 6 0" />
            {/* Rain drops */}
            <path d="M8 6l-2 4" />
            <path d="M12 4l-2 4" />
            <path d="M16 6l-2 4" />
        </svg>
    );
}

/**
 * Wildlife/animal icon for wildlife hazard type
 */
function WildlifeIcon({ size, className }: { size: number; className: string }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            {/* Bear-like shape */}
            <circle cx="12" cy="8" r="4" />
            {/* Ears */}
            <circle cx="8" cy="5" r="1.5" />
            <circle cx="16" cy="5" r="1.5" />
            {/* Body */}
            <ellipse cx="12" cy="16" rx="6" ry="5" />
            {/* Legs */}
            <path d="M7 20v2" />
            <path d="M17 20v2" />
        </svg>
    );
}

/**
 * Erosion/landslide icon for erosion hazard type
 */
function ErosionIcon({ size, className }: { size: number; className: string }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            {/* Mountain/cliff */}
            <path d="M4 20l6-12 4 6 6-10v16H4z" />
            {/* Falling rocks */}
            <circle cx="10" cy="14" r="1" />
            <circle cx="14" cy="16" r="1.5" />
            <circle cx="8" cy="18" r="0.5" />
        </svg>
    );
}

/**
 * Danger/warning icon for dangerous or unknown hazard types
 */
function DangerIcon({ size, className }: { size: number; className: string }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            {/* Warning triangle */}
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            {/* Exclamation mark */}
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
    );
}

/**
 * Get the appropriate icon component for a hazard type
 */
function getIconComponent(hazardType: string) {
    switch (hazardType.toLowerCase()) {
        case 'structures':
        case 'bridge':
            return BridgeIcon;
        case 'obstruction':
        case 'debris':
        case 'fallen tree':
            return TreeIcon;
        case 'flooding':
        case 'water':
        case 'washout':
            return WaterIcon;
        case 'wildlife':
        case 'animal':
        case 'bear':
            return WildlifeIcon;
        case 'erosion':
        case 'landslide':
        case 'trail damage':
            return ErosionIcon;
        case 'dangerous':
        case 'unknown':
        default:
            return DangerIcon;
    }
}

export function HazardMarkerIcon({
    hazardType,
    size = 24,
    colorClass = 'text-red-500',
    className = '',
}: HazardMarkerIconProps) {
    const IconComponent = getIconComponent(hazardType);
    const combinedClassName = `${colorClass} ${className}`.trim();

    return (
        <span
            data-testid="hazard-marker-icon"
            data-hazard-type={hazardType}
            role="img"
            aria-label={`${hazardType} hazard`}
        >
            <IconComponent size={size} className={combinedClassName} />
        </span>
    );
}

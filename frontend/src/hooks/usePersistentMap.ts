/**
 * Hook for accessing the persistent map context in AgenticLayout.
 * Re-exported from AgenticLayout.tsx for convenience.
 */
import { createContext, useContext } from 'react';
import type maplibregl from 'maplibre-gl';

export interface PersistentMapContextValue {
    map: maplibregl.Map | null;
    mapContainer: React.RefObject<HTMLDivElement | null>;
    isMapReady: boolean;
}

export const PersistentMapContext = createContext<PersistentMapContextValue>({
    map: null,
    mapContainer: { current: null },
    isMapReady: false,
});

export function usePersistentMap(): PersistentMapContextValue {
    return useContext(PersistentMapContext);
}

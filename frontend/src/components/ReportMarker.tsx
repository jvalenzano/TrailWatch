
import React, { useContext, useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import { MapContext } from './MapView';
import { HazardReport } from '../types/report';

interface ReportMarkerProps {
    report: HazardReport;
    onClick?: (report: HazardReport) => void;
}

const getSeverityColor = (report: HazardReport): string => {
    const sev = report.triage_result?.severity;
    const est = report.severity_estimate;

    if (sev === 'SEV3' || est === 'dangerous') return '#ef4444'; // red-500
    if (sev === 'SEV2' || est === 'impassable') return '#f97316'; // orange-500
    if (sev === 'SEV1' || est === 'difficult') return '#eab308'; // yellow-500
    return '#22c55e'; // green-500 (passable)
};

export function ReportMarker({ report, onClick }: ReportMarkerProps) {
    const { map } = useContext(MapContext);
    const markerRef = useRef<maplibregl.Marker | null>(null);

    useEffect(() => {
        if (!map) return;

        // Create DOM element for marker
        const el = document.createElement('div');
        const color = getSeverityColor(report);
        el.className = 'w-6 h-6 rounded-full border-2 border-white shadow-md cursor-pointer transform hover:scale-110 transition-transform';
        el.style.backgroundColor = color;

        // Add click listener
        el.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent map click
            if (onClick) onClick(report);
        });

        // Create marker
        const marker = new maplibregl.Marker({ element: el })
            .setLngLat([report.location.longitude, report.location.latitude])
            .addTo(map);

        markerRef.current = marker;

        return () => {
            marker.remove();
        };
    }, [map, report, onClick]); // Re-create if report changes (unlikely for id but possible for status)

    return null; // Markers render into the map container, not the React tree
}

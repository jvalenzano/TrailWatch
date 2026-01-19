import { useState, useEffect, useCallback } from 'react';

export type Breakpoint = 'mobile' | 'tablet' | 'desktop' | 'wide';

const BREAKPOINTS: Record<Breakpoint, number> = {
    mobile: 0,
    tablet: 640,
    desktop: 1024,
    wide: 1280,
};

const BREAKPOINT_ORDER: Breakpoint[] = ['mobile', 'tablet', 'desktop', 'wide'];

function getBreakpoint(width: number): Breakpoint {
    if (width >= BREAKPOINTS.wide) return 'wide';
    if (width >= BREAKPOINTS.desktop) return 'desktop';
    if (width >= BREAKPOINTS.tablet) return 'tablet';
    return 'mobile';
}

interface UseBreakpointResult {
    /** Current breakpoint name */
    breakpoint: Breakpoint;
    /** True if width >= 1280px */
    isWide: boolean;
    /** True if width >= 1024px and < 1280px */
    isDesktop: boolean;
    /** True if width >= 640px and < 1024px */
    isTablet: boolean;
    /** True if width < 640px */
    isMobile: boolean;
    /** Check if current breakpoint is at least the given breakpoint */
    isAtLeast: (bp: Breakpoint) => boolean;
    /** Current window width in pixels */
    width: number;
}

/**
 * Hook to detect and respond to viewport breakpoints.
 *
 * Breakpoints:
 * - wide: >= 1280px (Full layout)
 * - desktop: >= 1024px (Collapsible sidebar)
 * - tablet: >= 640px (Stack vertical)
 * - mobile: < 640px (Hamburger menu)
 *
 * @example
 * const { breakpoint, isMobile, isAtLeast } = useBreakpoint();
 *
 * if (isMobile) return <MobileLayout />;
 * if (isAtLeast('desktop')) return <DesktopLayout />;
 */
export function useBreakpoint(): UseBreakpointResult {
    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => {
            setWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const breakpoint = getBreakpoint(width);

    const isAtLeast = useCallback(
        (bp: Breakpoint): boolean => {
            const currentIndex = BREAKPOINT_ORDER.indexOf(breakpoint);
            const targetIndex = BREAKPOINT_ORDER.indexOf(bp);
            return currentIndex >= targetIndex;
        },
        [breakpoint]
    );

    return {
        breakpoint,
        isWide: breakpoint === 'wide',
        isDesktop: breakpoint === 'desktop',
        isTablet: breakpoint === 'tablet',
        isMobile: breakpoint === 'mobile',
        isAtLeast,
        width,
    };
}

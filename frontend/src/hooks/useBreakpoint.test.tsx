import { describe, it, expect, vi, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useBreakpoint } from './useBreakpoint';

// Store original window.innerWidth
const originalInnerWidth = window.innerWidth;

function setWindowWidth(width: number) {
    Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: width,
    });
    window.dispatchEvent(new Event('resize'));
}

describe('useBreakpoint', () => {
    afterEach(() => {
        // Restore original window width
        Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: originalInnerWidth,
        });
    });

    describe('breakpoint detection', () => {
        it('returns "wide" for widths >= 1280px', () => {
            setWindowWidth(1280);

            const { result } = renderHook(() => useBreakpoint());

            expect(result.current.breakpoint).toBe('wide');
            expect(result.current.isWide).toBe(true);
        });

        it('returns "desktop" for widths >= 1024px and < 1280px', () => {
            setWindowWidth(1024);

            const { result } = renderHook(() => useBreakpoint());

            expect(result.current.breakpoint).toBe('desktop');
            expect(result.current.isDesktop).toBe(true);
        });

        it('returns "tablet" for widths >= 640px and < 1024px', () => {
            setWindowWidth(768);

            const { result } = renderHook(() => useBreakpoint());

            expect(result.current.breakpoint).toBe('tablet');
            expect(result.current.isTablet).toBe(true);
        });

        it('returns "mobile" for widths < 640px', () => {
            setWindowWidth(500);

            const { result } = renderHook(() => useBreakpoint());

            expect(result.current.breakpoint).toBe('mobile');
            expect(result.current.isMobile).toBe(true);
        });
    });

    describe('resize behavior', () => {
        it('updates breakpoint on window resize', () => {
            setWindowWidth(1280);

            const { result } = renderHook(() => useBreakpoint());

            expect(result.current.breakpoint).toBe('wide');

            act(() => {
                setWindowWidth(500);
            });

            expect(result.current.breakpoint).toBe('mobile');
        });

        it('cleans up resize listener on unmount', () => {
            const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
            setWindowWidth(1280);

            const { unmount } = renderHook(() => useBreakpoint());

            unmount();

            expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
            removeEventListenerSpy.mockRestore();
        });
    });

    describe('convenience flags', () => {
        it('provides isAtLeast helper for minimum breakpoint check', () => {
            setWindowWidth(1024);

            const { result } = renderHook(() => useBreakpoint());

            expect(result.current.isAtLeast('mobile')).toBe(true);
            expect(result.current.isAtLeast('tablet')).toBe(true);
            expect(result.current.isAtLeast('desktop')).toBe(true);
            expect(result.current.isAtLeast('wide')).toBe(false);
        });
    });
});

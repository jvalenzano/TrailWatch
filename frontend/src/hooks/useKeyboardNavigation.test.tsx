import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useKeyboardNavigation } from './useKeyboardNavigation';

describe('useKeyboardNavigation', () => {
    const mockOnSelect = vi.fn();
    const mockOnEscape = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('arrow key navigation', () => {
        it('navigates down with ArrowDown key', () => {
            const { result } = renderHook(() =>
                useKeyboardNavigation({
                    itemCount: 5,
                    onSelect: mockOnSelect,
                })
            );

            expect(result.current.focusedIndex).toBe(-1); // No initial focus

            act(() => {
                document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
            });

            expect(result.current.focusedIndex).toBe(0);

            act(() => {
                document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
            });

            expect(result.current.focusedIndex).toBe(1);
        });

        it('navigates up with ArrowUp key', () => {
            const { result } = renderHook(() =>
                useKeyboardNavigation({
                    itemCount: 5,
                    onSelect: mockOnSelect,
                    initialIndex: 2,
                })
            );

            expect(result.current.focusedIndex).toBe(2);

            act(() => {
                document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
            });

            expect(result.current.focusedIndex).toBe(1);
        });

        it('wraps around from last to first item', () => {
            const { result } = renderHook(() =>
                useKeyboardNavigation({
                    itemCount: 3,
                    onSelect: mockOnSelect,
                    initialIndex: 2,
                })
            );

            act(() => {
                document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
            });

            expect(result.current.focusedIndex).toBe(0);
        });

        it('wraps around from first to last item', () => {
            const { result } = renderHook(() =>
                useKeyboardNavigation({
                    itemCount: 3,
                    onSelect: mockOnSelect,
                    initialIndex: 0,
                })
            );

            act(() => {
                document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
            });

            expect(result.current.focusedIndex).toBe(2);
        });
    });

    describe('selection', () => {
        it('calls onSelect with focused index when Enter is pressed', () => {
            renderHook(() =>
                useKeyboardNavigation({
                    itemCount: 5,
                    onSelect: mockOnSelect,
                    initialIndex: 2,
                })
            );

            act(() => {
                document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
            });

            expect(mockOnSelect).toHaveBeenCalledWith(2);
        });

        it('does not call onSelect when no item is focused', () => {
            renderHook(() =>
                useKeyboardNavigation({
                    itemCount: 5,
                    onSelect: mockOnSelect,
                })
            );

            act(() => {
                document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
            });

            expect(mockOnSelect).not.toHaveBeenCalled();
        });
    });

    describe('escape handling', () => {
        it('calls onEscape when Escape is pressed', () => {
            renderHook(() =>
                useKeyboardNavigation({
                    itemCount: 5,
                    onSelect: mockOnSelect,
                    onEscape: mockOnEscape,
                    initialIndex: 2,
                })
            );

            act(() => {
                document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
            });

            expect(mockOnEscape).toHaveBeenCalledTimes(1);
        });

        it('resets focus index when Escape is pressed', () => {
            const { result } = renderHook(() =>
                useKeyboardNavigation({
                    itemCount: 5,
                    onSelect: mockOnSelect,
                    onEscape: mockOnEscape,
                    initialIndex: 2,
                })
            );

            expect(result.current.focusedIndex).toBe(2);

            act(() => {
                document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
            });

            expect(result.current.focusedIndex).toBe(-1);
        });
    });

    describe('cleanup', () => {
        it('removes event listener on unmount', () => {
            const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');

            const { unmount } = renderHook(() =>
                useKeyboardNavigation({
                    itemCount: 5,
                    onSelect: mockOnSelect,
                })
            );

            unmount();

            expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
            removeEventListenerSpy.mockRestore();
        });
    });

    describe('enabled flag', () => {
        it('ignores keyboard events when disabled', () => {
            const { result } = renderHook(() =>
                useKeyboardNavigation({
                    itemCount: 5,
                    onSelect: mockOnSelect,
                    enabled: false,
                })
            );

            act(() => {
                document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
            });

            expect(result.current.focusedIndex).toBe(-1);
        });

        it('responds to keyboard events when enabled', () => {
            const { result } = renderHook(() =>
                useKeyboardNavigation({
                    itemCount: 5,
                    onSelect: mockOnSelect,
                    enabled: true,
                })
            );

            act(() => {
                document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
            });

            expect(result.current.focusedIndex).toBe(0);
        });
    });

    describe('setFocusedIndex', () => {
        it('allows programmatic focus index changes', () => {
            const { result } = renderHook(() =>
                useKeyboardNavigation({
                    itemCount: 5,
                    onSelect: mockOnSelect,
                })
            );

            act(() => {
                result.current.setFocusedIndex(3);
            });

            expect(result.current.focusedIndex).toBe(3);
        });
    });
});

'use client'

import { useState } from 'react'

import { useEventListener } from './useEventListener'

/**
 * useIsBottom
 *
 * A custom React hook to track whether a specific element (or the page) is scrolled to the bottom.
 * It supports global targets (e.g., `window` or `document.documentElement`) and specific `HTMLElement`s.
 *
 * @param {number} [offset] - The offset in pixels to consider as "bottom". If the scroll position is within this offset, it is considered at the bottom.
 * @param {EventTarget | null | undefined} [element] - The target element to observe scroll position. Defaults to `globalThis` (commonly `window`).
 * @param {number} [debounce] - The debounce delay in milliseconds for scroll and resize events. Defaults to `0` (no debounce).
 * @param {boolean} [initialValue] - The initial value for `isBottom`. Defaults to `false`.
 * @returns {boolean} `isBottom` - Whether the target element is currently scrolled to the bottom.
 *
 * @example
 * Example: Observing the scroll position of the page
 * ```tsx
 * import { useIsBottom } from '@zl-asica/react';
 *
 * const MyComponent = () => {
 *   const isBottom = useIsBottom(50); // Consider 50px offset as bottom
 *
 *   return (
 *     <div>
 *       <p>{isBottom ? "You're at the bottom!" : "Scroll down!"}</p>
 *       <div style={{ height: '200vh', background: 'linear-gradient(to bottom, red, blue)' }} />
 *     </div>
 *   );
 * };
 * ```
 *
 * @example
 * Example: Observing the scroll position of a specific container
 * ```tsx
 * import { useRef } from 'react';
 * import { useIsBottom } from '@zl-asica/react';
 *
 * const MyComponent = () => {
 *   const containerRef = useRef<HTMLDivElement | null>(null);
 *   const isBottom = useIsBottom(50, containerRef.current); // Observe a specific container
 *
 *   return (
 *     <div>
 *       <p>{isBottom ? "Container is at the bottom!" : "Scroll more!"}</p>
 *       <div
 *         ref={containerRef}
 *         style={{
 *           height: '200px',
 *           overflowY: 'scroll',
 *           background: 'lightgray',
 *         }}
 *       >
 *         <div style={{ height: '500px' }}>Scrollable content</div>
 *       </div>
 *     </div>
 *   );
 * };
 * ```
 */
export const useIsBottom = (
  offset: number = 0,
  element?: HTMLElement | null | undefined,
  debounce: number = 0,
  initialValue: boolean = false,
): boolean => {
  const [isBottom, setIsBottom] = useState(initialValue)

  const checkBottom = (): void => {
    const target = element ?? document.documentElement

    // Handle cases where `scrollTop`, `scrollHeight`, or `clientHeight` may not exist
    const scrollTop = target.scrollTop || 0
    const scrollHeight = target.scrollHeight || 0
    const clientHeight = target.clientHeight || 0

    // Explicitly handle case where scrollHeight is 0 or undefined
    if (scrollHeight === 0) {
      setIsBottom(false)
      return
    }

    const isAtBottom = scrollTop + clientHeight >= scrollHeight - offset
    setIsBottom(isAtBottom)
  }

  // Attach scroll and resize listeners
  useEventListener(
    'scroll',
    checkBottom,
    element ? { current: element } : undefined,
    undefined,
    debounce,
  )
  useEventListener(
    'resize',
    checkBottom,
    element ? { current: element } : undefined,
    undefined,
    debounce,
  )

  return isBottom
}

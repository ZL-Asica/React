import { useState } from 'react'

import { useEventListener } from './useEventListener'

/**
 * Compute the current vertical scroll position for a given element or the window.
 *
 * When `percentage` is `false`, this returns the number of pixels scrolled.
 * When `percentage` is `true`, this returns the scroll position as a value
 * between 0 and 100 (where 0 is top and 100 is bottom).
 *
 * @param {HTMLElement | typeof globalThis} element - The element or `globalThis` (window) to measure.
 * @param {boolean} percentage - Whether to return the scroll position as a percentage.
 * @returns {number} The current scroll position in pixels or percentage.
 */
const computeScrollPosition = (
  element: HTMLElement | typeof globalThis,
  percentage: boolean,
): number => {
  // Guard for non-browser environments (SSR, tests without DOM, etc.)
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return 0
  }

  if (element instanceof HTMLElement) {
    const scrollableHeight = element.scrollHeight - element.clientHeight
    const scrollTop = element.scrollTop || 0

    if (percentage) {
      return scrollableHeight === 0
        ? 0
        : (scrollTop / scrollableHeight) * 100
    }

    return scrollTop
  }

  const { scrollHeight, clientHeight } = document.documentElement
  const scrollableHeight = scrollHeight - clientHeight
  const scrollY = window.scrollY || 0

  if (percentage) {
    return scrollableHeight === 0
      ? 0
      : (scrollY / scrollableHeight) * 100
  }

  return scrollY
}

/** @internal */
export const __INTERNAL__computeScrollPosition: typeof computeScrollPosition
  = computeScrollPosition

/**
 * A custom React hook to track the vertical scroll position of a specific element or the window.
 * Automatically updates whenever the user scrolls.
 *
 * @param {HTMLElement | typeof globalThis} [element] - The target element to track. Defaults to `globalThis` (window scroll position).
 * @param {boolean} [percentage] - Whether to return the scroll position as a percentage.
 * @param {number} [debounce] - The debounce delay in milliseconds for the scroll event.
 * @param {number} [initialValue] - The initial scroll position value, used when the DOM is not available.
 * @returns {number} The current vertical scroll position (in pixels or percentage).
 *
 * @example
 * // Tracking the scroll position of the page
 * ```tsx
 * import { useScrollPosition } from '@zl-asica/react';
 *
 * const MyComponent = () => {
 *   const scrollPosition = useScrollPosition();
 *
 *   return <div>Scroll Position: {scrollPosition}</div>;
 * };
 * ```
 *
 * @example
 * // Tracking the scroll position of a specific container
 * ```tsx
 * import { useRef } from 'react';
 * import { useScrollPosition } from '@zl-asica/react';
 *
 * const MyComponent = () => {
 *   const containerRef = useRef<HTMLDivElement | null>(null);
 *   const scrollPosition = useScrollPosition(containerRef.current);
 *
 *   return (
 *     <div ref={containerRef} style={{ height: '200px', overflowY: 'scroll' }}>
 *       <div style={{ height: '500px' }}>Content</div>
 *       <div>Scroll Position: {scrollPosition}</div>
 *     </div>
 *   );
 * };
 * ```
 */
export const useScrollPosition = (
  element: HTMLElement | typeof globalThis = globalThis,
  percentage: boolean = false,
  debounce: number = 0,
  initialValue: number = 0,
): number => {
  const [scrollPosition, setScrollPosition] = useState(() =>
    typeof window === 'undefined' || typeof document === 'undefined'
      ? initialValue
      : computeScrollPosition(element, percentage),
  )

  const handleScroll = (): void => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return
    }

    setScrollPosition(computeScrollPosition(element, percentage))
  }

  // Attach event listener for scroll events
  useEventListener(
    'scroll',
    handleScroll,
    { current: element },
    undefined,
    debounce,
  )

  return Number.isNaN(scrollPosition) ? 0 : scrollPosition
}

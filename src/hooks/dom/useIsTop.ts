'use client'

import { useState } from 'react'

import { useEventListener } from './useEventListener'

/**
 * A custom React hook to track whether a specific element (or the page) is scrolled to the top.
 * It supports global targets (e.g., `window` or `document.documentElement`) and specific `HTMLElement`s.
 *
 * @param {number} [offset=0] - The offset in pixels to consider as "top". If the scroll position is within this offset, it is considered at the top.
 * @param {EventTarget | null | undefined} [element=globalThis] - The target element to observe scroll position. Defaults to `globalThis` (commonly `window`).
 * @param {number} [debounce=0] - The debounce delay in milliseconds for scroll and resize events. Defaults to `0` (no debounce).
 * @param {boolean} [initialValue=true] - The initial value for `isTop`. Defaults to `true`.
 * @returns {boolean} `isTop` - Whether the target element is currently scrolled to the top.
 *
 * @example
 * Example: Observing the scroll position of the page
 * ```tsx
 * import { useIsTop } from '@zl-asica/react';
 *
 * const MyComponent = () => {
 *   const isTop = useIsTop(50); // Consider 50px offset as top
 *
 *   return (
 *     <div>
 *       <p>{isTop ? "You're at the top!" : "Scroll up!"}</p>
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
 * import { useIsTop } from '@zl-asica/react';
 *
 * const MyComponent = () => {
 *   const containerRef = useRef<HTMLDivElement | null>(null);
 *   const isTop = useIsTop(50, containerRef.current); // Observe a specific container
 *
 *   return (
 *     <div>
 *       <p>{isTop ? "Container is at the top!" : "Scroll up!"}</p>
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
 */

export const useIsTop = (
  offset: number = 0,
  element?: HTMLElement | null | undefined,
  debounce: number = 0,
  initialValue: boolean = true,
): boolean => {
  const [isTop, setIsTop] = useState(initialValue)

  const checkTop = (): void => {
    const target = element ?? document.documentElement

    // Handle cases where `scrollTop` may not exist
    const scrollTop = target.scrollTop ?? 0

    // Explicitly handle case where scrollTop is greater than the offset
    const isAtTop = scrollTop <= offset
    setIsTop(isAtTop)
  }

  // Attach scroll and resize listeners
  useEventListener(
    'scroll',
    checkTop,
    { current: element ?? globalThis },
    undefined,
    debounce,
  )

  return isTop
}

import type { RefObject } from 'react'
import { useState } from 'react'

import { useEventListener } from './useEventListener'

/**
 * Compute whether a given element is inside the viewport, optionally
 * extending the viewport bounds by a pixel offset.
 *
 * The check is based on the element's `getBoundingClientRect()` and compares
 * it against the current viewport width and height.
 *
 * @param {HTMLElement | null | undefined} element - The DOM element to check.
 * @param {number} offset - Offset in pixels to extend the viewport boundaries on all sides.
 * @returns {boolean} `true` if the element intersects the extended viewport, otherwise `false`.
 */
const computeVisibility = (
  element: HTMLElement | null | undefined,
  offset: number,
): boolean => {
  if (!element) {
    return false
  }

  const rect = element.getBoundingClientRect()
  const viewportHeight
    = window.innerHeight || document.documentElement.clientHeight
  const viewportWidth
    = window.innerWidth || document.documentElement.clientWidth

  return (
    rect.top <= viewportHeight + offset
    && rect.bottom >= -offset
    && rect.left <= viewportWidth + offset
    && rect.right >= -offset
  )
}

/**
 * A custom React hook to check if a DOM element is within the viewport.
 * Allows specifying an offset to consider elements near the edge of the viewport as "visible".
 *
 * The initial visibility is computed synchronously on mount based on the
 * current `reference.current` value, and then kept up to date on `scroll`
 * and `resize` events.
 *
 * @param {RefObject<HTMLElement>} reference - A React ref object pointing to the target element.
 * @param {number} [offset] - Offset in pixels to extend the viewport boundary.
 * @param {number} [debounce] - The debounce delay in milliseconds for scroll and resize events.
 * @returns {boolean} `isVisible` - Whether the element is within the viewport (considering offset).
 *
 * @example
 * ```tsx
 * import { useRef } from 'react';
 * import { useInViewport } from '@zl-asica/react';
 *
 * const MyComponent = () => {
 *   const ref = useRef<HTMLDivElement>(null);
 *   const isVisible = useInViewport(ref, 50); // 50px offset
 *
 *   return (
 *     <div>
 *       <div style={{ height: '150vh', background: 'lightgray' }}>Scroll down</div>
 *       <div
 *         ref={ref}
 *         style={{
 *           height: '100px',
 *           backgroundColor: isVisible ? 'green' : 'red',
 *         }}
 *       >
 *         {isVisible ? 'Visible' : 'Not Visible'}
 *       </div>
 *       <div style={{ height: '150vh', background: 'lightgray' }} />
 *     </div>
 *   );
 * };
 * ```
 */
export const useInViewport = (
  reference: RefObject<HTMLElement>,
  offset: number = 0,
  debounce: number = 100,
): boolean => {
  const [isVisible, setIsVisible] = useState(() =>
    typeof window === 'undefined'
      ? false
      : computeVisibility(reference.current, offset),
  )

  const handleChange = (): void => {
    if (typeof window === 'undefined') {
      return
    }
    setIsVisible(computeVisibility(reference.current, offset))
  }

  useEventListener('scroll', handleChange, reference, undefined, debounce)
  useEventListener('resize', handleChange, undefined, undefined, debounce)

  return isVisible
}

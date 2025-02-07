'use client'

import type { RefObject } from 'react'
import { useCallback, useEffect, useState } from 'react'

import { useEventListener } from './useEventListener'

/**
 * useInViewport
 *
 * A custom React hook to check if a DOM element is within the viewport.
 * Allows specifying an offset to consider elements near the edge of the viewport as "visible".
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
  const [isVisible, setIsVisible] = useState(false)

  const checkVisibility = useCallback((): void => {
    if (reference.current === undefined || reference.current === null) {
      return
    }

    const rect = reference.current.getBoundingClientRect()

    const inViewport
      = rect.top
        <= (window.innerHeight || document.documentElement.clientHeight)
        + offset
        && rect.bottom >= -offset
        && rect.left
        <= (window.innerWidth || document.documentElement.clientWidth) + offset
        && rect.right >= -offset

    setIsVisible(inViewport)
  }, [reference, offset])

  useEffect(() => {
    checkVisibility()
  }, [reference, offset, checkVisibility])

  useEventListener('scroll', checkVisibility, reference, undefined, debounce)
  useEventListener('resize', checkVisibility, undefined, undefined, debounce)

  return isVisible
}

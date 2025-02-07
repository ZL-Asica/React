'use client'

import { useEffect, useState } from 'react'

/**
 * useIntersectionObserver
 *
 * A custom React hook that uses the Intersection Observer API to determine
 * if an element is visible within the viewport.
 *
 * @param {React.RefObject<HTMLElement>} reference - A React ref pointing to the target DOM element.
 * @param {IntersectionObserverInit} [options] - Configuration options for the IntersectionObserver (e.g., threshold, root, rootMargin).
 * @returns {boolean} `isIntersecting` - Whether the element is currently visible in the viewport.
 *
 * @example
 * ```tsx
 * import { useRef } from 'react';
 * import { useIntersectionObserver } from '@zl-asica/react';
 *
 * const MyComponent = () => {
 *   const ref = useRef<HTMLDivElement>(null);
 *   const isVisible = useIntersectionObserver(ref, { threshold: 0.5 });
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
export const useIntersectionObserver = (
  reference: React.RefObject<HTMLElement>,
  options: IntersectionObserverInit = {},
): boolean => {
  const [isIntersecting, setIntersecting] = useState(false)

  useEffect(() => {
    if (reference.current === null) {
      return
    }

    const observer = new IntersectionObserver(([entry]) => {
      setIntersecting(entry.isIntersecting)
    }, options)

    const element = reference.current
    observer.observe(element)

    return () => {
      observer.unobserve(element)
      observer.disconnect()
    }
  }, [reference, options])

  return isIntersecting
}

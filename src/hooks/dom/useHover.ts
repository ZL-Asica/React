import type { RefObject } from 'react'
import { useCallback, useState } from 'react'

import { useEventListener } from './useEventListener'

/**
 * A custom React hook to track whether a referenced element is being hovered.
 *
 * @param {RefObject<T>} element - A React ref object pointing to the target element.
 * @returns {boolean} `isHovered` - Whether the element is currently being hovered.
 *
 * @example
 * ```tsx
 * import { useRef } from 'react';
 * import { useHover } from '@zl-asica/react';
 *
 * const MyComponent = () => {
 *   const ref = useRef<HTMLDivElement>(null);
 *   const isHovered = useHover(ref);
 *
 *   return (
 *     <div ref={ref} style={{ backgroundColor: isHovered ? 'blue' : 'gray' }}>
 *       Hover me!
 *     </div>
 *   );
 * };
 * ```
 */
export const useHover = <T extends HTMLElement = HTMLElement>(
  element: RefObject<T>,
): boolean => {
  const [isHovered, setHovered] = useState(false)

  // Handlers for hover events
  const handleMouseOver = useCallback(() => setHovered(true), [])
  const handleMouseOut = useCallback(() => setHovered(false), [])

  // Attach hover event listeners
  useEventListener('mouseover', handleMouseOver, element)
  useEventListener('mouseout', handleMouseOut, element)

  return isHovered
}

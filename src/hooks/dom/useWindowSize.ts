import { useState } from 'react'

import { useEventListener } from './useEventListener'

/**
 * A custom React hook to track the current window size.
 * Automatically updates whenever the window is resized.
 *
 * @param {number} [debounce=0] - The debounce delay in milliseconds for the resize event. Defaults to 0 (no debounce).
 * @returns {{ width: number; height: number }} An object containing the current window width and height.
 *
 * @example
 * ```tsx
 * import { useWindowSize } from '@zl-asica/react';
 *
 * const MyComponent = () => {
 *   const { width, height } = useWindowSize();
 *
 *   return (
 *     <div>
 *       <p>Width: {width}px</p>
 *       <p>Height: {height}px</p>
 *     </div>
 *   );
 * };
 * ```
 *
 * @example
 * with debounce:
 * ```tsx
 * import { useWindowSize } from '@zl-asica/react';
 *
 * const MyComponent = () => {
 *   const { width, height } = useWindowSize(300); // Update size with 300ms debounce
 *
 *   return (
 *     <div>
 *       <p>Width: {width}px</p>
 *       <p>Height: {height}px</p>
 *     </div>
 *   );
 * };
 * ```
 */

export const useWindowSize = (
  debounce: number = 0,
): { width: number, height: number } => {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  })

  const handleResize = (): void => {
    setSize({ width: window.innerWidth, height: window.innerHeight })
  }

  useEventListener('resize', handleResize, undefined, undefined, debounce)

  return size
}

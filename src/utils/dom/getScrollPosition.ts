/**
 * Retrieves the current scroll position of the window.
 *
 * This function calculates the horizontal (`x`) and vertical (`y`) scroll positions
 * using `window.scrollX`, `window.scrollY`, or fallback methods for older browsers.
 *
 * @returns {{ x: number; y: number }} An object containing the `x` and `y` scroll positions.
 *
 * @example
 * ```tsx
 * const { x, y } = getScrollPosition();
 * console.log(`Scroll X: ${x}, Scroll Y: ${y}`);
 * ```
 */
export const getScrollPosition = (): { x: number, y: number } => {
  const scrollX
    = window.scrollX
      ?? document.documentElement?.scrollLeft
      ?? document.body?.scrollLeft
      ?? 0

  const scrollY
    = window.scrollY
      ?? document.documentElement?.scrollTop
      ?? document.body?.scrollTop
      ?? 0

  return { x: scrollX, y: scrollY }
}

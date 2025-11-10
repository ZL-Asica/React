import type { MouseEvent as ReactMouseEvent } from 'react'

/**
 * Scrolls to the top of the page or a specified vertical position.
 *
 * This function uses `window.scrollTo` to scroll to a specified vertical position with
 * a configurable scroll behavior (`auto` or `smooth`).
 *
 * Optionally, a callback can be provided to execute logic after scrolling.
 *
 * @param {number} [top] - The vertical scroll position to scroll to (default is `0`).
 * @param {'auto' | 'smooth'} [behavior] - The scroll behavior (default is `'smooth'`).
 * @param {() => void} [callback] - Optional callback function to execute after scrolling.
 *
 * @example
 * ```tsx
 * // Bind it to a button click event
 * <button onClick={backToTop()}>Back to Top</button>
 * // Smooth scroll to the top of the page
 * backToTop();
 *
 * // Immediate scroll to 100px from the top
 * backToTop(100, 'auto');
 *
 * // Scroll to the top and log a message after
 * backToTop(0, 'smooth', () => console.log('Scrolled to top!'));
 * ```
 */
export const backToTop = (
  top: number = 0,
  behavior: 'auto' | 'smooth' = 'smooth',
  callback?: () => void,
): ((event?: ReactMouseEvent) => void) => {
  return (event?: ReactMouseEvent) => {
    // Prevent default action if used in an event handler
    if (event) {
      event.preventDefault()
    }

    // Scroll to the specified position
    window.scrollTo({
      top,
      behavior,
    })

    // Optionally execute the callback
    if (callback) {
      // If behavior is smooth, wait for the scroll to finish
      if (behavior === 'smooth') {
        const checkIfAtPosition = (): void => {
          if (Math.abs(window.scrollY - top) < 1) {
            callback()
          }
          else {
            requestAnimationFrame(checkIfAtPosition)
          }
        }
        requestAnimationFrame(checkIfAtPosition)
      }
      else {
        callback()
      }
    }
  }
}

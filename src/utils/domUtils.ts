'use client'

import type { MouseEvent as ReactMouseEvent } from 'react'
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

/**
 * Copies the given text to the clipboard.
 *
 * This function uses the Clipboard API to copy the specified text to the clipboard.
 * It supports an optional callback function that is executed immediately after the text is copied,
 * and optionally executed again after a specified timeout.
 *
 * @param {string} text - The text to copy to the clipboard.
 * @param {() => void} [callback] - An optional callback to run after the text is copied.
 * @param {number} [timeout] - Optional timeout in milliseconds to trigger the callback again after the delay.
 * @returns {Promise<boolean>} A promise that resolves to `true` if the copy was successful, or `false` otherwise.
 *
 * @example
 * ```tsx
 * copyToClipboard('Hello, world!', () => {
 *   console.log('Text copied!');
 * });
 * ```
 * @example
 * ```tsx
 * const success = await copyToClipboard('Hello, world!');
 * console.log(success ? 'Copied!' : 'Failed to copy!');
 * ```
 * @example
 * ```tsx
 * copyToClipboard('Hello, world!', () => {
 *   console.log('Callback triggered!');
 * }, 2000);
 * // Immediately logs "Callback triggered!" and logs it again after 2 seconds.
 * ```
 */
export const copyToClipboard = async (
  text: string,
  callback?: () => void,
  timeout?: number,
): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text)
    if (callback && typeof callback === 'function') {
      callback()
      if (timeout !== undefined && timeout > 0) {
        setTimeout(callback, timeout)
      }
    }
    return true
  }
  catch {
    return false
  }
}

/**
 * Retrieves text from the clipboard.
 *
 * This function uses the Clipboard API to read text from the clipboard. If an error
 * occurs, it returns an empty string.
 *
 * @returns {Promise<string>} A promise that resolves to the text from the clipboard, or an empty string if an error occurs.
 *
 * @example
 * ```tsx
 * const text = await pasteFromClipboard();
 * console.log(text);
 * ```
 */
export const pasteFromClipboard = async (): Promise<string> => {
  try {
    return await navigator.clipboard.readText()
  }
  catch {
    return ''
  }
}

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

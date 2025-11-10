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

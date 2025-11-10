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

/**
 * Truncate a string to the nearest whole word within a given length limit.
 * If the string exceeds the max length, it appends '...' at the end.
 * If no space is found within the truncated string, and the string is longer than the max length,
 * it will truncate the string at the max length and append '...'.
 *
 * @param {string} input - The raw input string to be truncated.
 * @param {number} maxLength - The maximum length of the truncated string (including ellipsis if applied).
 * @returns {string} - The truncated string that does not break words, with an optional ellipsis.
 *
 * @example
 * ```ts
 * truncateToNearestWord("This is a very long sentence that needs truncation.", 20);
 * // Returns: "This is a very..."
 * ```
 *
 * @example
 * ```ts
 * truncateToNearestWord("Short sentence.", 50);
 * // Returns: "Short sentence." (no truncation applied)
 * ```
 *
 * @example
 * ```ts
 * truncateToNearestWord("Exact length match!", 20);
 * // Returns: "Exact length match!"
 * ```
 */
export const truncateToNearestWord = (input: string, maxLength: number): string => {
  if (typeof input !== 'string' || typeof maxLength !== 'number' || maxLength <= 0) {
    // Return the input as-is if invalid
    return input
  }

  // No truncation needed
  if (input.length <= maxLength) {
    return input
  }

  let truncated = input.substring(0, maxLength)

  // Find the last space within the truncated string to avoid cutting words
  const lastSpaceIndex = truncated.lastIndexOf(' ')
  if (lastSpaceIndex > 0) {
    truncated = truncated.substring(0, lastSpaceIndex)
  }

  return `${truncated}...`
}

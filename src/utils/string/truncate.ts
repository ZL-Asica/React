/**
 * Truncates a string to a specified length, appending '...' if truncated.
 *
 * @param {string} input - The string to truncate.
 * @param {number} maxLength - The maximum length of the truncated string.
 * @returns {string} The truncated string. If `maxLength` is 0 or negative, returns an empty string.
 *
 * @example
 * ```tsx
 * truncate('This is a long string', 10); // 'This is a...'
 * truncate('Short', 10); // 'Short'
 * truncate('', 5); // ''
 * ```
 */
export const truncate = (input: string, maxLength: number): string => {
  if (maxLength <= 0 || !input) {
    return ''
  }
  return input.length > maxLength
    ? `${input.slice(0, maxLength).trim()}...`
    : input
}

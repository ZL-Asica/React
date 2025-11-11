/**
 * Options for {@link truncateMiddle}.
 */
export interface TruncateMiddleOptions {
  /**
   * Ellipsis string inserted in the middle.
   *
   * Defaults to the single-character `"…"`.
   */
  ellipsis?: string
}

/**
 * Truncate a string in the **middle**, preserving the start and end.
 *
 * Useful for displaying long IDs, file paths, or URLs where both
 * beginning and end segments matter.
 *
 * @param {string} input - The string to truncate.
 * @param {number} maxLength - Maximum total length of the result.
 * @param {TruncateMiddleOptions} [options] - Optional configuration.
 * @returns {string} Truncated string, or the original string if it fits.
 *
 * @example
 * ```ts
 * truncateMiddle('abcdefghijklmnop', 10); // 'abcde…mnop'
 * truncateMiddle('short', 10);            // 'short'
 * ```
 *
 * @example
 * ```ts
 * // Custom ellipsis and very small maxLength
 * truncateMiddle('abcdef', 4, { ellipsis: '...' }); // 'abcd'
 * ```
 */
export const truncateMiddle = (
  input: string,
  maxLength: number,
  options: TruncateMiddleOptions = {},
): string => {
  const { ellipsis = '…' } = options

  if (typeof maxLength !== 'number' || maxLength <= 0) {
    return ''
  }

  if (input.length <= maxLength) {
    return input
  }

  if (ellipsis.length >= maxLength) {
    // Not enough room to show both halves, just cut the string.
    return input.slice(0, maxLength)
  }

  const keep = maxLength - ellipsis.length
  const front = Math.ceil(keep / 2)
  const back = Math.floor(keep / 2)

  const start = input.slice(0, front)
  const end = input.slice(input.length - back)

  return `${start}${ellipsis}${end}`
}

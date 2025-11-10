/**
 * Reverses the characters in a string.
 *
 * @param {string} input - The string to reverse.
 * @returns {string} The reversed string.
 *
 * @example
 * ```tsx
 * reverseString('hello'); // 'olleh'
 * reverseString(''); // ''
 * ```
 */
export const reverseString = (input: string): string => {
  return [...input].reverse().join('')
}

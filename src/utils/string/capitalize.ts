/**
 * Capitalizes the first letter of a string. Just like `String.prototype.charAt(0).toUpperCase()`,
 * but without the need to call `slice(1)` to get the rest of the string.
 *
 * @param {string} input - The string to capitalize.
 * @returns {string} The capitalized string. Returns an empty string if the input is empty.
 *
 * @example
 * ```tsx
 * capitalize('hello'); // 'Hello'
 * capitalize('Hello'); // 'Hello'
 * capitalize(''); // ''
 * ```
 */
export const capitalize = (input: string): string => {
  if (!input) {
    return ''
  }
  return input.charAt(0).toUpperCase() + input.slice(1)
}

/**
 * Removes special characters from a string, preserving letters, numbers, and spaces.
 *
 * @param {string} input - The string to clean.
 * @returns {string} The cleaned string containing only letters, numbers, and spaces.
 *
 * @example
 * ```tsx
 * removeSpecialCharacters('Hello, World! 123'); // 'Hello World 123'
 * removeSpecialCharacters('你好，世界！123'); // '你好世界123'
 * removeSpecialCharacters('@#%*&$'); // ''
 * ```
 */
export const removeSpecialCharacters = (input: string): string => {
  // Regex explanation:
  // \p{L} matches any kind of letter from any language
  // \p{N} matches any kind of numeric character
  // \s matches any kind of whitespace
  return input.replaceAll(/[^\p{L}\p{N}\s]/gu, '')
}

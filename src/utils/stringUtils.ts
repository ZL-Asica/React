/**
 * Capitalizes the first letter of a string.
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

/**
 * Converts a camelCase string to kebab-case.
 *
 * @param {string} input - The camelCase string.
 * @returns {string} The kebab-case string.
 *
 * @example
 * ```tsx
 * camelCaseToKebabCase('camelCaseString'); // 'camel-case-string'
 * camelCaseToKebabCase('anotherExample'); // 'another-example'
 * ```
 */
export const camelCaseToKebabCase = (input: string): string => {
  return input.replaceAll(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
}

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

/**
 * Converts a string to snake_case.
 *
 * @param {string} input - The string to convert.
 * @returns {string} The snake_case string.
 *
 * @example
 * ```tsx
 * toSnakeCase('camelCaseString'); // 'camel_case_string'
 * toSnakeCase('anotherExample'); // 'another_example'
 * ```
 */
export const toSnakeCase = (input: string): string => {
  return input.replaceAll(/([a-z])([A-Z])/g, '$1_$2').toLowerCase()
}

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

/**
 * Generates a unique identifier by hashing an array of input strings, a timestamp, and a random value.
 *
 * This function combines the provided input strings (`inputValues`), the current timestamp, and
 * an optional random bias (`randomBias`). It applies the SHA-256 hashing algorithm (if supported),
 * and returns a hexadecimal string truncated to the specified length.
 *
 * If `crypto.subtle.digest` is not supported in the current environment, the function falls back to
 * generating a random string using `Math.random()` and the current timestamp. Note that the fallback
 * mechanism is less secure and should not be used for cryptographic purposes.
 *
 * The default length is 6 characters, which is sufficient for millions of records per millisecond
 * thanks to the inclusion of a highly random `randomBias`. For shorter lengths, it is recommended
 * not to go below 4 characters to minimize the risk of collisions.
 *
 * @param {string[]} inputValues - An array of input strings (e.g., user ID, file name, or other identifiers).
 *   These will be concatenated to form part of the unique ID input.
 * @param {string} [randomBias] -
 *   An optional random bias string. By default, it combines two random Base-36 strings, providing
 *   approximately \(2^{104}\) possible combinations, significantly reducing collision risk.
 * @param {number} [length] - The desired length of the resulting unique ID.
 *   Must be at least 1. Defaults to 6 characters.
 * @returns {Promise<string>} A promise resolving to the generated unique ID as a hexadecimal string.
 *   If the environment lacks support for `crypto.subtle.digest`, a non-hashed random string is returned.
 *
 * @throws {RangeError} Throws if the `length` parameter is less than 1.
 * @throws {TypeError} Throws if any element in `inputValues` or `randomBias` is not a string,
 *   or if `length` is not a number.
 * @throws {Error} Throws if `crypto.subtle.digest` is not supported and no fallback mechanism is possible.
 *
 * @example
 * Example 1: Generate a unique ID with default length (6 characters) using `await`.
 * ```ts
 * const inputs = ['user123', 'photo.png'];
 * const id = await generateUniqueId(inputs);
 * console.log(id); // Outputs: 'a1b2c3' (example result)
 * ```
 *
 * @example
 * Example 2: Generate a unique ID with a custom length (16 characters).
 * ```ts
 * const inputs = ['session456', 'document.pdf', 'additionalInfo'];
 * const customBias = 'customRandomBias123';
 * const customLength = 16;
 * const id = await generateUniqueId(inputs, customBias, customLength);
 * console.log(id); // Outputs: '1a2b3c4d5e6f7g8h' (example result)
 * ```
 *
 * @example
 * Example 3: Generate a unique ID in an environment without `crypto.subtle.digest`.
 * ```ts
 * const inputs = ['user123', 'file.txt'];
 * const id = await generateUniqueId(inputs);
 * console.log(id); // Outputs: 'abc123def456' (example random result)
 * ```
 */
export const generateUniqueId = async (
  inputValues: string[],
  randomBias: string = Math.random().toString(36) + Math.random().toString(36),
  length: number = 6,
): Promise<string> => {
  // Validate length
  if (length < 1) {
    throw new RangeError('Length must be at least 1.')
  }

  const encoder = new TextEncoder()
  const uniqueId = encoder.encode(
    inputValues.join('') + Date.now() + randomBias,
  )

  // Check for crypto.subtle.digest support
  if (crypto !== undefined && crypto.subtle !== undefined && typeof crypto.subtle.digest === 'function') {
    const hashBuffer = await crypto.subtle.digest('SHA-256', uniqueId)
    const hashArray = [...new Uint8Array(hashBuffer)]
    const hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
    return hash.slice(0, length)
  }

  // Simple fallback for environments with no crypto support
  const fallbackSimple = Math.random().toString(36) + Date.now().toString(36)
  return fallbackSimple.slice(0, length)
}

/**
 * truncateToNearestWord
 *
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
    throw new TypeError('Invalid input: input must be a string and maxLength must be a positive number.')
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

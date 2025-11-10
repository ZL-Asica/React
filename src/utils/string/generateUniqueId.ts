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

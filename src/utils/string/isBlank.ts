/**
 * Check whether a string is `null`, `undefined`, empty, or consists
 * only of whitespace characters (as defined by `String.prototype.trim`).
 *
 * @param {string | null | undefined} input - Value to check.
 * @returns {boolean} `true` if the string is effectively blank.
 *
 * @example
 * ```ts
 * isBlank('');        // true
 * isBlank('   ');     // true
 * isBlank('\n\t');    // true
 * isBlank(' text ');  // false
 * ```
 */
export const isBlank = (input: string | null | undefined): boolean => {
  if (input == null) {
    return true
  }

  return input.trim().length === 0
}

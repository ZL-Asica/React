/**
 * Escape characters in a string so it can be safely used inside a
 * JavaScript regular expression pattern (literal or `new RegExp`).
 *
 * It escapes the standard ECMAScript metacharacters:
 * `.*+?^${}()|[]\`
 *
 * For example:
 * - `[test].*` → `\\[test\\]\\.\\*`
 *
 * @param {string} input - Raw string that may contain RegExp meta characters.
 * @returns {string} Escaped string safe to embed in a RegExp pattern.
 *
 * @example
 * ```ts
 * const pattern = new RegExp(`^${escapeRegExp(userInput)}$`);
 * ```
 */
const REGEXP_SPECIAL_CHARS = /[.*+?^${}()|[\]\\]/g

export const escapeRegExp = (input: string): string =>
  input.replace(REGEXP_SPECIAL_CHARS, '\\$&')

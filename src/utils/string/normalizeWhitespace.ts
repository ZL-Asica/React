/**
 * Options for {@link normalizeWhitespace}.
 */
export interface NormalizeWhitespaceOptions {
  /**
   * Whether to collapse multiple whitespace characters into a single
   * space (or a single newline when line breaks are preserved).
   *
   * Defaults to `true`.
   */
  collapse?: boolean

  /**
   * Whether to trim leading and trailing whitespace.
   *
   * - When `preserveLineBreaks` is `false`, the whole string is trimmed.
   * - When `true`, each line is trimmed individually.
   *
   * Defaults to `true`.
   */
  trim?: boolean

  /**
   * Whether to preserve line breaks.
   *
   * - When `false` (default), all whitespace, including newlines, is
   *   collapsed to a single space.
   * - When `true`, line breaks are kept but surrounding spaces are
   *   normalized.
   */
  preserveLineBreaks?: boolean
}

/**
 * Normalize whitespace in a string.
 *
 * Can be used to:
 * - collapse repeated spaces / tabs / newlines,
 * - trim leading and trailing whitespace,
 * - optionally preserve line breaks while normalizing spaces on each line.
 *
 * When {@link NormalizeWhitespaceOptions.preserveLineBreaks} is `true`,
 * Windows-style `\r\n` sequences are normalized to `\n`.
 *
 * @param {string} input - The string to normalize.
 * @param {NormalizeWhitespaceOptions} [options] - Optional configuration.
 * @returns {string} A whitespace-normalized string.
 *
 * @example
 * ```ts
 * normalizeWhitespace('  hello   world  ');
 * // 'hello world'
 *
 * normalizeWhitespace('  a\n   b  ', { preserveLineBreaks: true });
 * // 'a\nb'
 * ```
 */
export const normalizeWhitespace = (
  input: string,
  options: NormalizeWhitespaceOptions = {},
): string => {
  const {
    collapse = true,
    trim = true,
    preserveLineBreaks = false,
  } = options

  let value = input

  if (collapse) {
    if (preserveLineBreaks) {
      // Collapse horizontal whitespace but keep line breaks.
      value = value.replace(/[ \t\f\v]+/g, ' ')
      // Normalize spaces around line breaks.
      value = value.replace(/ ?\r?\n ?/g, '\n')
    }
    else {
      // Collapse all whitespace (including newlines) into a single space.
      value = value.replace(/\s+/g, ' ')
    }
  }

  if (trim) {
    if (preserveLineBreaks) {
      value = value
        .split('\n')
        .map(line => line.trim())
        .join('\n')
    }
    else {
      value = value.trim()
    }
  }

  return value
}

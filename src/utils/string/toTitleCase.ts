/**
 * Options for {@link toTitleCase}.
 */
export interface TitleCaseOptions {
  /**
   * Words that should usually remain in lowercase when they are not
   * the first or last word of the string.
   *
   * Defaults to a small English list such as:
   * `"and"`, `"or"`, `"of"`, `"the"`, `"a"`, `"an"`, `"in"`, `"on"`, `"at"`,
   * `"for"`, `"by"`, `"to"`, `"from"`, `"with"`.
   */
  minorWords?: string[]

  /**
   * Whether to preserve existing ALL-CAPS words (e.g. "API", "HTTP").
   *
   * Defaults to `true`.
   */
  preserveUpper?: boolean
}

/**
 * Convert a string to "Title Case", with support for:
 * - minor words that usually stay lowercase (e.g. "and", "of"),
 * - preserving existing ALL-CAPS acronyms.
 *
 * Whitespace between words is preserved, but punctuation is not
 * treated specially.
 *
 * @param {string} input - The input string.
 * @param {TitleCaseOptions} [options] - Optional configuration.
 * @returns {string} The title-cased string.
 *
 * @example
 * ```ts
 * toTitleCase('the lord of the rings');
 * // 'The Lord of the Rings'
 *
 * toTitleCase('api reference for HTTP', { preserveUpper: true });
 * // 'API Reference for HTTP'
 * ```
 */
export const toTitleCase = (
  input: string,
  options: TitleCaseOptions = {},
): string => {
  const {
    minorWords = [
      'and',
      'or',
      'of',
      'the',
      'a',
      'an',
      'in',
      'on',
      'at',
      'for',
      'by',
      'to',
      'from',
      'with',
    ],
    preserveUpper = true,
  } = options

  if (!input) {
    return input
  }

  const minorSet = new Set(minorWords.map(w => w.toLowerCase()))

  // Split preserving whitespace tokens.
  const tokens = input.split(/(\s+)/)
  const wordTokens = tokens.filter(token => !/^\s+$/.test(token))
  const totalWords = wordTokens.length

  let wordIndex = 0

  const result = tokens.map((token) => {
    if (/^\s+$/.test(token)) {
      return token
    }

    const original = token
    const lower = original.toLowerCase()
    const isFirst = wordIndex === 0
    const isLast = wordIndex === totalWords - 1
    wordIndex += 1

    // Preserve ALL-CAPS acronyms when requested.
    if (
      preserveUpper
      && /[A-Z]/.test(original)
      && original === original.toUpperCase()
    ) {
      return original
    }

    if (!isFirst && !isLast && minorSet.has(lower)) {
      return lower
    }

    // Normal word: capitalize first letter, rest lowercase.
    return lower.charAt(0).toUpperCase() + lower.slice(1)
  })

  return result.join('')
}

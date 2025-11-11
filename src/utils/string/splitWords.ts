/**
 * Options for {@link splitWords}.
 */
export interface SplitWordsOptions {
  /**
   * Whether to preserve the original letter casing.
   *
   * - When `false` (default), all words are lowercased.
   * - When `true`, original casing is kept.
   */
  preserveCase?: boolean

  /**
   * Whether to split number segments from letters.
   *
   * - `"foo123bar"` with `splitOnNumbers: true` → `["foo", "123", "bar"]`
   * - With `false` → one single token.
   */
  splitOnNumbers?: boolean
}

/**
 * Split a string into "words" based on:
 * - Non-alphanumeric separators (spaces, punctuation, etc.)
 * - camelCase boundaries (`"fooBar"` → `"foo"`, `"Bar"`)
 * - optional transitions between letters and digits
 *
 * This is a small utility intended for implementing casing helpers
 * (kebab-case, snake_case, slugify, etc.).
 *
 * @param {string} input - The input string to split.
 * @param {SplitWordsOptions} [options] - Optional configuration.
 * @returns {string[]} An array of word tokens.
 *
 * @example
 * ```ts
 * splitWords('helloWorldAPI42', { splitOnNumbers: true });
 * // ["hello", "world", "API", "42"]
 * ```
 */
export const splitWords = (
  input: string,
  options: SplitWordsOptions = {},
): string[] => {
  const { preserveCase = false, splitOnNumbers = false } = options

  if (!input) {
    return []
  }

  const baseTokens = input
    // Treat any run of non-alphanumeric characters as a separator.
    .split(/[^A-Z0-9]+/i)
    .filter(Boolean)

  const result: string[] = []

  const isDigit = (ch: string): boolean => ch >= '0' && ch <= '9'
  const isUpper = (ch: string): boolean => ch >= 'A' && ch <= 'Z'
  const isLower = (ch: string): boolean => ch >= 'a' && ch <= 'z'

  const splitToken = (token: string): string[] => {
    // In theory, this guard statement is not reachable
    /* v8 ignore if @preserve */
    if (token.length === 0) {
      return []
    }

    let current = token[0]
    const parts: string[] = []

    for (let i = 1; i < token.length; i++) {
      const prev = token[i - 1]
      const ch = token[i]

      const prevIsDigit = isDigit(prev)
      const chIsDigit = isDigit(ch)

      // Split when digit <-> non-digit transitions if enabled
      if (splitOnNumbers && prevIsDigit !== chIsDigit) {
        parts.push(current)
        current = ch
        continue
      }

      // Split at camelCase boundaries: fooBar -> foo | Bar
      if (!prevIsDigit && !chIsDigit && isLower(prev) && isUpper(ch)) {
        parts.push(current)
        current = ch
        continue
      }

      current += ch
    }

    parts.push(current)
    return parts
  }

  for (const token of baseTokens) {
    const pieces = splitToken(token)
    for (const piece of pieces) {
      result.push(preserveCase ? piece : piece.toLowerCase())
    }
  }

  return result
}

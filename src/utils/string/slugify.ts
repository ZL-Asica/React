import { escapeRegExp } from './escapeRegExp'

/**
 * Options for {@link slugify}.
 */
export interface SlugifyOptions {
  /**
   * Whether to transform the slug to lower case.
   *
   * Defaults to `true`.
   */
  lower?: boolean

  /**
   * Separator to use between slug tokens.
   *
   * Defaults to `"-"`.
   */
  separator?: string

  /**
   * Whether to trim repeated separators at the start and end.
   *
   * Defaults to `true`.
   */
  trimSeparator?: boolean

  /**
   * Optional maximum length (in characters) for the slug.
   *
   * When provided, the slug string is truncated to this length and then
   * trimmed from leading/trailing separators if `trimSeparator` is `true`.
   */
  maxLength?: number
}

/**
 * Convert an arbitrary string into a URL-friendly "slug".
 *
 * This function:
 * - Normalizes Unicode (NFKD) and strips diacritics (`é` → `e`).
 * - Keeps only ASCII letters and digits, turning other characters into
 *   separators.
 * - Collapses consecutive separators.
 * - Optionally truncates the slug and trims trailing separators after
 *   truncation when {@link SlugifyOptions.maxLength} is provided.
 *
 * @param {string} input - Input string (e.g. a title).
 * @param {SlugifyOptions} [options] - Optional configuration.
 * @returns {string} Slugified string (may be empty).
 *
 * @example
 * ```ts
 * slugify('Hello, World!');              // "hello-world"
 * slugify('Déjà Vu', { lower: false });  // "Deja-Vu"
 * slugify('A  very   long   title', {
 *   maxLength: 12,
 * }); // "a-very-long"
 * ```
 */
export const slugify = (input: string, options: SlugifyOptions = {}): string => {
  const {
    lower = true,
    separator = '-',
    trimSeparator = true,
    maxLength,
  } = options

  if (!input) {
    return ''
  }

  // Normalize and strip diacritics
  let text = input.normalize('NFKD').replace(/[\u0300-\u036F]/g, '')

  // Replace non-alphanumeric with spaces
  text = text.replace(/[^A-Z0-9]+/gi, ' ')

  const words = text.trim().split(/\s+/).filter(Boolean)

  if (words.length === 0) {
    return ''
  }

  let slug = (lower ? words.map(w => w.toLowerCase()) : words).join(separator)

  if (typeof maxLength === 'number' && maxLength > 0 && slug.length > maxLength) {
    slug = slug.slice(0, maxLength)
  }

  if (trimSeparator && separator.length > 0) {
    const escapedSep = escapeRegExp(separator)
    slug = slug.replace(
      new RegExp(`^${escapedSep}+|${escapedSep}+$`, 'g'),
      '',
    )
  }

  return slug
}

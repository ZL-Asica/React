import { toTitleCase } from '@/utils/string'

describe('toTitleCase', () => {
  it('returns empty string as-is', () => {
    expect(toTitleCase('')).toBe('')
  })

  it('title-cases with default minor words', () => {
    const input = 'the lord of the rings'
    const result = toTitleCase(input)

    // "the" and "of" are default minor words and should stay lowercase
    expect(result).toBe('The Lord of the Rings')
  })

  it('capitalizes first and last words even if they are minor words', () => {
    const input = 'in the middle of nowhere'
    const result = toTitleCase(input)

    // "in" and "nowhere" are first/last and should be capitalized
    // "the" and "of" are minor words in the middle and stay lowercase
    expect(result).toBe('In the Middle of Nowhere')
  })

  it('preserves ALL-CAPS words when preserveUpper is true (default)', () => {
    const input = 'API reference for HTTP and REST'
    const result = toTitleCase(input)

    // "API", "HTTP", "REST" remain as-is, minor "for" / "and" stay lowercase
    expect(result).toBe('API Reference for HTTP and REST')
  })

  it('lowercases ALL-CAPS words when preserveUpper is false', () => {
    const input = 'api reference for HTTP and REST'
    const result = toTitleCase(input, { preserveUpper: false })

    // First word always capitalized, others normal title-cased
    expect(result).toBe('Api Reference for Http and Rest')
  })

  it('respects custom minorWords and ignores the defaults', () => {
    const input = 'once upon a time in space'
    const result = toTitleCase(input, {
      // Only "in" is considered minor in this custom config
      minorWords: ['in'],
    })

    // "once", "upon", "a", "time", "space" are not in custom minor list
    // "in" is minor and not first/last, so stays lowercase
    expect(result).toBe('Once Upon A Time in Space')
  })

  it('preserves whitespace between words (multiple spaces, tabs, newlines)', () => {
    const input = '  hello\tworld   \nfoo'
    const result = toTitleCase(input)

    // Whitespace should be preserved exactly, only words are transformed
    expect(result).toBe('  Hello\tWorld   \nFoo')
  })

  it('handles punctuation and non-letter tokens as regular words', () => {
    const input = 'chapter 2: the return of the king'
    const result = toTitleCase(input)

    // "2:" is treated as a word; only first char is "cased" (which does nothing)
    // "the" and "of" as minor words in the middle stay lowercase
    expect(result).toBe('Chapter 2: the Return of the King')
  })

  it('works for a single-word input', () => {
    expect(toTitleCase('hello')).toBe('Hello')
    expect(toTitleCase('HELLO')).toBe('HELLO') // preserved as ALL-CAPS by default
  })

  it('handles strings that are already in title case without breaking them', () => {
    const input = 'The Quick Brown Fox'
    const result = toTitleCase(input)

    expect(result).toBe('The Quick Brown Fox')
  })
})

import { slugify } from '@/utils/string'

describe('slugify', () => {
  it('returns empty string for empty input', () => {
    expect(slugify('')).toBe('')
  })

  it('slugifies a basic phrase with default options', () => {
    expect(slugify('Hello, World!')).toBe('hello-world')
    expect(slugify('  A   very   long   title  ')).toBe('a-very-long-title')
  })

  it('respects lower = false (keeps original case of letters)', () => {
    expect(slugify('Hello WORLD', { lower: false })).toBe('Hello-WORLD')
  })

  it('strips accents / diacritics via NFKD normalization', () => {
    expect(slugify('Déjà Vu')).toBe('deja-vu')
    expect(slugify('Crème brûlée')).toBe('creme-brulee')
  })

  it('uses custom separator and trims it correctly with maxLength', () => {
    const input = 'A  very   long   title'
    const result = slugify(input, {
      separator: '_',
      maxLength: 11,
      trimSeparator: true,
    })

    // Original slug: "a_very_long_title"
    // Truncate 10 characters: "a_very_long_"
    // Get ride of trailing separator: "a_very_long"
    expect(result).toBe('a_very_long')
  })

  it('truncates to maxLength and trims trailing separator (example from docs)', () => {
    const result = slugify('A  very   long   title', {
      maxLength: 12,
    })

    // Original slug: "a-very-long-title"
    // Truncate 12 characters: "a-very-long-"
    // Get ride of trailing separator: "a-very-long"
    expect(result).toBe('a-very-long')
  })

  it('respects trimSeparator = false and keeps trailing separator after truncation', () => {
    const result = slugify('A  very   long   title', {
      maxLength: 12,
      trimSeparator: false,
    })

    // Does not remove trailing '-'
    expect(result).toBe('a-very-long-')
  })

  it('uses empty string as separator when separator is ""', () => {
    const result = slugify('Hello World', {
      separator: '',
    })

    // All words are concatenated directly
    expect(result).toBe('helloworld')
  })

  it('returns entire slug when maxLength is omitted or not exceeded', () => {
    const result = slugify('short-title', { maxLength: 50 })
    expect(result).toBe('short-title')

    const resultNoMax = slugify('another short title')
    expect(resultNoMax).toBe('another-short-title')
  })

  it('returns empty string when input contains no alphanumeric characters', () => {
    expect(slugify('*** --- !!!')).toBe('')
  })

  it('handles multi-character separators with RegExp special chars safely', () => {
    const input = 'a b'
    const result = slugify(input, {
      separator: '.*',
      maxLength: 3,
      trimSeparator: true,
    })

    // Process:
    // Original words: ['a','b']
    // slug = "a.*b"
    // Truncate 3 characters: "a.*"
    // Get rid of trailing ".*" -> "a"
    expect(result).toBe('a')
  })

  it('does not trim when separator is empty string even with trimSeparator = true', () => {
    const result = slugify('Hello world', {
      separator: '',
      maxLength: 5,
      trimSeparator: true,
    })

    // separator = '', will not enter trimSeparator branch
    // "helloworld".slice(0, 5) -> "hello"
    expect(result).toBe('hello')
  })
})

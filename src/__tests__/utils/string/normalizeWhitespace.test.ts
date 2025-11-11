import { normalizeWhitespace } from '@/utils/string'

describe('normalizeWhitespace', () => {
  it('collapses all whitespace and trims by default', () => {
    const input = '  foo \t bar\nbaz   '
    const result = normalizeWhitespace(input)

    // All whitespace (space / tab / newline) is collapsed into a single space and trimmed overall
    expect(result).toBe('foo bar baz')
  })

  it('preserves line breaks and trims each line when preserveLineBreaks is true', () => {
    const input = '  a\n   b  \n   c   '
    const result = normalizeWhitespace(input, { preserveLineBreaks: true })

    // Each line's own leading and trailing whitespace is trimmed, internal multiple spaces are collapsed, and line breaks are preserved
    expect(result).toBe('a\nb\nc')
  })

  it('collapses horizontal whitespace around line breaks but keeps outer spaces when trim is false & preserveLineBreaks is true', () => {
    const input = '  a   \n   b  '
    const result = normalizeWhitespace(input, {
      preserveLineBreaks: true,
      trim: false,
    })

    // First becomes ' a \n b ', then " space+newline+space " becomes '\n'
    // Finally, no trim is done, so the result still has a space on both sides
    expect(result).toBe(' a\nb ')
  })

  it('skips collapsing when collapse is false but still trims when trim is true (no line breaks)', () => {
    const input = '  hello   world  '
    const result = normalizeWhitespace(input, {
      collapse: false,
      trim: true,
    })

    // Internal multiple spaces are not collapsed, only overall trim is done
    expect(result).toBe('hello   world')
  })

  it('skips collapsing when collapse is false but trims each line when preserveLineBreaks is true', () => {
    const input = '  a  \n   b   '
    const result = normalizeWhitespace(input, {
      collapse: false,
      trim: true,
      preserveLineBreaks: true,
    })

    // Does not collapse internal whitespace, only trims each line, preserving line breaks
    expect(result).toBe('a\nb')
  })

  it('skips both collapse and trim when collapse=false and trim=false', () => {
    const input = '  foo \t bar\n  '
    const result = normalizeWhitespace(input, {
      collapse: false,
      trim: false,
    })

    // Does not do any processing at all
    expect(result).toBe(input)
  })

  it('normalizes Windows-style CRLF line endings when preserveLineBreaks is true', () => {
    const input = '  a \r\n  b  '
    const result = normalizeWhitespace(input, {
      preserveLineBreaks: true,
    })

    // \r\n unified to '\n', and each line is trimmed
    expect(result).toBe('a\nb')
  })

  it('returns empty string unchanged', () => {
    expect(normalizeWhitespace('')).toBe('')
    expect(normalizeWhitespace('', { collapse: false, trim: false })).toBe('')
  })
})

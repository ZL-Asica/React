import { isBlank } from '@/utils/string'

describe('isBlank', () => {
  it('returns true for null and undefined', () => {
    expect(isBlank(null)).toBe(true)
    expect(isBlank(undefined)).toBe(true)
  })

  it('returns true for empty string', () => {
    expect(isBlank('')).toBe(true)
  })

  it('returns true for whitespace-only strings', () => {
    expect(isBlank('   ')).toBe(true)
    expect(isBlank('\n\t\r')).toBe(true)
  })

  it('returns false for non-empty strings', () => {
    expect(isBlank('a')).toBe(false)
    expect(isBlank(' text ')).toBe(false)
    expect(isBlank('0')).toBe(false)
  })

  it('treats Unicode whitespace as blank as well', () => {
    // non-breaking space mix with regular spaces
    const nonBreakingSpace = '\u00A0'
    expect(isBlank(`${nonBreakingSpace}   ${nonBreakingSpace}`)).toBe(true)
  })
})

import { escapeRegExp } from '@/utils/string'

describe('escapeRegExp', () => {
  it('escapes all RegExp special characters', () => {
    const raw = '.*+?^${}()|[]\\'
    const escaped = escapeRegExp(raw)

    expect(escaped).toBe('\\.\\*\\+\\?\\^\\$\\{\\}\\(\\)\\|\\[\\]\\\\')
  })

  it('returns the same string when there are no special characters', () => {
    const raw = 'abc123_xyz'
    const escaped = escapeRegExp(raw)

    expect(escaped).toBe(raw)
  })

  it('handles empty string', () => {
    expect(escapeRegExp('')).toBe('')
  })

  it('produces a string that can safely be used inside a RegExp', () => {
    const userInput = '[test].*'
    const pattern = new RegExp(`^${escapeRegExp(userInput)}$`)

    expect('[test].*').toMatch(pattern)
    expect('[test].***').not.toMatch(pattern)
    expect('x[test].*y').not.toMatch(pattern)
  })
})

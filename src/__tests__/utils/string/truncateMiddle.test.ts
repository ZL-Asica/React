import { truncateMiddle } from '@/utils/string/truncateMiddle'

describe('truncateMiddle', () => {
  it('returns empty string when maxLength is not a positive number', () => {
    // maxLength <= 0
    expect(truncateMiddle('abc', 0)).toBe('')
    expect(truncateMiddle('abc', -1)).toBe('')

    // typeof maxLength !== "number"
    expect(truncateMiddle('abc', '10' as unknown as number)).toBe('')
  })

  it('returns original string when length is within maxLength', () => {
    expect(truncateMiddle('abc', 3)).toBe('abc')
    expect(truncateMiddle('abc', 5)).toBe('abc')
    expect(truncateMiddle('', 5)).toBe('')
  })

  it('truncates with default ellipsis when input is too long', () => {
    const input = 'abcdefghijklmnop' // length 16

    const result = truncateMiddle(input, 10)
    // keep = 10 - 1 = 9 -> front = 5, back = 4
    expect(result).toBe('abcde…mnop')
    expect(result.length).toBe(10)
  })

  it('handles case where ellipsis length >= maxLength by simple slice', () => {
    const input = 'abcdefgh'

    const result = truncateMiddle(input, 3, { ellipsis: '------' })
    // ellipsis.length = 6 >= 3 → fallback branch: input.slice(0, maxLength)
    expect(result).toBe('abc')
  })

  it('uses custom multi-character ellipsis and keeps total length', () => {
    const input = 'abcdefghijklmnop'
    const ellipsis = '---'

    const result = truncateMiddle(input, 12, { ellipsis })

    // maxLength = 12, ellipsisLength = 3 → keep = 9
    // front = ceil(9/2) = 5, back = floor(9/2) = 4
    // "abcde" + "---" + "mnop" → length 12
    expect(result).toBe('abcde---mnop')
    expect(result.length).toBe(12)
  })

  it('splits evenly when keep is even', () => {
    const input = 'abcdefghijk' // length 11
    const ellipsis = '--'
    const maxLength = 10

    const result = truncateMiddle(input, maxLength, { ellipsis })

    // maxLength = 10, ellipsisLength = 2 → keep = 8
    // front = 4, back = 4
    // "abcd" + "--" + "hijk"
    expect(result).toBe('abcd--hijk')
    expect(result.length).toBe(10)
  })

  it('works correctly for very small maxLength relative to input', () => {
    const input = 'abcdefgh'

    const result = truncateMiddle(input, 2)
    // ellipsis = '…' (length 1) < 2
    // keep = 1 → front = 1, back = 0
    // "a" + "…" + "" = "a…"
    expect(result).toBe('a…')
  })

  it('works with empty input regardless of maxLength', () => {
    expect(truncateMiddle('', 1)).toBe('')
    expect(truncateMiddle('', 10, { ellipsis: '---' })).toBe('')
  })
})

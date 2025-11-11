import { toDateOrNull, toDateStrict } from '@/utils/date/utils'

describe('toDateStrict', () => {
  it('clones a Date instance without mutating the original', () => {
    const original = new Date(2024, 0, 10, 12, 34, 56, 789)

    const result = toDateStrict(original)

    expect(result).not.toBe(original)
    expect(result.getTime()).toBe(original.getTime())

    result.setFullYear(1999)
    expect(original.getFullYear()).toBe(2024)
  })

  it('parses a valid ISO-like string into a Date', () => {
    const str = '2024-02-09T05:06:07'
    const result = toDateStrict(str)

    expect(Number.isNaN(result.getTime())).toBe(false)

    const expected = new Date(str)
    expect(result.getTime()).toBe(expected.getTime())
  })

  it('parses a valid timestamp number into a Date', () => {
    const base = new Date(2024, 1, 9, 5, 6, 7)
    const ts = base.getTime()

    const result = toDateStrict(ts)
    expect(result.getTime()).toBe(ts)
  })

  it('throws RangeError for an invalid date string', () => {
    expect(() =>
      toDateStrict('not-a-real-date'),
    ).toThrow(RangeError)

    expect(() =>
      toDateStrict('2024-13-99T99:99:99'),
    ).toThrow(RangeError)
  })

  it('throws RangeError for an invalid timestamp number', () => {
    expect(() =>
      toDateStrict(Number.NaN),
    ).toThrow(RangeError)
  })

  it('uses the shared error message for easier debugging', () => {
    try {
      toDateStrict('bad-date')
    }
    catch (error) {
      expect(error).toBeInstanceOf(RangeError)
      expect((error as RangeError).message).toBe(
        'toDateStrict: Invalid date input',
      )
    }
  })
})

describe('toDateOrNull', () => {
  it('returns null for undefined', () => {
    expect(toDateOrNull(undefined)).toBeNull()
  })

  it('returns null for null', () => {
    expect(toDateOrNull(null)).toBeNull()
  })

  it('clones a valid Date instance and does not mutate the original', () => {
    const original = new Date(2024, 0, 10, 12, 34, 56, 789)

    const result = toDateOrNull(original)

    // Should return a Date, not null
    expect(result).toBeInstanceOf(Date)
    expect(result).not.toBeNull()

    // Should be a new instance (clone)
    expect(result).not.toBe(original)
    expect(result!.getTime()).toBe(original.getTime())

    // Mutating the result must not affect the original
    result!.setFullYear(1999)
    expect(original.getFullYear()).toBe(2024)
  })

  it('parses a valid ISO-like string into a Date', () => {
    const str = '2024-02-09T05:06:07'
    const result = toDateOrNull(str)

    expect(result).toBeInstanceOf(Date)
    expect(result).not.toBeNull()

    const expected = new Date(str)
    expect(result!.getTime()).toBe(expected.getTime())
  })

  it('returns null for an invalid date string', () => {
    expect(toDateOrNull('not-a-date')).toBeNull()
    expect(toDateOrNull('2024-13-99T99:99:99')).toBeNull()
  })

  it('parses a valid timestamp number into a Date', () => {
    const base = new Date(2024, 1, 9, 5, 6, 7)
    const ts = base.getTime()

    const result = toDateOrNull(ts)

    expect(result).toBeInstanceOf(Date)
    expect(result!.getTime()).toBe(ts)
  })

  it('returns null for an invalid numeric timestamp (NaN)', () => {
    expect(toDateOrNull(Number.NaN)).toBeNull()
  })

  it('does not throw for any supported input type', () => {
    const values: Array<Date | string | number | null | undefined> = [
      new Date(),
      '2024-01-01',
      Date.now(),
      null,
      undefined,
      'definitely-not-a-date',
    ]

    for (const v of values) {
      expect(() => {
        const result = toDateOrNull(v)
        // Just ensure it returns something without throwing
        void result
      }).not.toThrow()
    }
  })
})

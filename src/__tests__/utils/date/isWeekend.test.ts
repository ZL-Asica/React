import { isWeekend } from '@/utils/date'

describe('isWeekend', () => {
  it('returns true for Saturday (Date input)', () => {
    // 2024-01-06 is a Saturday
    const d = new Date(2024, 0, 6)
    expect(isWeekend(d)).toBe(true)
  })

  it('returns true for Sunday (Date input)', () => {
    // 2024-01-07 is a Sunday
    const d = new Date(2024, 0, 7)
    expect(isWeekend(d)).toBe(true)
  })

  it('returns false for weekdays (Date input)', () => {
    const monday = new Date(2024, 0, 8) // Monday
    const wednesday = new Date(2024, 0, 10) // Wednesday
    const friday = new Date(2024, 0, 12) // Friday

    expect(isWeekend(monday)).toBe(false)
    expect(isWeekend(wednesday)).toBe(false)
    expect(isWeekend(friday)).toBe(false)
  })

  it('accepts ISO-like string input', () => {
    expect(isWeekend('2024-01-06T00:00:00')).toBe(true) // Saturday
    expect(isWeekend('2024-01-08T00:00:00')).toBe(false) // Monday
  })

  it('accepts timestamp (number) input', () => {
    // Take a Saturday in local time, use its timestamp
    const saturday = new Date(2024, 0, 6, 12, 0, 0)
    const ts = saturday.getTime()

    expect(isWeekend(ts)).toBe(true)
  })

  it('throws RangeError for invalid date-like input', () => {
    // toDateStrict is expected to throw for invalid values;
    // we verify that isWeekend surfaces the same error.
    expect(() =>
      isWeekend('not-a-real-date'),
    ).toThrow(RangeError)
  })
})

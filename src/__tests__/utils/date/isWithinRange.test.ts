import { isWithinRange } from '@/utils/date'

describe('isWithinRange', () => {
  it('returns true when date is strictly between start and end', () => {
    const start = new Date(2024, 0, 1) // Jan 1
    const mid = new Date(2024, 0, 10) // Jan 10
    const end = new Date(2024, 0, 31) // Jan 31

    expect(isWithinRange(mid, start, end)).toBe(true)
  })

  it('is inclusive of start and end boundaries', () => {
    const start = new Date(2024, 0, 1)
    const end = new Date(2024, 0, 31)

    expect(isWithinRange(start, start, end)).toBe(true)
    expect(isWithinRange(end, start, end)).toBe(true)
  })

  it('returns false when date is before the range', () => {
    const date = new Date(2023, 11, 31) // Dec 31, 2023
    const start = new Date(2024, 0, 1)
    const end = new Date(2024, 0, 31)

    expect(isWithinRange(date, start, end)).toBe(false)
  })

  it('returns false when date is after the range', () => {
    const date = new Date(2024, 1, 1) // Feb 1, 2024
    const start = new Date(2024, 0, 1)
    const end = new Date(2024, 0, 31)

    expect(isWithinRange(date, start, end)).toBe(false)
  })

  it('is order-insensitive for start and end', () => {
    const start = new Date(2024, 0, 1)
    const end = new Date(2024, 0, 31)
    const inside = new Date(2024, 0, 15)

    // start < end
    expect(isWithinRange(inside, start, end)).toBe(true)
    // start > end (swapped)
    expect(isWithinRange(inside, end, start)).toBe(true)
  })

  it('accepts string and number inputs along with Date', () => {
    const startStr = '2024-01-01T00:00:00'
    const endStr = '2024-01-31T23:59:59'
    const dateTs = new Date(2024, 0, 15, 12, 0, 0).getTime()

    expect(isWithinRange(dateTs, startStr, endStr)).toBe(true)
    expect(isWithinRange('2024-02-01T00:00:00', startStr, endStr)).toBe(
      false,
    )
  })

  it('throws RangeError when date is invalid', () => {
    expect(() =>
      isWithinRange('not-a-date', '2024-01-01', '2024-01-31'),
    ).toThrow(RangeError)
  })

  it('throws RangeError when start or end is invalid', () => {
    expect(() =>
      isWithinRange('2024-01-10', 'also-not-a-date', '2024-01-31'),
    ).toThrow(RangeError)

    expect(() =>
      isWithinRange('2024-01-10', '2024-01-01', 'still-not-a-date'),
    ).toThrow(RangeError)
  })
})

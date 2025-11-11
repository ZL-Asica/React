import { addDays, subDays } from '@/utils/date'

describe('addDays', () => {
  it('adds positive number of days to a Date instance', () => {
    const base = new Date(2024, 0, 10, 12, 30, 0) // Jan 10, 2024 12:30

    const result = addDays(base, 5)

    // No edit to original object
    expect(base.getDate()).toBe(10)

    expect(result.getFullYear()).toBe(2024)
    expect(result.getMonth()).toBe(0) // January
    expect(result.getDate()).toBe(15)
    // Keep time part consist
    expect(result.getHours()).toBe(12)
    expect(result.getMinutes()).toBe(30)
  })

  it('supports negative amount (backwards in time)', () => {
    const base = new Date(2024, 0, 10)

    const result = addDays(base, -3)

    expect(result.getFullYear()).toBe(2024)
    expect(result.getMonth()).toBe(0)
    expect(result.getDate()).toBe(7)
  })

  it('handles zero amount and returns a new instance', () => {
    const base = new Date(2024, 0, 10)
    const result = addDays(base, 0)

    // same timestamp
    expect(result.getTime()).toBe(base.getTime())
    // but different instance
    expect(result).not.toBe(base)
  })

  it('works with string input', () => {
    const result = addDays('2024-01-10T00:00:00', 2)
    expect(result.getFullYear()).toBe(2024)
    expect(result.getMonth()).toBe(0)
    expect(result.getDate()).toBe(12)
  })

  it('works with timestamp (number) input', () => {
    const base = new Date(2024, 0, 10, 8, 0, 0)
    const ts = base.getTime()

    const result = addDays(ts, 1)

    expect(result.getFullYear()).toBe(2024)
    expect(result.getMonth()).toBe(0)
    expect(result.getDate()).toBe(11)
    expect(result.getHours()).toBe(8)
  })

  it('throws RangeError when amount is not finite (NaN)', () => {
    const base = new Date(2024, 0, 10)
    expect(() => addDays(base, Number.NaN)).toThrow(RangeError)
    expect(() => addDays(base, Number.NaN)).toThrow(
      /"amount" must be a finite number/,
    )
  })

  it('throws RangeError when amount is not finite (Infinity)', () => {
    const base = new Date(2024, 0, 10)
    expect(() => addDays(base, Infinity)).toThrow(RangeError)
    expect(() => addDays(base, -Infinity)).toThrow(RangeError)
  })

  it('propagates RangeError from toDateStrict for invalid date input', () => {
    // Suppose toDateStrict throws RangeError for invalid dates, this test ensures addDays does not swallow the error
    expect(() => addDays('not-a-date', 1)).toThrow(RangeError)
  })

  it('handles month and year rollover correctly', () => {
    const base = new Date(2024, 0, 31) // Jan 31, 2024

    const plusOne = addDays(base, 1)
    expect(plusOne.getFullYear()).toBe(2024)
    expect(plusOne.getMonth()).toBe(1) // February
    expect(plusOne.getDate()).toBe(1)

    const plusThirtyFive = addDays(base, 35)
    // 2024-01-31 + 35d = 2024-03-06
    expect(plusThirtyFive.getFullYear()).toBe(2024)
    expect(plusThirtyFive.getMonth()).toBe(2) // March
    expect(plusThirtyFive.getDate()).toBe(6)
  })
})

describe('subDays', () => {
  it('subtracts days by delegating to addDays with negative amount', () => {
    const base = new Date(2024, 0, 10)

    const result = subDays(base, 3)

    expect(result.getFullYear()).toBe(2024)
    expect(result.getMonth()).toBe(0)
    expect(result.getDate()).toBe(7)
  })

  it('supports negative amount (equivalent to adding days)', () => {
    const base = new Date(2024, 0, 10)

    const result = subDays(base, -2) // Same as addDays(base, 2)

    expect(result.getFullYear()).toBe(2024)
    expect(result.getMonth()).toBe(0)
    expect(result.getDate()).toBe(12)
  })

  it('propagates RangeError for invalid date input (via addDays/toDateStrict)', () => {
    expect(() => subDays('not-a-date', 1)).toThrow(RangeError)
  })

  it('propagates RangeError for non-finite amount (via addDays)', () => {
    const base = new Date(2024, 0, 10)
    expect(() => subDays(base, Number.NaN)).toThrow(RangeError)
  })
})

import { endOfDay, startOfDay } from '@/utils/date'

describe('startOfDay', () => {
  it('returns local midnight for a Date instance without mutating the original', () => {
    const original = new Date(2024, 0, 10, 15, 30, 45, 123)

    const result = startOfDay(original)

    // original is unchanged
    expect(original.getHours()).toBe(15)
    expect(original.getMinutes()).toBe(30)
    expect(original.getSeconds()).toBe(45)
    expect(original.getMilliseconds()).toBe(123)

    // result is at 00:00:00.000 on the same calendar day
    expect(result.getFullYear()).toBe(original.getFullYear())
    expect(result.getMonth()).toBe(original.getMonth())
    expect(result.getDate()).toBe(original.getDate())
    expect(result.getHours()).toBe(0)
    expect(result.getMinutes()).toBe(0)
    expect(result.getSeconds()).toBe(0)
    expect(result.getMilliseconds()).toBe(0)
  })

  it('accepts string input via toDateStrict and normalizes to start of day', () => {
    const str = '2024-02-15T13:45:30'

    const base = new Date(str)
    const result = startOfDay(str)

    expect(result.getFullYear()).toBe(base.getFullYear())
    expect(result.getMonth()).toBe(base.getMonth())
    expect(result.getDate()).toBe(base.getDate())
    expect(result.getHours()).toBe(0)
    expect(result.getMinutes()).toBe(0)
    expect(result.getSeconds()).toBe(0)
    expect(result.getMilliseconds()).toBe(0)
  })

  it('accepts timestamp (number) input and normalizes to start of day', () => {
    const base = new Date(2024, 5, 20, 9, 10, 11, 222)
    const ts = base.getTime()

    const result = startOfDay(ts)

    expect(result.getFullYear()).toBe(base.getFullYear())
    expect(result.getMonth()).toBe(base.getMonth())
    expect(result.getDate()).toBe(base.getDate())
    expect(result.getHours()).toBe(0)
    expect(result.getMinutes()).toBe(0)
    expect(result.getSeconds()).toBe(0)
    expect(result.getMilliseconds()).toBe(0)
  })

  it('throws RangeError when input cannot be converted to a valid date', () => {
    expect(() =>
      startOfDay('not-a-date'),
    ).toThrow(RangeError)
  })
})

describe('endOfDay', () => {
  it('returns local end-of-day for a Date instance without mutating the original', () => {
    const original = new Date(2024, 0, 10, 5, 6, 7, 89)

    const result = endOfDay(original)

    // original is unchanged
    expect(original.getHours()).toBe(5)
    expect(original.getMinutes()).toBe(6)
    expect(original.getSeconds()).toBe(7)
    expect(original.getMilliseconds()).toBe(89)

    // result is at 23:59:59.999 on the same calendar day
    expect(result.getFullYear()).toBe(original.getFullYear())
    expect(result.getMonth()).toBe(original.getMonth())
    expect(result.getDate()).toBe(original.getDate())
    expect(result.getHours()).toBe(23)
    expect(result.getMinutes()).toBe(59)
    expect(result.getSeconds()).toBe(59)
    expect(result.getMilliseconds()).toBe(999)
  })

  it('accepts string input and normalizes to end of day', () => {
    const str = '2024-03-05T08:00:00'
    const base = new Date(str)

    const result = endOfDay(str)

    expect(result.getFullYear()).toBe(base.getFullYear())
    expect(result.getMonth()).toBe(base.getMonth())
    expect(result.getDate()).toBe(base.getDate())
    expect(result.getHours()).toBe(23)
    expect(result.getMinutes()).toBe(59)
    expect(result.getSeconds()).toBe(59)
    expect(result.getMilliseconds()).toBe(999)
  })

  it('accepts timestamp (number) input and normalizes to end of day', () => {
    const base = new Date(2024, 7, 1, 12, 0, 0, 0)
    const ts = base.getTime()

    const result = endOfDay(ts)

    expect(result.getFullYear()).toBe(base.getFullYear())
    expect(result.getMonth()).toBe(base.getMonth())
    expect(result.getDate()).toBe(base.getDate())
    expect(result.getHours()).toBe(23)
    expect(result.getMinutes()).toBe(59)
    expect(result.getSeconds()).toBe(59)
    expect(result.getMilliseconds()).toBe(999)
  })

  it('throws RangeError when input cannot be converted to a valid date', () => {
    expect(() =>
      endOfDay('totally-not-a-date'),
    ).toThrow(RangeError)
  })

  it('produces a time after startOfDay on the same date', () => {
    const d = new Date(2024, 0, 10, 12, 0, 0, 0)

    const start = startOfDay(d)
    const end = endOfDay(d)

    expect(end.getTime()).toBeGreaterThan(start.getTime())
    // Difference should be close to 24h - 1ms
    expect(end.getTime() - start.getTime()).toBe(24 * 60 * 60 * 1000 - 1)
  })
})

import { differenceInCalendarDays } from '@/utils/date'

describe('differenceInCalendarDays', () => {
  it('returns 0 when both dates are on the same calendar day (UTC)', () => {
    // Same UTC day, different times
    const left = new Date(Date.UTC(2024, 0, 10, 0, 0, 0)) // 2024-01-10T00:00:00Z
    const right = new Date(Date.UTC(2024, 0, 10, 23, 59, 59)) // same day, later time

    const diff = differenceInCalendarDays(left, right)
    expect(diff).toBe(0)
  })

  it('returns a positive number when dateRight is after dateLeft', () => {
    const left = new Date(Date.UTC(2024, 0, 10)) // Jan 10, 2024
    const right = new Date(Date.UTC(2024, 0, 13)) // Jan 13, 2024

    const diff = differenceInCalendarDays(left, right)
    expect(diff).toBe(3)
  })

  it('returns a negative number when dateRight is before dateLeft', () => {
    const left = new Date(Date.UTC(2024, 0, 10)) // Jan 10, 2024
    const right = new Date(Date.UTC(2024, 0, 8)) // Jan 8, 2024

    const diff = differenceInCalendarDays(left, right)
    expect(diff).toBe(-2)
  })

  it('works with string inputs', () => {
    const diff = differenceInCalendarDays('2024-01-01', '2024-01-05')
    expect(diff).toBe(4)
  })

  it('works with timestamp (number) inputs', () => {
    const leftDate = new Date(Date.UTC(2024, 0, 1, 12, 0, 0))
    const rightDate = new Date(Date.UTC(2024, 0, 4, 6, 0, 0))

    const leftTs = leftDate.getTime()
    const rightTs = rightDate.getTime()

    const diff = differenceInCalendarDays(leftTs, rightTs)
    expect(diff).toBe(3)
  })

  it('is robust around DST transitions by using UTC midnights', () => {
    // Example around a DST change (date values in local, but we only look at UTC day)
    const beforeDst = new Date(2024, 2, 9, 12, 0, 0) // Mar 9, 2024
    const afterDst = new Date(2024, 2, 10, 12, 0, 0) // Mar 10, 2024

    const diff = differenceInCalendarDays(beforeDst, afterDst)
    expect(diff).toBe(1)
  })

  it('throws RangeError when dateLeft is invalid', () => {
    // toDateStrict is expected to throw for invalid date-like input
    expect(() =>
      differenceInCalendarDays('not-a-date', '2024-01-01'),
    ).toThrow(RangeError)
  })

  it('throws RangeError when dateRight is invalid', () => {
    expect(() =>
      differenceInCalendarDays('2024-01-01', 'also-not-a-date'),
    ).toThrow(RangeError)
  })
})

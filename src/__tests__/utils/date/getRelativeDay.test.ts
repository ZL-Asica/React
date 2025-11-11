import { getRelativeDay } from '@/utils/date/getRelativeDay'

describe('getRelativeDay', () => {
  // 2024-01-10T00:00:00.000Z (Wednesday)
  const baseUtc = Date.UTC(2024, 0, 10)
  const baseDate = new Date(baseUtc)

  const dayMs = 24 * 60 * 60 * 1000

  it('returns empty string for null/undefined', () => {
    expect(getRelativeDay(undefined)).toBe('')
    expect(getRelativeDay(null)).toBe('')
  })

  it('returns empty string for invalid dates', () => {
    expect(
      getRelativeDay('not-a-date', { now: baseDate }),
    ).toBe('')
  })

  it('returns "Today", "Yesterday", "Tomorrow"', () => {
    expect(getRelativeDay(baseDate, { now: baseDate })).toBe('Today')

    expect(
      getRelativeDay(new Date(baseUtc - dayMs), { now: baseDate }),
    ).toBe('Yesterday')

    expect(
      getRelativeDay(new Date(baseUtc + dayMs), { now: baseDate }),
    ).toBe('Tomorrow')
  })

  it('handles Date, string and number inputs', () => {
    const target = new Date(baseUtc - 3 * dayMs) // Sunday 2024-01-07

    // Date
    expect(getRelativeDay(target, { now: baseDate })).toBe('Last Sunday')

    // ISO string
    expect(
      getRelativeDay(target.toISOString(), { now: baseDate }),
    ).toBe('Last Sunday')

    // timestamp number
    expect(getRelativeDay(target.getTime(), { now: baseDate })).toBe(
      'Last Sunday',
    )
  })

  it('returns "Last <weekday>" for past dates within the previous week', () => {
    // base: Wed 10th, target: Mon 8th (2 days ago) -> same week, past
    const target = new Date(baseUtc - 2 * dayMs) // Monday
    expect(getRelativeDay(target, { now: baseDate })).toBe('Last Monday')
  })

  it('returns "Next <weekday>" for future dates within the same week', () => {
    // base: Wed 10th, target: Fri 12th (2 days later) -> same week, future
    const target = new Date(baseUtc + 2 * dayMs) // Friday
    expect(getRelativeDay(target, { now: baseDate })).toBe('Next Friday')
  })

  it('returns "<N> weeks ago <weekday>" for past dates more than one week away', () => {
    // 2 weeks ago: 14 days before 2024-01-10 -> 2023-12-27 (Wednesday)
    const target = new Date(baseUtc - 14 * dayMs)
    const result = getRelativeDay(target, { now: baseDate })

    expect(result).toBe('2 weeks ago Wednesday')
  })

  it('returns "In <N> weeks <weekday>" for future dates more than one week away', () => {
    // 3 weeks later: 21 days after 2024-01-10 -> 2024-01-31 (Wednesday)
    const target = new Date(baseUtc + 21 * dayMs)
    const result = getRelativeDay(target, { now: baseDate })

    expect(result).toBe('In 3 weeks Wednesday')
  })

  it('uses the numeric "now" timestamp when provided', () => {
    const nowTs = baseUtc
    const target = new Date(baseUtc + 7 * dayMs) // exactly 1 week later (Wednesday)

    const result = getRelativeDay(target, { now: nowTs })

    expect(result).toBe('In 1 week Wednesday')
  })

  it('supports custom weekday labels', () => {
    const customWeekdays = [
      'Su',
      'Mo',
      'Tu',
      'We',
      'Th',
      'Fr',
      'Sa',
    ] as const

    const target = new Date(baseUtc + 2 * dayMs) // Friday -> "Fr"
    const result = getRelativeDay(target, {
      now: baseDate,
      weekdays: [...customWeekdays],
    })

    expect(result).toBe('Next Fr')
  })

  it('falls back to default weekdays when custom labels are invalid', () => {
    const target = new Date(baseUtc + 2 * dayMs) // Friday

    const result = getRelativeDay(target, {
      now: baseDate,
      // @ts-expect-error: deliberately invalid weekdays array length
      weekdays: ['Only', 'one', 'value'],
    })

    expect(result).toBe('Next Friday')
  })

  it('returns empty string when target cannot be normalized to Date (non Date/string/number)', () => {
    // Intentionally non Date/string/number value to bypass TS type checking
    const weirdValue = { foo: 'bar' }

    // @ts-expect-error: deliberately invalid input type
    const result = getRelativeDay(weirdValue, { now: baseDate })

    // __INTERNAL__normalizeDate will be the final `return null`
    // Then getRelativeDay sees target === null -> returns ''
    expect(result).toBe('')
  })

  it('uses numeric timestamp for "now"', () => {
    const nowTs = baseUtc // number, not Date
    const target = new Date(baseUtc + dayMs) // +1 day -> Tomorrow

    const result = getRelativeDay(target, { now: nowTs })

    expect(result).toBe('Tomorrow')
  })

  it('falls back to default weekday when custom weekdays entry is missing', () => {
    const weekdays = [
      'Su',
      'Mo',
      'Tu',
      undefined as unknown as string, // index 3 (Wednesday) intentionally missing
      'Th',
      'Fr',
      'Sa',
    ] as [string, string, string, string, string, string, string]

    // baseDate: 2024-01-10 (Wednesday)
    // +7 days: 2024-01-17 (Wednesday) -> weekdayIndex 3
    const target = new Date(baseUtc + 7 * dayMs)

    const result = getRelativeDay(target, { now: baseDate, weekdays })

    // weeksDifference = 1, isPast = false -> "In 1 week <weekdayLabel>"
    // weekdayLabel falls back to default "Wednesday"
    expect(result).toBe('In 1 week Wednesday')
  })

  it('uses numeric timestamp as "now" branch (typeof now === "number")', () => {
    const nowTs = baseUtc // number
    const targetTs = baseUtc + dayMs // +1 day -> Tomorrow

    const result = getRelativeDay(targetTs, { now: nowTs })

    // Difference of one day -> "Tomorrow"
    expect(result).toBe('Tomorrow')
  })
})

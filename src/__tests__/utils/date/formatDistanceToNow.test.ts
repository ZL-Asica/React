import { formatDistanceToNow } from '@/utils/date/formatDistanceToNow'

describe('formatDistanceToNow', () => {
  const base = new Date('2024-01-01T00:00:00.000Z').getTime()

  it('returns "just now" for very small differences', () => {
    expect(formatDistanceToNow(base, { now: base })).toBe('just now')
    expect(
      formatDistanceToNow(base + 4000, { now: base }),
    ).toBe('just now')
    expect(
      formatDistanceToNow(base - 4000, { now: base }),
    ).toBe('just now')
  })

  it('formats seconds with suffix', () => {
    expect(
      formatDistanceToNow(base + 10_000, { now: base }),
    ).toBe('in 10 seconds')

    expect(
      formatDistanceToNow(base - 25_000, { now: base }),
    ).toBe('25 seconds ago')
  })

  it('formats minutes with suffix', () => {
    expect(
      formatDistanceToNow(base + 60_000, { now: base }),
    ).toBe('in 1 minute')

    expect(
      formatDistanceToNow(base - 2 * 60_000, { now: base }),
    ).toBe('2 minutes ago')
  })

  it('formats hours with suffix', () => {
    expect(
      formatDistanceToNow(base + 2 * 60 * 60_000, { now: base }),
    ).toBe('in 2 hours')

    expect(
      formatDistanceToNow(base - 3 * 60 * 60_000, { now: base }),
    ).toBe('3 hours ago')
  })

  it('formats days with suffix', () => {
    expect(
      formatDistanceToNow(base + 24 * 60 * 60_000, { now: base }),
    ).toBe('in 1 day')

    expect(
      formatDistanceToNow(base - 10 * 24 * 60 * 60_000, { now: base }),
    ).toBe('10 days ago')
  })

  it('formats months with suffix (approximate)', () => {
    // ~60 days → 2 months
    expect(
      formatDistanceToNow(base + 60 * 24 * 60 * 60_000, { now: base }),
    ).toBe('in 2 months')

    expect(
      formatDistanceToNow(base - 90 * 24 * 60 * 60_000, { now: base }),
    ).toBe('3 months ago')
  })

  it('formats years with suffix (approximate)', () => {
    // ~365 days → 1 year
    expect(
      formatDistanceToNow(base + 365 * 24 * 60 * 60_000, { now: base }),
    ).toBe('in 1 year')

    // ~2 years
    expect(
      formatDistanceToNow(base - 2 * 365 * 24 * 60 * 60_000, { now: base }),
    ).toBe('2 years ago')
  })

  it('supports disabling the suffix', () => {
    expect(
      formatDistanceToNow(base + 5 * 60_000, {
        now: base,
        addSuffix: false,
      }),
    ).toBe('5 minutes')

    expect(
      formatDistanceToNow(base - 2 * 24 * 60 * 60_000, {
        now: base,
        addSuffix: false,
      }),
    ).toBe('2 days')
  })

  it('throws for invalid dates', () => {
    // @ts-expect-error: deliberate invalid value
    expect(() => formatDistanceToNow('not-a-date')).toThrow(
      /Invalid Date or timestamp/,
    )
  })

  it('accepts a Date instance as the "now" option', () => {
    const now = new Date(base)
    // 1 minute later
    const result = formatDistanceToNow(base + 60_000, { now })

    expect(result).toBe('in 1 minute')
  })

  it('accepts a Date instance as input', () => {
    const input = new Date(base + 2 * 60_000)
    const result = formatDistanceToNow(input, { now: base })

    expect(result).toBe('in 2 minutes')
  })
})

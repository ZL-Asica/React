import { formatDuration } from '@/utils/date'

describe('formatDuration', () => {
  describe('basic formatting', () => {
    it('formats a positive duration with default options (milliseconds input)', () => {
      // 90_000 ms = 1 minute 30 seconds
      const result = formatDuration(90_000)
      expect(result).toBe('1 minute 30 seconds')
    })

    it('formats using "seconds" as inputUnit', () => {
      // 5_000 seconds = 1h 23m 20s
      const result = formatDuration(5_000, { inputUnit: 'seconds' })
      expect(result).toBe('1 hour 23 minutes 20 seconds')
    })

    it('supports millisecond as min/max unit', () => {
      const result = formatDuration(1_234, {
        minUnit: 'millisecond',
        maxUnit: 'millisecond',
      })

      expect(result).toBe('1234 milliseconds')
    })

    it('uses a custom separator between parts', () => {
      const result = formatDuration(90_000, { separator: ', ' })
      expect(result).toBe('1 minute, 30 seconds')
    })

    it('returns "0 seconds" for exact zero with defaults', () => {
      const result = formatDuration(0)
      expect(result).toBe('0 seconds')
    })
  })

  describe('minUnit, maxUnit and truncation', () => {
    it('drops smaller units below minUnit and falls back to "0 <minUnit>" when everything is truncated', () => {
      // 30_000 ms = 0.5 minute
      // With minUnit='minute' and includeZeroUnits=false,
      // all computed units (day/hour/minute) are zero and skipped.
      const result = formatDuration(30_000, { minUnit: 'minute' })

      // Fallback branch: parts.length === 0 -> "0 minutes"
      expect(result).toBe('0 minutes')
    })

    it('can show zero-valued units when includeZeroUnits=true', () => {
      // 60_000 ms = 1 minute
      // minUnit='hour', maxUnit='minute' -> iterate hour, minute
      const result = formatDuration(60_000, {
        minUnit: 'hour',
        maxUnit: 'minute',
        includeZeroUnits: true,
      })

      // "0 hours 1 minute"
      expect(result).toBe('0 hours 1 minute')
    })

    it('handles minUnit and maxUnit in reverse order', () => {
      // 25 hours = 1 day 1 hour
      const value = 25 * 60 * 60 * 1000

      // minUnit is "bigger" than maxUnit in UNIT_ORDER, should still work
      const result = formatDuration(value, {
        minUnit: 'hour',
        maxUnit: 'day',
      })

      expect(result).toBe('1 day 1 hour')
    })

    it('can restrict the maximum unit to hour', () => {
      // 1 day = 24 hours, but maxUnit='hour' means it gets expressed in hours
      const value = 24 * 60 * 60 * 1000
      const result = formatDuration(value, {
        maxUnit: 'hour',
      })

      expect(result).toBe('24 hours')
    })
  })

  describe('largestUnitOnly', () => {
    it('returns only the largest non-zero unit when largestUnitOnly=true', () => {
      // 90_000 ms = 1 minute 30 seconds
      const result = formatDuration(90_000, { largestUnitOnly: true })

      expect(result).toBe('1 minute')
    })

    it('still returns a zero value when everything is truncated and largestUnitOnly=true', () => {
      // 30_000 ms = 0.5 minute, minUnit='minute' truncates to zero
      const result = formatDuration(30_000, {
        minUnit: 'minute',
        largestUnitOnly: true,
      })

      // Fallback: "0 minutes"
      expect(result).toBe('0 minutes')
    })
  })

  describe('signDisplay handling', () => {
    it('uses "-" for negative durations in auto mode (default)', () => {
      const result = formatDuration(-1_000)
      expect(result).toBe('-1 second')
    })

    it('omits sign for positive durations in auto mode', () => {
      const result = formatDuration(1_000)
      expect(result).toBe('1 second')
    })

    it('shows "+" for positive durations when signDisplay="always"', () => {
      const result = formatDuration(2_000, { signDisplay: 'always' })
      expect(result).toBe('+2 seconds')
    })

    it('shows "-" for negative durations when signDisplay="always"', () => {
      const result = formatDuration(-2_000, { signDisplay: 'always' })
      expect(result).toBe('-2 seconds')
    })

    it('never shows a sign when signDisplay="never"', () => {
      const positive = formatDuration(1_000, { signDisplay: 'never' })
      const negative = formatDuration(-1_000, { signDisplay: 'never' })

      expect(positive).toBe('1 second')
      expect(negative).toBe('1 second')
    })
  })

  describe('labels and formatUnit overrides', () => {
    it('uses default English labels when no overrides are provided', () => {
      const result = formatDuration(3_600_000) // 1 hour
      expect(result).toBe('1 hour')
    })

    it('uses custom singular and plural labels for specific units', () => {
      const result = formatDuration(90_000, {
        labels: {
          minute: 'min',
          minutePlural: 'min',
          second: 's',
          secondPlural: 's',
        },
      })

      expect(result).toBe('1 min 30 s')
    })

    it('falls back to singular label when plural label is missing', () => {
      const result = formatDuration(120_000, {
        // Force plural to be missing at runtime
        labels: {
          minutePlural: undefined,
          minute: 'min',
        },
      })

      // 120_000 ms = 2 minutes -> should use singular 'min' for plural as well
      expect(result).toBe('2 min')
    })

    it('uses formatUnit when provided, ignoring text labels', () => {
      const result = formatDuration(90_000, {
        labels: {
          // intentionally "wrong" labels to ensure they are ignored
          minute: 'WRONG',
          minutePlural: 'WRONG',
          second: 'WRONG',
          secondPlural: 'WRONG',
        },
        formatUnit: (unit, value) => {
          const shortMap: Partial<Record<typeof unit, string>> = {
            hour: 'h',
            minute: 'm',
            second: 's',
          }
          const suffix = shortMap[unit] ?? unit[0]
          return `${value}${suffix}`
        },
      })

      // 90_000 ms = 1m 30s; labels must be ignored in favor of formatUnit
      expect(result).toBe('1m 30s')
    })
  })

  describe('error handling', () => {
    it('throws RangeError when duration is not a finite number', () => {
      // NaN
      expect(() =>
        formatDuration(Number.NaN),
      ).toThrow(RangeError)

      // Infinity
      expect(() =>
        formatDuration(Number.POSITIVE_INFINITY),
      ).toThrow(RangeError)

      // Non-number
      expect(() =>
        // @ts-expect-error: deliberately invalid value
        formatDuration('1234'),
      ).toThrow(RangeError)
    })
  })

  describe('fallback to raw unit name when labels are missing', () => {
    it('uses the unit name when both singular and plural labels are missing for plural values', () => {
      const result = formatDuration(2 * 60 * 60 * 1000, {
        labels: {
          hour: undefined,
          hourPlural: undefined,
        },
      })

      // mergedLabels.hour === undefined
      // mergedLabels.hourPlural === undefined
      // => label = pluralKey ?? singularKey ?? unit = 'hour'
      expect(result).toBe('2 hour')
    })

    it('uses the unit name when singular label is missing for singular values', () => {
      const result = formatDuration(60 * 60 * 1000, {
        labels: {
          hour: undefined,
        },
      })

      // value === 1 -> singular branch:
      // label = mergedLabels[singularKey] ?? unit
      // => 'hour'
      expect(result).toBe('1 hour')
    })
  })
})

import { formatDate } from '@/utils/date/formatDate'

describe('formatDate', () => {
  describe('basic tokens with Date input', () => {
    it('formats all supported tokens correctly', () => {
      // 2024-02-09 05:06:07 (local time, no timezone specified)
      const d = new Date(2024, 1, 9, 5, 6, 7)

      const YYYY = String(d.getFullYear())
      const YY = String(d.getFullYear()).slice(-2)
      const MM = String(d.getMonth() + 1).padStart(2, '0')
      const DD = String(d.getDate()).padStart(2, '0')
      const HH = String(d.getHours()).padStart(2, '0')
      const mm = String(d.getMinutes()).padStart(2, '0')
      const ss = String(d.getSeconds()).padStart(2, '0')

      const MONTHS_SHORT = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ] as const
      const MMM = MONTHS_SHORT[d.getMonth()]

      expect(formatDate(d, 'YYYY-MM-DD')).toBe(`${YYYY}-${MM}-${DD}`)
      expect(formatDate(d, 'YY/MM/DD')).toBe(`${YY}/${MM}/${DD}`)
      expect(formatDate(d, 'HH:mm:ss')).toBe(`${HH}:${mm}:${ss}`)
      expect(formatDate(d, 'MMM DD, YYYY')).toBe(`${MMM} ${DD}, ${YYYY}`)
      expect(formatDate(d, 'YYYY-MM-DD HH:mm:ss')).toBe(
        `${YYYY}-${MM}-${DD} ${HH}:${mm}:${ss}`,
      )
    })

    it('replaces tokens even inside literal brackets', () => {
      const d = new Date(2024, 0, 1, 0, 0, 0)
      const year = String(d.getFullYear())

      const result = formatDate(d, '[YYYY] YYYY')

      // Both YYYY tokens should be replaced with the year
      expect(result).toBe(`[${year}] ${year}`)
    })
  })

  describe('current date fallback (normalizeToDate null/undefined branch)', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('uses current time when input is undefined or null', () => {
      const fixed = new Date(2024, 0, 2, 3, 4, 5) // local 2024-01-02 03:04:05
      vi.setSystemTime(fixed)

      const pad = (n: number) => String(n).padStart(2, '0')

      const now = new Date()
      const YYYY = String(now.getFullYear())
      const MM = pad(now.getMonth() + 1)
      const DD = pad(now.getDate())
      const HH = pad(now.getHours())
      const mm = pad(now.getMinutes())
      const ss = pad(now.getSeconds())

      const fmt = 'YYYY-MM-DD HH:mm:ss'
      const expected = `${YYYY}-${MM}-${DD} ${HH}:${mm}:${ss}`

      expect(formatDate(undefined, fmt)).toBe(expected)
      expect(formatDate(null, fmt)).toBe(expected)
    })
  })

  describe('string input (normalizeToDate string branch)', () => {
    it('formats valid ISO-like string', () => {
      const str = '2024-02-09T05:06:07'
      const d = new Date(str)

      const YYYY = String(d.getFullYear())
      const MM = String(d.getMonth() + 1).padStart(2, '0')
      const DD = String(d.getDate()).padStart(2, '0')
      const HH = String(d.getHours()).padStart(2, '0')
      const mm = String(d.getMinutes()).padStart(2, '0')
      const ss = String(d.getSeconds()).padStart(2, '0')

      const result = formatDate(str, 'YYYY-MM-DD HH:mm:ss')
      expect(result).toBe(`${YYYY}-${MM}-${DD} ${HH}:${mm}:${ss}`)
    })

    it('returns empty string for invalid string', () => {
      expect(formatDate('not-a-date', 'YYYY-MM-DD')).toBe('')
    })
  })

  describe('number input (normalizeToDate number branch)', () => {
    it('formats valid timestamp number', () => {
      const d = new Date(2024, 1, 9, 5, 6, 7)
      const ts = d.getTime()

      const YYYY = String(d.getFullYear())
      const MM = String(d.getMonth() + 1).padStart(2, '0')
      const DD = String(d.getDate()).padStart(2, '0')
      const HH = String(d.getHours()).padStart(2, '0')
      const mm = String(d.getMinutes()).padStart(2, '0')
      const ss = String(d.getSeconds()).padStart(2, '0')

      const result = formatDate(ts, 'YYYY-MM-DD HH:mm:ss')
      expect(result).toBe(`${YYYY}-${MM}-${DD} ${HH}:${mm}:${ss}`)
    })

    it('returns empty string for invalid number', () => {
      expect(formatDate(Number.NaN, 'YYYY-MM-DD')).toBe('')
    })
  })

  describe('mMM fallback for out-of-range month index', () => {
    it('falls back to empty string when month index is out of range', () => {
      const spy = vi
        .spyOn(Date.prototype, 'getMonth')
        .mockReturnValue(12)

      try {
        const d = new Date(2024, 0, 1)

        const result = formatDate(d, 'MMM')

        // MONTHS_SHORT[12] === undefined -> trigger `?? ''` fallback branch
        expect(result).toBe('')
      }
      finally {
        spy.mockRestore()
      }
    })
  })

  describe('date instance branch in normalizeToDate', () => {
    it('clones a valid Date and uses it', () => {
      const original = new Date(2024, 3, 5, 6, 7, 8)
      const result = formatDate(original, 'YYYY-MM-DD HH:mm:ss')

      const YYYY = String(original.getFullYear())
      const MM = String(original.getMonth() + 1).padStart(2, '0')
      const DD = String(original.getDate()).padStart(2, '0')
      const HH = String(original.getHours()).padStart(2, '0')
      const mm = String(original.getMinutes()).padStart(2, '0')
      const ss = String(original.getSeconds()).padStart(2, '0')

      expect(result).toBe(`${YYYY}-${MM}-${DD} ${HH}:${mm}:${ss}`)
    })

    it('returns empty string for invalid Date instance', () => {
      const invalid = new Date(Number.NaN)
      expect(formatDate(invalid, 'YYYY-MM-DD')).toBe('')
    })
  })

  describe('unsupported input type (final normalizeToDate return null)', () => {
    it('returns empty string for non Date/string/number inputs', () => {
      const weird = { foo: 'bar' }
      // @ts-expect-error: deliberately invalid input type
      expect(formatDate(weird, 'YYYY-MM-DD')).toBe('')
    })
  })
})

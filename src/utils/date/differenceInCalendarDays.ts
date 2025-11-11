import { toDateStrict } from './utils'

/**
 * Get the difference in **calendar days** between two date-like values.
 *
 * The result is computed using **UTC midnight** for both dates, so it is
 * not affected by time-of-day or daylight saving transitions.
 *
 * - Returns a **positive** number when `dateRight` is after `dateLeft`.
 * - Returns a **negative** number when `dateRight` is before `dateLeft`.
 * - Returns `0` when both fall on the same calendar day (in UTC).
 *
 * @param {Date | string | number} dateLeft
 *   The "left" date (start of comparison). Accepts:
 *   - `Date` instance
 *   - ISO-like string
 *   - timestamp in milliseconds
 *
 * @param {Date | string | number} dateRight
 *   The "right" date (end of comparison). Same accepted formats as `dateLeft`.
 *
 * @returns {number}
 *   Signed difference in calendar days: `dateRight - dateLeft` (in UTC days).
 *
 * @throws {RangeError}
 *   When either input cannot be converted to a valid `Date`
 *   (as determined by {@link toDateStrict}).
 *
 * @example
 * ```ts
 * differenceInCalendarDays('2024-01-10', '2024-01-11') // 1
 * differenceInCalendarDays('2024-01-11', '2024-01-10') // -1
 * differenceInCalendarDays('2024-01-10T00:00:00Z', '2024-01-10T23:59:59Z') // 0
 * ```
 *
 * @example
 * ```ts
 * // Works with timestamps as well:
 * const left = new Date('2024-01-01T12:00:00Z').getTime()
 * const right = new Date('2024-01-05T06:00:00Z').getTime()
 *
 * differenceInCalendarDays(left, right) // 4
 * ```
 */
export const differenceInCalendarDays = (
  dateLeft: Date | string | number,
  dateRight: Date | string | number,
): number => {
  const left = toDateStrict(dateLeft)
  const right = toDateStrict(dateRight)

  const leftMidnight = Date.UTC(
    left.getUTCFullYear(),
    left.getUTCMonth(),
    left.getUTCDate(),
  )

  const rightMidnight = Date.UTC(
    right.getUTCFullYear(),
    right.getUTCMonth(),
    right.getUTCDate(),
  )

  const diffMs = rightMidnight - leftMidnight
  return Math.round(diffMs / (1000 * 60 * 60 * 24))
}

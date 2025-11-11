import { toDateStrict } from './utils'

/**
 * Check whether a given date falls within a **closed** date range
 * `[start, end]` (inclusive on both ends).
 *
 * The function:
 * - Accepts `Date`, ISO-like `string`, or timestamp `number` for all inputs.
 * - Converts them via {@link toDateStrict}.
 * - Compares their underlying timestamps (milliseconds since epoch).
 * - Is **order-insensitive**: if `start` is after `end`, it will swap them.
 *
 * @param {Date | string | number} date
 *   The date to test.
 *
 * @param {Date | string | number} start
 *   Start of the range (inclusive). Can be before or after `end`.
 *
 * @param {Date | string | number} end
 *   End of the range (inclusive). Can be before or after `start`.
 *
 * @returns {boolean}
 *   `true` if `date` falls between `start` and `end` (including both),
 *   otherwise `false`.
 *
 * @throws {RangeError}
 *   When any of the inputs cannot be converted into a valid `Date`
 *   (as determined by {@link toDateStrict}).
 *
 * @example
 * ```ts
 * isWithinRange('2024-01-10', '2024-01-01', '2024-01-31') // true
 * isWithinRange('2024-02-01', '2024-01-01', '2024-01-31') // false
 * ```
 *
 * @example
 * ```ts
 * // Order of start/end does not matter:
 * isWithinRange('2024-01-10', '2024-01-31', '2024-01-01') // true
 * ```
 */
export const isWithinRange = (
  date: Date | string | number,
  start: Date | string | number,
  end: Date | string | number,
): boolean => {
  const d = toDateStrict(date).getTime()
  const s = toDateStrict(start).getTime()
  const e = toDateStrict(end).getTime()

  const min = Math.min(s, e)
  const max = Math.max(s, e)

  return d >= min && d <= max
}

import { toDateStrict } from './utils'

/**
 * Check whether a given date falls on a weekend (Saturday or Sunday).
 *
 * This helper:
 * - Accepts `Date`, ISO-like `string`, or timestamp `number`.
 * - Uses the local calendar day (via `Date#getDay()`).
 * - Delegates parsing and validation to {@link toDateStrict}.
 *
 * @param {Date | string | number} input
 *   Date-like value to check. Can be:
 *   - a `Date` instance
 *   - a parsable date `string`
 *   - a timestamp `number` (milliseconds since Unix epoch)
 *
 * @returns {boolean}
 *   `true` if the local day is Saturday (`6`) or Sunday (`0`),
 *   otherwise `false`.
 *
 * @throws {RangeError}
 *   When the input cannot be converted into a valid `Date`
 *   (as determined by {@link toDateStrict}).
 *
 * @example
 * ```ts
 * isWeekend(new Date(2024, 0, 6))   // Saturday → true
 * isWeekend(new Date(2024, 0, 7))   // Sunday → true
 * isWeekend(new Date(2024, 0, 8))   // Monday → false
 * ```
 *
 * @example
 * ```ts
 * isWeekend('2024-01-06')          // true
 * isWeekend(1704508800000)        // depends on the timestamp day
 * ```
 */
export const isWeekend = (input: Date | string | number): boolean => {
  const date = toDateStrict(input)
  const day = date.getDay() // 0–6, Sunday–Saturday
  return day === 0 || day === 6
}

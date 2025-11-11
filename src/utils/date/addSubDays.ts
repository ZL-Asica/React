import { toDateStrict } from './utils'

/**
 * Add a number of **calendar days** to a date-like value.
 *
 * This helper:
 * - Accepts `Date`, ISO-like `string`, or timestamp `number`.
 * - Works in **local time** and respects month/year rollover.
 * - Never mutates the input; it always returns a **new** `Date` instance.
 *
 * @param {Date | string | number} input
 *   Base date (local time).
 *
 * @param {number} amount
 *   Number of calendar days to add. Can be negative.
 *   Must be a finite number, otherwise a {@link RangeError} is thrown.
 *
 * @returns {Date}
 *   A new `Date` instance representing `input + amount` days.
 *
 * @throws {RangeError}
 *   - When `input` cannot be converted into a valid `Date`
 *     (as determined by {@link toDateStrict}).
 *   - When `amount` is not a finite number.
 *
 * @example
 * ```ts
 * const d = new Date(2024, 0, 10); // Jan 10, 2024
 *
 * addDays(d, 5);   // Jan 15, 2024
 * addDays(d, -1);  // Jan 9, 2024
 * ```
 */
export const addDays = (
  input: Date | string | number,
  amount: number,
): Date => {
  const date = toDateStrict(input)

  if (!Number.isFinite(amount)) {
    throw new RangeError('addDays: "amount" must be a finite number')
  }

  const result = new Date(date.getTime())
  result.setDate(result.getDate() + amount)
  return result
}

/**
 * Subtract a number of **calendar days** from a date-like value.
 *
 * This is a small convenience wrapper around {@link addDays}, implemented as:
 *
 * ```ts
 * subDays(input, amount) === addDays(input, -amount)
 * ```
 *
 * @param {Date | string | number} input
 *   Base date (local time).
 *
 * @param {number} amount
 *   Number of days to subtract. Can be negative.
 *
 * @returns {Date}
 *   A new `Date` instance representing `input - amount` days.
 *
 * @throws {RangeError}
 *   - When `input` cannot be converted into a valid `Date`
 *     (as determined by {@link toDateStrict}).
 *   - When `amount` is not a finite number.
 *
 * @example
 * ```ts
 * const d = new Date(2024, 0, 10); // Jan 10, 2024
 *
 * subDays(d, 3);   // Jan 7, 2024
 * subDays(d, -2);  // Jan 12, 2024 (equivalent to addDays(d, 2))
 * ```
 */
export const subDays = (
  input: Date | string | number,
  amount: number,
): Date => {
  return addDays(input, -amount)
}

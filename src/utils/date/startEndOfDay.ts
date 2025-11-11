import { toDateStrict } from './utils'

/**
 * Get the **start of the day** (local time) for a given date-like value.
 *
 * This helper:
 * - Accepts `Date`, ISO-like `string`, or timestamp `number`.
 * - Converts the value via {@link toDateStrict}.
 * - Returns a **new** `Date` instance set to `00:00:00.000` local time.
 * - Never mutates the input `Date`.
 *
 * @param {Date | string | number} input
 *   Date-like value representing the day you want to normalize.
 *
 * @returns {Date}
 *   A new `Date` object at local midnight (`00:00:00.000`) of that day.
 *
 * @throws {RangeError}
 *   When `input` cannot be converted into a valid `Date`
 *   (as determined by {@link toDateStrict}).
 *
 * @example
 * ```ts
 * const d = new Date(2024, 0, 10, 15, 30, 45, 123); // 2024-01-10 15:30:45.123
 * const start = startOfDay(d);
 * // start -> 2024-01-10 00:00:00.000 (local time)
 * ```
 */
export const startOfDay = (input: Date | string | number): Date => {
  const date = toDateStrict(input)
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    0,
    0,
    0,
    0,
  )
}

/**
 * Get the **end of the day** (local time) for a given date-like value.
 *
 * This helper:
 * - Accepts `Date`, ISO-like `string`, or timestamp `number`.
 * - Converts the value via {@link toDateStrict}.
 * - Returns a **new** `Date` instance set to `23:59:59.999` local time.
 * - Never mutates the input `Date`.
 *
 * @param {Date | string | number} input
 *   Date-like value representing the day you want to normalize.
 *
 * @returns {Date}
 *   A new `Date` object at local end-of-day (`23:59:59.999`) of that day.
 *
 * @throws {RangeError}
 *   When `input` cannot be converted into a valid `Date`
 *   (as determined by {@link toDateStrict}).
 *
 * @example
 * ```ts
 * const d = new Date(2024, 0, 10, 5, 0, 0); // 2024-01-10 05:00:00
 * const end = endOfDay(d);
 * // end -> 2024-01-10 23:59:59.999 (local time)
 * ```
 */
export const endOfDay = (input: Date | string | number): Date => {
  const date = toDateStrict(input)
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    23,
    59,
    59,
    999,
  )
}

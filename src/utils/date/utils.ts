/**
 * Coerce a date-like value into a real `Date` instance, or throw if invalid.
 *
 * This helper is intended for internal use by other date utilities
 * (e.g. {@link addDays}, {@link differenceInCalendarDays}, etc.).
 *
 * It:
 * - Accepts a `Date` instance, ISO-like `string`, or timestamp `number`.
 * - Clones `Date` inputs (never mutates the original).
 * - Uses the built-in `Date` constructor for parsing.
 * - Throws a `RangeError` when the result is an invalid date.
 *
 * @internal
 *
 * @param {Date | string | number} value
 *   Date-like value to normalize.
 *
 * @returns {Date}
 *   A **new** valid `Date` instance.
 *
 * @throws {RangeError}
 *   When `value` cannot be converted into a valid `Date`.
 *
 * @example
 * ```ts
 * const d1 = toDateStrict(new Date(2024, 0, 1));
 * const d2 = toDateStrict('2024-01-01T12:00:00');
 * const d3 = toDateStrict(1704100800000);
 * ```
 */
export function toDateStrict(value: Date | string | number): Date {
  const date
    = value instanceof Date
      ? new Date(value.getTime()) // clone
      : new Date(value)

  if (Number.isNaN(date.getTime())) {
    throw new RangeError('toDateStrict: Invalid date input')
  }

  return date
}

/**
 * Best-effort conversion of a date-like value into a real `Date` instance.
 *
 * Unlike {@link toDateStrict}, this helper **never throws** — it returns
 * `null` when the value cannot be converted to a valid date.
 *
 * Behavior:
 * - `null` / `undefined` → `null`
 * - `Date` → cloned `Date` (never mutates the original)
 * - `string` / `number` → `new Date(value)`
 *   - returns `null` when the result is an invalid `Date`
 *
 * This is meant for internal use in utilities where an invalid date should
 * gracefully short-circuit logic instead of throwing.
 *
 * @internal
 *
 * @param {Date | string | number | null | undefined} value
 *   Date-like input to normalize.
 *
 * @returns {Date | null}
 *   A **new** valid `Date` instance, or `null` when the value cannot be parsed.
 *
 * @example
 * ```ts
 * toDateOrNull(new Date(2024, 0, 1));      // → Date(2024-01-01 …)
 * toDateOrNull('2024-01-01T12:00:00');     // → Date(...)
 * toDateOrNull(1704100800000);            // → Date(...)
 * toDateOrNull('not-a-date');             // → null
 * toDateOrNull(undefined);                // → null
 * ```
 */
export function toDateOrNull(
  value: Date | string | number | null | undefined,
): Date | null {
  if (value === undefined || value === null) {
    return null
  }

  const date
    = value instanceof Date ? new Date(value.getTime()) : new Date(value)

  return Number.isNaN(date.getTime()) ? null : date
}

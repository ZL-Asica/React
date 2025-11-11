/**
 * Options for {@link formatDistanceToNow}.
 */
export interface FormatDistanceToNowOptions {
  /**
   * Whether to append a suffix such as `"ago"` or `"in"`.
   *
   * - When `true` (default):
   *   - Past dates produce strings like `"3 minutes ago"`.
   *   - Future dates produce strings like `"in 2 days"`.
   * - When `false`:
   *   - Returns just `"3 minutes"`, `"2 days"`, etc.
   */
  addSuffix?: boolean

  /**
   * Reference "now" value.
   *
   * By default, the current time (`new Date()`) is used. You can override
   * this in tests or for deterministic formatting.
   */
  now?: Date | number
}

/**
 * Format the distance between the given date and "now" (by default the
 * current time) into a small human-readable string.
 *
 * The output is intentionally simple and dependency-free:
 *
 * - `just now` (for differences under ~5 seconds)
 * - `X seconds`
 * - `X minutes`
 * - `X hours`
 * - `X days`
 * - `X months` (approximate, based on 30-day months)
 * - `X years`  (approximate, based on 12-month years)
 *
 * @param {Date | number} input
 *   The target date as a `Date` instance or timestamp (ms since epoch).
 *
 * @param {FormatDistanceToNowOptions} [options]
 *   Additional configuration for suffix handling and reference time.
 *
 * @returns {string} A human-readable distance like `"3 minutes ago"`,
 *   `"in 2 days"` or `"just now"`.
 *
 * @example
 * ```ts
 * formatDistanceToNow(new Date(Date.now() - 1000 * 60)); // "1 minute ago"
 * formatDistanceToNow(Date.now() + 1000 * 60 * 60 * 5);  // "in 5 hours"
 * ```
 *
 * @example
 * ```ts
 * // Without suffix:
 * formatDistanceToNow(Date.now() + 1000 * 60 * 10, { addSuffix: false });
 * // -> "10 minutes"
 * ```
 */
export const formatDistanceToNow = (
  input: Date | number,
  options: FormatDistanceToNowOptions = {},
): string => {
  const { addSuffix = true, now } = options

  const nowDate = now instanceof Date
    ? now
    : typeof now === 'number'
      ? new Date(now)
      : new Date()

  const targetDate = input instanceof Date ? input : new Date(input)

  const nowTime = nowDate.getTime()
  const targetTime = targetDate.getTime()

  if (Number.isNaN(nowTime) || Number.isNaN(targetTime)) {
    throw new RangeError('formatDistanceToNow: Invalid Date or timestamp')
  }

  const diffMs = targetTime - nowTime
  const diffSeconds = Math.round(diffMs / 1000)
  const isPast = diffMs < 0
  const absSeconds = Math.abs(diffSeconds)

  // Very small differences → "just now"
  if (absSeconds < 5) {
    return 'just now'
  }

  let value: number
  let unit: 'second' | 'minute' | 'hour' | 'day' | 'month' | 'year'

  if (absSeconds < 60) {
    value = absSeconds
    unit = 'second'
  }
  else {
    const minutes = Math.round(absSeconds / 60)

    if (minutes < 60) {
      value = minutes
      unit = 'minute'
    }
    else {
      const hours = Math.round(minutes / 60)

      if (hours < 24) {
        value = hours
        unit = 'hour'
      }
      else {
        const days = Math.round(hours / 24)

        if (days < 30) {
          value = days
          unit = 'day'
        }
        else {
          const months = Math.round(days / 30)

          if (months < 12) {
            value = months
            unit = 'month'
          }
          else {
            const years = Math.round(months / 12)
            value = years
            unit = 'year'
          }
        }
      }
    }
  }

  const pluralized = value === 1 ? unit : `${unit}s`
  const core = `${value} ${pluralized}`

  if (!addSuffix) {
    return core
  }

  return isPast ? `${core} ago` : `in ${core}`
}

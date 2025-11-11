export interface GetRelativeDayOptions {
  /**
   * Reference "today" value.
   *
   * By default, the current time (`new Date()`) is used. For tests or
   * deterministic formatting, you can pass a `Date` or a timestamp.
   */
  now?: Date | number

  /**
   * Custom weekday labels starting from Sunday.
   *
   * Must contain exactly 7 entries. When omitted or invalid, the default
   * English names are used.
   *
   * @example ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
   */
  weekdays?: [string, string, string, string, string, string, string]
}

/**
 * Normalize a value into a `Date` instance.
 *
 * Returns `null` when the input cannot be parsed.
 *
 * @internal
 */
const __INTERNAL__normalizeDate = (
  value: Date | string | number,
): Date | null => {
  if (value instanceof Date) {
    return new Date(value.getTime())
  }

  if (typeof value === 'string' || typeof value === 'number') {
    const date = new Date(value)
    return Number.isNaN(date.getTime()) ? null : date
  }

  return null
}

/**
 * Get a human-friendly description of a date relative to "today".
 *
 * The output is intentionally simple and English-only:
 *
 * - `"Today"`
 * - `"Yesterday"`
 * - `"Tomorrow"`
 * - `"Last Friday"`
 * - `"Next Monday"`
 * - `"2 weeks ago Tuesday"`
 * - `"In 3 weeks Sunday"`
 *
 * The comparison is done in **UTC days**, so it is not affected by the
 * local time-of-day differences or daylight saving transitions.
 *
 * @param {Date | string | number | null | undefined} targetDate
 *   The date to compare with "today". Accepts:
 *   - `Date` instance
 *   - ISO-like string (passed to `new Date(...)`)
 *   - timestamp number (milliseconds since epoch)
 *   - `null` / `undefined` → treated as invalid and returns `""`
 *
 * @param {GetRelativeDayOptions} [options]
 *   Additional configuration:
 *   - `now`: Reference "today" as `Date` or timestamp. Defaults to `new Date()`.
 *   - `weekdays`: Custom weekday labels (length 7, starting from Sunday).
 *
 * @returns {string}
 *   A relative day description, or an empty string (`""`) when the date
 *   cannot be parsed.
 *
 * @example
 * ```ts
 * getRelativeDay(new Date());                  // "Today"
 * getRelativeDay('2024-01-01');                // e.g. "Last Monday"
 * getRelativeDay(Date.now() - 7 * 86400000);   // "Last <weekday>"
 * getRelativeDay(Date.now() - 14 * 86400000);  // "2 weeks ago <weekday>"
 * ```
 */
export const getRelativeDay = (
  targetDate: Date | string | number | null | undefined,
  options: GetRelativeDayOptions = {},
): string => {
  if (targetDate === undefined || targetDate === null) {
    return ''
  }

  const defaultWeekdays: [string, string, string, string, string, string, string]
    = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

  const { now, weekdays } = options

  const todayDate
    = now instanceof Date
      ? new Date(now.getTime())
      : typeof now === 'number'
        ? new Date(now)
        : new Date()

  const target = __INTERNAL__normalizeDate(targetDate)
  if (target === null || Number.isNaN(todayDate.getTime())) {
    return ''
  }

  const daysOfWeek
    = Array.isArray(weekdays) && weekdays.length === 7
      ? weekdays
      : defaultWeekdays

  // Normalize both dates to UTC midnight for consistent comparison
  const todayMidnight = Date.UTC(
    todayDate.getUTCFullYear(),
    todayDate.getUTCMonth(),
    todayDate.getUTCDate(),
  )

  const targetMidnight = Date.UTC(
    target.getUTCFullYear(),
    target.getUTCMonth(),
    target.getUTCDate(),
  )

  // Difference in whole days
  const dayDifference = Math.round(
    (targetMidnight - todayMidnight) / (1000 * 60 * 60 * 24),
  )

  // Simple same/adjacent days
  if (dayDifference === 0) {
    return 'Today'
  }
  if (dayDifference === -1) {
    return 'Yesterday'
  }
  if (dayDifference === 1) {
    return 'Tomorrow'
  }

  const isPast = dayDifference < 0
  const absDays = Math.abs(dayDifference)
  const weeksDifference = Math.floor(absDays / 7)

  const weekdayIndex = new Date(targetMidnight).getUTCDay()
  const weekdayLabel = daysOfWeek[weekdayIndex] ?? defaultWeekdays[weekdayIndex]

  // Within the same week (but not today/yesterday/tomorrow)
  if (weeksDifference === 0) {
    return isPast ? `Last ${weekdayLabel}` : `Next ${weekdayLabel}`
  }

  const weeksLabel = `${weeksDifference} week${weeksDifference > 1 ? 's' : ''}`

  if (isPast) {
    return `${weeksLabel} ago ${weekdayLabel}`
  }

  return `In ${weeksLabel} ${weekdayLabel}`
}

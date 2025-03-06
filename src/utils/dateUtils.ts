/**
 * Formats a `Date` object into a string according to the specified format.
 *
 * Supported placeholders in the format string:
 * - `YYYY`: Four-digit year (e.g., 2024).
 * - `YY`: Two-digit year (e.g., 24).
 * - `MM`: Two-digit month (e.g., 01 for January).
 * - `DD`: Two-digit day of the month (e.g., 09).
 * - `HH`: Two-digit hour in 24-hour format (e.g., 15 for 3 PM).
 * - `mm`: Two-digit minutes (e.g., 07).
 * - `ss`: Two-digit seconds (e.g., 45).
 *
 * @param {Date | string | null} [date] - The date to format. Can be a `Date` object or a string.
 * @param {string} [format] - The format string. Defaults to `'YYYY-MM-DD'`.
 * @returns {string} A formatted date string. Returns an empty string if the input is invalid.
 *
 * @example
 * ```tsx
 * const now = new Date('2024-11-18T12:34:56Z');
 *
 * formatDate(now, 'YYYY-MM-DD'); // '2024-11-18'
 * formatDate(now, 'YYYY-MM-DD HH:mm:ss'); // '2024-11-18 12:34:56'
 * formatDate(now, 'MM/DD/YYYY'); // '11/18/2024'
 * ```
 */
export const formatDate = (date?: Date | string | null, format = 'YYYY-MM-DD'): string => {
  if (date === undefined || date === null) {
    date = new Date()
  }
  else if (typeof date === 'string') {
    date = new Date(date)
    if (Number.isNaN(date.getTime())) {
      return '' // Return empty string for invalid dates
    }
  }
  else if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    return '' // Return empty string for invalid dates
  }

  const map: Record<string, string> = {
    YYYY: `${date.getFullYear()}`,
    YY: `${date.getFullYear()}`.slice(-2),
    MM: `${date.getMonth() + 1}`.padStart(2, '0'),
    DD: `${date.getDate()}`.padStart(2, '0'),
    HH: `${date.getHours()}`.padStart(2, '0'),
    mm: `${date.getMinutes()}`.padStart(2, '0'),
    ss: `${date.getSeconds()}`.padStart(2, '0'),
  }

  return format.replaceAll(/YYYY|YY|MM|DD|HH|mm|ss/g, matched => map[matched])
}

/**
 * Checks if two `Date` objects fall on the same calendar day.
 *
 * This function compares the year, month, and day parts of the two dates
 * and ignores the time.
 *
 * @param {Date} date1 - The first date to compare.
 * @param {Date} date2 - The second date to compare.
 * @returns {boolean | null} `true` if both dates are on the same day, `false` if not.
 *                           Returns `null` if either date is invalid.
 *
 * @example
 * ```tsx
 * const date1 = new Date('2024-11-18T10:00:00Z');
 * const date2 = new Date('2024-11-18T23:59:59Z');
 *
 * isSameDay(date1, date2); // true
 * isSameDay(new Date(), new Date('2024-11-19')); // false
 * ```
 */
export const isSameDay = (date1: Date, date2: Date): boolean | null => {
  if (
    !(date1 instanceof Date)
    || Number.isNaN(date1.getTime())
    || !(date2 instanceof Date)
    || Number.isNaN(date2.getTime())
  ) {
    return null // Return null for invalid dates
  }

  return (
    date1.getFullYear() === date2.getFullYear()
    && date1.getMonth() === date2.getMonth()
    && date1.getDate() === date2.getDate()
  )
}

/**
 * Gets the day of the week for a given date.
 *
 * @param {Date | string} date - The date (or string) for which to get the day of the week.
 * @returns {string} The name of the day of the week (e.g., 'Monday', 'Tuesday').
 *                   Returns an empty string if the input is invalid.
 *
 * @example
 * ```tsx
 * const day1 = getDayOfWeek(new Date('2024-11-19')); // 'Tuesday'
 * const day2 = getDayOfWeek('2024-11-19'); // 'Tuesday'
 * const day3 = getDayOfWeek('Invalid date string'); // ''
 * ```
 */
export const getDayOfWeek = (date: Date | string): string => {
  if (date === undefined || date === null) {
    return ''
  }

  const parsedDate = typeof date === 'string' ? new Date(date) : date

  if (!(parsedDate instanceof Date) || Number.isNaN(parsedDate.getTime())) {
    return '' // Return empty string for invalid dates
  }

  const day = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    timeZone: 'UTC',
  }).format(parsedDate)

  return day
}

/**
 * Gets a relative day description based on a given date, e.g., 'Yesterday', 'Last Friday', '2 weeks ago Thursday'.
 *
 * @param {Date | string} targetDate - The date to compare with today. Can be a Date object or a string.
 * @returns {string} A string representing the relative day. If the date is invalid, returns an empty string.
 *
 * @example
 * ```tsx
 * const yesterday = getRelativeDay(new Date(Date.now() - 24 * 60 * 60 * 1000));
 * console.log(yesterday); // Outputs: 'Yesterday'
 *
 * const lastFriday = getRelativeDay('2024-11-15'); // Assuming today is '2024-11-19'
 * console.log(lastFriday); // Outputs: 'Last Friday'
 *
 * const twoWeeksAgo = getRelativeDay(new Date(Date.now() - 14 * 24 * 60 * 60 * 1000));
 * console.log(twoWeeksAgo); // Outputs: '2 weeks ago Tuesday'
 * ```
 */
export const getRelativeDay = (targetDate: Date | string): string => {
  if (targetDate === undefined || targetDate === null) {
    return ''
  }
  const daysOfWeek = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ]

  const today = new Date()
  const target
    = typeof targetDate === 'string' ? new Date(targetDate) : targetDate

  if (Number.isNaN(target.getTime())) {
    return ''
  }

  // Normalize both dates to UTC midnight for consistent comparison
  const todayMidnight = Date.UTC(
    today.getUTCFullYear(),
    today.getUTCMonth(),
    today.getUTCDate(),
  )
  const targetMidnight = Date.UTC(
    target.getUTCFullYear(),
    target.getUTCMonth(),
    target.getUTCDate(),
  )

  // Calculate difference in days
  const dayDifference = Math.round(
    (targetMidnight - todayMidnight) / (1000 * 60 * 60 * 24),
  )

  // Simple cases
  if (dayDifference === 0) {
    return 'Today'
  }
  if (dayDifference === -1) {
    return 'Yesterday'
  }
  if (dayDifference === 1) {
    return 'Tomorrow'
  }

  // Week-based descriptions
  const weeksDifference = Math.floor(Math.abs(dayDifference) / 7)
  const relativeDay = daysOfWeek[new Date(targetMidnight).getUTCDay()]

  if (dayDifference < 0) {
    return weeksDifference === 0
      ? `Last ${relativeDay}`
      : `${weeksDifference} week${weeksDifference > 1 ? 's' : ''} ago ${relativeDay}`
  }

  return weeksDifference === 0
    ? `Next ${relativeDay}`
    : `In ${weeksDifference} week${weeksDifference > 1 ? 's' : ''} ${relativeDay}`
}

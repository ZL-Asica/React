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

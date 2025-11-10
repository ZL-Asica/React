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

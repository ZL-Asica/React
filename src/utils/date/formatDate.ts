/**
 * Formats a `Date` object into a string according to the specified format.
 *
 * Supported placeholders in the format string:
 * - `YYYY`: Four-digit year (e.g., 2024).
 * - `YY`: Two-digit year (e.g., 24).
 * - `MM`: Two-digit month (e.g., 01 for January).
 * - `MMM`: Abbreviated month name (e.g., Jan, Feb).
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
 * ```ts
 * const now = new Date('2024-02-18T12:34:56Z');
 *
 * formatDate(now, 'YYYY-MM-DD'); // '2024-02-18'
 * formatDate(now, 'MMM DD, YYYY'); // 'Feb 18, 2024'
 * formatDate(now, 'YYYY-MM-DD HH:mm:ss'); // '2024-11-18 12:34:56'
 * formatDate(now, 'MM/DD/YYYY'); // '02/18/2024'
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
    MMM: date.toLocaleString('default', { month: 'short' }), // e.g., 'Feb'
    DD: `${date.getDate()}`.padStart(2, '0'),
    HH: `${date.getHours()}`.padStart(2, '0'),
    mm: `${date.getMinutes()}`.padStart(2, '0'),
    ss: `${date.getSeconds()}`.padStart(2, '0'),
  }

  return format.replaceAll(/YYYY|YY|MMM|MM|DD|HH|mm|ss/g, matched => map[matched])
}

/**
 * Formats a date-like value into a string according to the specified format.
 *
 * Supported placeholders in the format string:
 * - `YYYY`: Four-digit year (e.g., 2024).
 * - `YY`: Two-digit year (e.g., 24).
 * - `MM`: Two-digit month (01–12).
 * - `MMM`: Abbreviated English month name (Jan, Feb, ...).
 * - `DD`: Two-digit day of the month (01–31).
 * - `HH`: Two-digit hour in 24-hour format (00–23).
 * - `mm`: Two-digit minutes (00–59).
 * - `ss`: Two-digit seconds (00–59).
 *
 * @param {Date | string | number | null | undefined} [input]
 *   The date to format. When omitted or `null`, the current time is used.
 *   - `Date`: used as-is.
 *   - `string` / `number`: passed to the `Date` constructor.
 *
 * @param {string} [format]
 *   Format pattern string. Tokens are case-sensitive.
 *
 * @returns {string}
 *   The formatted date string. Returns an empty string for invalid input.
 *
 * @example
 * ```ts
 * const d = new Date('2024-02-18T12:34:56Z');
 *
 * formatDate(d, 'YYYY-MM-DD');           // '2024-02-18'
 * formatDate(d, 'MMM DD, YYYY');         // 'Feb 18, 2024'
 * formatDate(d, 'YYYY-MM-DD HH:mm:ss');  // '2024-02-18 12:34:56'
 * formatDate(d.getTime(), 'MM/DD/YYYY'); // '02/18/2024'
 * ```
 */
export const formatDate = (
  input?: Date | string | number | null,
  format: string = 'YYYY-MM-DD',
): string => {
  const resolvedDate = normalizeToDate(input)

  if (!resolvedDate) {
    return ''
  }

  const year = resolvedDate.getFullYear()
  const monthIndex = resolvedDate.getMonth() // 0–11
  const day = resolvedDate.getDate()
  const hours = resolvedDate.getHours()
  const minutes = resolvedDate.getMinutes()
  const seconds = resolvedDate.getSeconds()

  const MONTHS_SHORT = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ] as const

  const tokens: Record<string, string> = {
    YYYY: String(year),
    YY: String(year).slice(-2),
    MM: String(monthIndex + 1).padStart(2, '0'),
    MMM: MONTHS_SHORT[monthIndex] ?? '',
    DD: String(day).padStart(2, '0'),
    HH: String(hours).padStart(2, '0'),
    mm: String(minutes).padStart(2, '0'),
    ss: String(seconds).padStart(2, '0'),
  }

  // Use `replace` with a global regex instead of `replaceAll` for better compatibility.
  return format.replace(/YYYY|YY|MMM|MM|DD|HH|mm|ss/g, match => tokens[match])
}

/**
 * Normalize different input types into a valid Date instance.
 *
 * Returns `null` when the input cannot be parsed as a valid date.
 *
 * @internal
 */
function normalizeToDate(
  value: Date | string | number | null | undefined,
): Date | null {
  if (value === null || value === undefined) {
    return new Date()
  }

  if (value instanceof Date) {
    const time = value.getTime()
    return Number.isNaN(time) ? null : new Date(time)
  }

  if (typeof value === 'string' || typeof value === 'number') {
    const date = new Date(value)
    return Number.isNaN(date.getTime()) ? null : date
  }

  return null
}

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

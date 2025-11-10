/**
 * Generates a random integer between `min` and `max` (inclusive).
 *
 * @param {number} min - The minimum value (inclusive).
 * @param {number} max - The maximum value (inclusive).
 * @returns {number} A random integer between `min` and `max`. Returns `NaN` if inputs are invalid.
 *
 * @example
 * ```tsx
 * const random = randomInt(1, 10); // e.g., 7
 * ```
 */
export const randomInt = (min: number, max: number): number => {
  if (Number.isNaN(min) || Number.isNaN(max)) {
    return Number.NaN
  }
  if (min > max) {
    [min, max] = [max, min]
  }
  return Math.floor(Math.random() * (max - min + 1)) + min
}

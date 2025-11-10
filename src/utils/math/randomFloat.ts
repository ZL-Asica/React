/**
 * Generates a random floating-point number between `min` and `max`.
 *
 * @param {number} min - The minimum value.
 * @param {number} max - The maximum value.
 * @returns {number} A random float between `min` and `max`. Returns `NaN` if inputs are invalid.
 *
 * @example
 * ```tsx
 * const random = randomFloat(1.5, 5.5); // e.g., 3.14
 * ```
 */
export const randomFloat = (min: number, max: number): number => {
  if (Number.isNaN(min) || Number.isNaN(max)) {
    return Number.NaN
  }
  if (min > max) {
    [min, max] = [max, min]
  }
  return Math.random() * (max - min) + min
}

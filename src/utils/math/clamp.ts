/**
 * Clamps a number to a specified range.
 *
 * @param {number} value - The number to clamp.
 * @param {number} min - The minimum value.
 * @param {number} max - The maximum value.
 * @returns {number} The clamped value. Returns `NaN` if inputs are invalid.
 *
 * @example
 * ```tsx
 * const clamped = clamp(15, 0, 10); // 10
 * const clamped = clamp(-5, 0, 10); // 0
 * ```
 */
export const clamp = (value: number, min: number, max: number): number => {
  if (Number.isNaN(value) || Number.isNaN(min) || Number.isNaN(max)) {
    return Number.NaN
  }
  if (min > max) {
    [min, max] = [max, min]
  }
  return Math.min(Math.max(value, min), max)
}

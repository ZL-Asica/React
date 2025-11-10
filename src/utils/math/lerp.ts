/**
 * Linearly interpolates between two numbers.
 *
 * @param {number} start - The starting value.
 * @param {number} end - The ending value.
 * @param {number} t - The interpolation factor (between 0 and 1).
 * @returns {number} The interpolated value. Returns `NaN` if inputs are invalid or `t` is out of range.
 *
 * @example
 * ```tsx
 * const lerpValue = lerp(0, 10, 0.5); // 5
 * ```
 */
export const lerp = (start: number, end: number, t: number): number => {
  if (
    Number.isNaN(start)
    || Number.isNaN(end)
    || Number.isNaN(t)
    || t < 0
    || t > 1
  ) {
    return Number.NaN
  }
  return start + t * (end - start)
}

import { clamp } from './clamp'

/**
 * Maps a number from one range to another.
 *
 * @param {number} value - The number to map.
 * @param {number} inMin - The minimum value of the input range.
 * @param {number} inMax - The maximum value of the input range.
 * @param {number} outMin - The minimum value of the output range.
 * @param {number} outMax - The maximum value of the output range.
 * @returns {number} The mapped value in the new range. Returns `NaN` if inputs are invalid or input range is zero.
 *
 * @example
 * ```tsx
 * const mapped = mapRange(5, 0, 10, 0, 100); // 50
 * ```
 */
export const mapRange = (
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
): number => {
  if (
    Number.isNaN(value)
    || Number.isNaN(inMin)
    || Number.isNaN(inMax)
    || Number.isNaN(outMin)
    || Number.isNaN(outMax)
    || inMin === inMax
  ) {
    return Number.NaN
  }

  const clampedValue = clamp(value, inMin, inMax)
  return (
    ((clampedValue - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin
  )
}

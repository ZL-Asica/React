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

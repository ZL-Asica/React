import {
  clamp,
  lerp,
  mapRange,
  randomFloat,
  randomInt,
} from '@/utils/mathUtils'

describe('math Utils', () => {
  describe('randomInt', () => {
    it('should return an integer within the range', () => {
      const value = randomInt(1, 10)
      expect(value).toBeGreaterThanOrEqual(1)
      expect(value).toBeLessThanOrEqual(10)
      expect(Number.isInteger(value)).toBe(true)
    })

    it('should swap min and max if min > max', () => {
      const value = randomInt(10, 1)
      expect(value).toBeGreaterThanOrEqual(1)
      expect(value).toBeLessThanOrEqual(10)
    })

    it('should return NaN if inputs are invalid', () => {
      expect(randomInt(Number.NaN, 10)).toBeNaN()
      expect(randomInt(1, Number.NaN)).toBeNaN()
    })
  })

  describe('randomFloat', () => {
    it('should return a float within the range', () => {
      const value = randomFloat(1.5, 5.5)
      expect(value).toBeGreaterThanOrEqual(1.5)
      expect(value).toBeLessThanOrEqual(5.5)
    })

    it('should swap min and max if min > max', () => {
      const value = randomFloat(5.5, 1.5)
      expect(value).toBeGreaterThanOrEqual(1.5)
      expect(value).toBeLessThanOrEqual(5.5)
    })

    it('should return NaN if inputs are invalid', () => {
      expect(randomFloat(Number.NaN, 5.5)).toBeNaN()
      expect(randomFloat(1.5, Number.NaN)).toBeNaN()
    })
  })

  describe('clamp', () => {
    it('should restrict value within the range', () => {
      expect(clamp(5, 0, 10)).toBe(5)
      expect(clamp(-5, 0, 10)).toBe(0)
      expect(clamp(15, 0, 10)).toBe(10)
    })

    it('should swap min and max if min > max', () => {
      expect(clamp(5, 10, 0)).toBe(5)
      expect(clamp(-5, 10, 0)).toBe(0)
      expect(clamp(15, 10, 0)).toBe(10)
    })

    it('should return NaN if inputs are invalid', () => {
      expect(clamp(Number.NaN, 0, 10)).toBeNaN()
      expect(clamp(5, Number.NaN, 10)).toBeNaN()
      expect(clamp(5, 0, Number.NaN)).toBeNaN()
    })
  })

  describe('lerp', () => {
    it('should interpolate correctly', () => {
      expect(lerp(0, 10, 0.5)).toBe(5)
      expect(lerp(10, 20, 0.25)).toBe(12.5)
    })

    it('should return NaN for invalid inputs', () => {
      expect(lerp(Number.NaN, 10, 0.5)).toBeNaN()
      expect(lerp(0, Number.NaN, 0.5)).toBeNaN()
      expect(lerp(0, 10, Number.NaN)).toBeNaN()
    })

    it('should return NaN if t is out of range', () => {
      expect(lerp(0, 10, -0.5)).toBeNaN()
      expect(lerp(0, 10, 1.5)).toBeNaN()
    })
  })

  describe('mapRange', () => {
    it('should map value from one range to another', () => {
      expect(mapRange(5, 0, 10, 0, 100)).toBe(50)
      expect(mapRange(0, -10, 10, 0, 1)).toBe(0.5)
    })

    it('should clamp input value to inMin and inMax', () => {
      expect(mapRange(-5, 0, 10, 0, 100)).toBe(0)
      expect(mapRange(15, 0, 10, 0, 100)).toBe(100)
    })

    it('should return NaN for invalid inputs', () => {
      expect(mapRange(Number.NaN, 0, 10, 0, 100)).toBeNaN()
      expect(mapRange(5, Number.NaN, 10, 0, 100)).toBeNaN()
      expect(mapRange(5, 0, Number.NaN, 0, 100)).toBeNaN()
      expect(mapRange(5, 0, 10, Number.NaN, 100)).toBeNaN()
      expect(mapRange(5, 0, 10, 0, Number.NaN)).toBeNaN()
    })

    it('should return NaN if input range is zero', () => {
      expect(mapRange(5, 0, 0, 0, 100)).toBeNaN()
    })
  })
})

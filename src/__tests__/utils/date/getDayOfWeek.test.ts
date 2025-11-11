import { getDayOfWeek } from '@/utils/date'

describe('getDayOfWeek', () => {
  it('should return the correct day of the week for a given date string', () => {
    expect(getDayOfWeek('2024-11-19')).toBe('Tuesday')
    expect(getDayOfWeek('2024-11-18')).toBe('Monday')
  })

  it('should return the correct day of the week for a Date object', () => {
    const date = new Date('2024-11-19')
    expect(getDayOfWeek(date)).toBe('Tuesday')
  })

  it('should throw an error for invalid date strings', () => {
    expect(getDayOfWeek('invalid-date')).toBe('')
  })

  it('should return an empty string for null or undefined input', () => {
    expect(getDayOfWeek(null as unknown as string)).toBe('')
    expect(getDayOfWeek(undefined as unknown as string)).toBe('')
  })
})

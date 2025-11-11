import { isSameDay } from '@/utils/date'

describe('isSameDay', () => {
  it('should return true if the dates are the same day', () => {
    const date1 = new Date('2024-01-01T12:34:56')
    const date2 = new Date('2024-01-01T00:00:00')
    expect(isSameDay(date1, date2)).toBe(true)
  })

  it('should return false if the dates are different days', () => {
    const date1 = new Date('2024-01-01T12:34:56')
    const date2 = new Date('2024-01-02T00:00:00')
    expect(isSameDay(date1, date2)).toBe(false)
  })

  it('should return null for invalid dates', () => {
    expect(isSameDay(new Date('invalid'), new Date())).toBe(null)
  })
})

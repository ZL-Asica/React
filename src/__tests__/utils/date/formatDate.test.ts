import { formatDate } from '@/utils/date'

describe('formatDate', () => {
  it('should format the date correctly', () => {
    const date = new Date('2024-01-01T12:34:56')
    const formatted = formatDate(date, 'YYYY-MM-DD')
    expect(formatted).toBe('2024-01-01')
  })

  it('should handle different formats', () => {
    const date = new Date('2024-01-01T12:34:56')
    const formatted = formatDate(date, 'YYYY-MM-DD HH:mm:ss')
    expect(formatted).toBe('2024-01-01 12:34:56')
  })

  it('should handle string input', () => {
    const formatted = formatDate('2024-01-01T12:34:56', 'YYYY-MM-DD')
    expect(formatted).toBe('2024-01-01')
  })

  it('should handle undefined input', () => {
    const formatted = formatDate(undefined, 'YYYY-MM-DD')
    expect(formatted).not.toBe('')
  })

  it('should handle null input', () => {
    const formatted = formatDate(null, 'YYYY-MM-DD')
    expect(formatted).not.toBe('')
  })

  it('should handle string but not a valid date input', () => {
    const formatted = formatDate('invalid', 'YYYY-MM-DD')
    expect(formatted).toBe('')
  })

  it('should return an empty string for invalid dates', () => {
    expect(formatDate(new Date('invalid'))).toBe('')
  })
})

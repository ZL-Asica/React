import {
  formatDate,
  getDayOfWeek,
  getRelativeDay,
  isSameDay,
} from '@/utils/dateUtils'

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

  it('should return an empty string for invalid dates', () => {
    expect(formatDate(new Date('invalid'))).toBe('')
  })
})

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

describe('getRelativeDay', () => {
  const today = new Date('2024-11-19')

  beforeEach(() => {
    vi.useFakeTimers().setSystemTime(today.getTime())
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should return "Today" for the current date', () => {
    expect(getRelativeDay('2024-11-19')).toBe('Today')
  })

  it('should return "Yesterday" for one day before today', () => {
    expect(getRelativeDay('2024-11-18')).toBe('Yesterday')
  })

  it('should return "Tomorrow" for one day after today', () => {
    expect(getRelativeDay('2024-11-20')).toBe('Tomorrow')
  })

  it('should return "Last Friday" for a date within the previous week', () => {
    expect(getRelativeDay('2024-11-15')).toBe('Last Friday')
  })

  it('should return "Next Monday" for a date within the next week', () => {
    expect(getRelativeDay('2024-11-25')).toBe('Next Monday')
  })

  it('should return "2 weeks ago Tuesday" for a date 14 days ago', () => {
    expect(getRelativeDay('2024-11-05')).toBe('2 weeks ago Tuesday')
  })

  it('should return "In 3 weeks Tuesday" for a date 21 days in the future', () => {
    expect(getRelativeDay('2024-12-10')).toBe('In 3 weeks Tuesday')
  })

  it('should throw an error for invalid date strings', () => {
    expect(getRelativeDay('invalid-date')).toBe('')
  })

  it('should return "5 weeks ago Tuesday" for a date 35 days ago', () => {
    expect(getRelativeDay('2024-10-15')).toBe('5 weeks ago Tuesday')
  })

  it('should return "In 5 weeks Tuesday" for a date 35 days in the future', () => {
    expect(getRelativeDay('2024-12-24')).toBe('In 5 weeks Tuesday')
  })

  it('should return an empty string for null or undefined input', () => {
    expect(getRelativeDay(null as unknown as string)).toBe('')
    expect(getRelativeDay(undefined as unknown as string)).toBe('')
  })
})

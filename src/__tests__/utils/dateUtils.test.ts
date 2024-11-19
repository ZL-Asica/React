import { formatDate, isSameDay } from '@/utils/dateUtils';

describe('formatDate', () => {
  it('should format the date correctly', () => {
    const date = new Date('2024-01-01T12:34:56');
    const formatted = formatDate(date, 'YYYY-MM-DD');
    expect(formatted).toBe('2024-01-01');
  });

  it('should handle different formats', () => {
    const date = new Date('2024-01-01T12:34:56');
    const formatted = formatDate(date, 'YYYY-MM-DD HH:mm:ss');
    expect(formatted).toBe('2024-01-01 12:34:56');
  });
});

describe('isSameDay', () => {
  it('should return true if the dates are the same day', () => {
    const date1 = new Date('2024-01-01T12:34:56');
    const date2 = new Date('2024-01-01T00:00:00');
    expect(isSameDay(date1, date2)).toBe(true);
  });

  it('should return false if the dates are different days', () => {
    const date1 = new Date('2024-01-01T12:34:56');
    const date2 = new Date('2024-01-02T00:00:00');
    expect(isSameDay(date1, date2)).toBe(false);
  });
});

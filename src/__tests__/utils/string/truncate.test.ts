import { truncate } from '@/utils'

describe('truncate', () => {
  it('should truncate strings exceeding the specified length', () => {
    expect(truncate('This is a long string', 10)).toBe('This is a...')
    expect(truncate('Short', 10)).toBe('Short')
    expect(truncate('', 5)).toBe('')
    expect(truncate('Some text', 0)).toBe('')
  })
})

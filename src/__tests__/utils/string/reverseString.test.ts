import { reverseString } from '@/utils'

describe('reverseString', () => {
  it('should reverse the characters in a string', () => {
    expect(reverseString('hello')).toBe('olleh')
    expect(reverseString('')).toBe('')
  })
})

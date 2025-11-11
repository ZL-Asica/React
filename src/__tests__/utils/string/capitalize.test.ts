import { capitalize } from '@/utils'

describe('capitalize', () => {
  it('should capitalize the first letter of a string', () => {
    expect(capitalize('hello')).toBe('Hello')
    expect(capitalize('Hello')).toBe('Hello')
    expect(capitalize('')).toBe('')
  })
})

import { truncateToNearestWord } from '@/utils/string'

describe('truncateToNearestWord', () => {
  it('should return the original string if within the limit', () => {
    expect(truncateToNearestWord('Short text', 50)).toBe('Short text')
  })

  it('should truncate at the nearest whole word', () => {
    expect(truncateToNearestWord('This is a long example sentence.', 10)).toBe('This is a...')
    expect(truncateToNearestWord('Hello world, how are you?', 15)).toBe('Hello world,...')
  })

  it('should not add "..." if the string is exactly maxLength', () => {
    expect(truncateToNearestWord('Perfect fit!', 13)).toBe('Perfect fit!')
  })

  it('should handle strings with no spaces correctly', () => {
    expect(truncateToNearestWord('Supercalifragilisticexpialidocious', 10)).toBe('Supercalif...')
  })

  it('should handle edge cases gracefully', () => {
    expect(truncateToNearestWord('', 10)).toBe('') // Empty string
    expect(truncateToNearestWord('   ', 10)).toBe('   ') // String of spaces
    expect(truncateToNearestWord('Word', 2)).toBe('Wo...') // Too short to keep anything
  })

  it('should return the original string if invalid inputs are provided', () => {
    // @ts-expect-error: Testing invalid inputs
    expect(truncateToNearestWord(123, 10)).toBe(123)
    expect(truncateToNearestWord('Valid', -5)).toBe('Valid')
    expect(truncateToNearestWord('Valid', 0)).toBe('Valid')
  })
})

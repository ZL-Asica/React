import { removeSpecialCharacters } from '@/utils'

describe('removeSpecialCharacters', () => {
  it('should remove special characters while preserving letters, numbers, and spaces', () => {
    expect(removeSpecialCharacters('Hello, World! 123')).toBe(
      'Hello World 123',
    )
    expect(removeSpecialCharacters('你好，世界！123')).toBe('你好世界123')
    expect(removeSpecialCharacters('@#%*&$')).toBe('')
    expect(removeSpecialCharacters('foo_bar-baz')).toBe('foobarbaz')
    expect(removeSpecialCharacters('123!@#abcABC')).toBe('123abcABC')
  })

  it('should handle strings with only special characters', () => {
    expect(removeSpecialCharacters('!!!@@@###$$$')).toBe('')
    expect(removeSpecialCharacters('....,,,;;;')).toBe('')
  })

  it('should return an empty string if the input is an empty string', () => {
    expect(removeSpecialCharacters('')).toBe('')
  })

  it('should handle strings with spaces and various languages', () => {
    expect(removeSpecialCharacters('Bonjour, le monde!')).toBe(
      'Bonjour le monde',
    )
    expect(removeSpecialCharacters('¡Hola, mundo!')).toBe('Hola mundo')
    expect(removeSpecialCharacters('こんにちは、世界！')).toBe(
      'こんにちは世界',
    )
    expect(removeSpecialCharacters('Привет, мир!')).toBe('Привет мир')
  })
})

import { camelCaseToKebabCase } from '@/utils'

describe('camelCaseToKebabCase', () => {
  it('should convert camelCase to kebab-case', () => {
    expect(camelCaseToKebabCase('camelCase')).toBe('camel-case')
    expect(camelCaseToKebabCase('anotherExample')).toBe('another-example')
  })
})

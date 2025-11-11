import { toSnakeCase } from '@/utils'

describe('toSnakeCase', () => {
  it('should convert camelCase to snake_case', () => {
    expect(toSnakeCase('camelCase')).toBe('camel_case')
    expect(toSnakeCase('anotherExample')).toBe('another_example')
  })
})

import { splitWords } from '@/utils/string'

describe('splitWords', () => {
  it('returns empty array for empty input', () => {
    expect(splitWords('')).toEqual([])
  })

  it('splits on non-alphanumeric separators and lowercases by default', () => {
    const input = 'Hello, world!  Foo-bar_baz.qux'
    const result = splitWords(input)

    // All non-alphanumeric characters are treated as separators
    expect(result).toEqual(['hello', 'world', 'foo', 'bar', 'baz', 'qux'])
  })

  it('preserves case when preserveCase is true', () => {
    const input = 'HelloWorldAPI'
    const result = splitWords(input, { preserveCase: true })

    // camelCase splits only look at lower → Upper boundaries
    // "HelloWorldAPI" -> ["Hello", "World", "API"]
    expect(result).toEqual(['Hello', 'World', 'API'])
  })

  it('splits camelCase boundaries when not involving digits', () => {
    const input = 'helloWorld'
    const result = splitWords(input)

    expect(result).toEqual(['hello', 'world'])
  })

  it('does NOT split between consecutive uppercase letters (simple heuristic)', () => {
    const input = 'myXMLHttpRequest'
    const result = splitWords(input, { preserveCase: true })

    // Only truncate lower → Upper boundaries
    // "myXMLHttpRequest" -> ["my", "XMLHttp", "Request"]
    expect(result).toEqual(['my', 'XMLHttp', 'Request'])
  })

  it('keeps digits inside the same token when splitOnNumbers is false', () => {
    const input = 'foo123bar'
    const result = splitWords(input, { splitOnNumbers: false })

    // Not splitting on numbers
    expect(result).toEqual(['foo123bar'])
  })

  it('splits between letters and digits when splitOnNumbers is true', () => {
    const input = 'foo123bar'
    const result = splitWords(input, { splitOnNumbers: true })

    // "foo123bar" -> ["foo", "123", "bar"]
    expect(result).toEqual(['foo', '123', 'bar'])
  })

  it('handles a mixed camelCase + number string', () => {
    const input = 'helloWorldAPI42'
    const result = splitWords(input, {
      splitOnNumbers: true,
      preserveCase: true,
    })

    // Process (according to current implementation):
    // "helloWorldAPI42" -> ["hello", "World", "API", "42"]
    expect(result).toEqual(['hello', 'World', 'API', '42'])
  })

  it('lowercases tokens when preserveCase is false (default)', () => {
    const input = 'HelloWORLD42'
    const result = splitWords(input, { splitOnNumbers: true })

    // All tokens are lowercased
    expect(result).toEqual(['hello', 'world', '42'])
  })

  it('ignores tokens that are purely separators', () => {
    const input = '---___***'
    const result = splitWords(input)

    expect(result).toEqual([])
  })

  it('handles a single alphanumeric token with no splits', () => {
    const input = 'abc123'
    const resultNoNumbers = splitWords(input, { splitOnNumbers: false })
    const resultWithNumbers = splitWords(input, { splitOnNumbers: true })

    expect(resultNoNumbers).toEqual(['abc123'])
    expect(resultWithNumbers).toEqual(['abc', '123'])
  })
})

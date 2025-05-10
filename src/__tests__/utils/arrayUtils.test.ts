import { assignUUID, chunkArray, isAllZeroArray, uniqueArray } from '@/utils/arrayUtils'

describe('chunkArray', () => {
  it('should divide the array into chunks of the specified size', () => {
    const data = [1, 2, 3, 4, 5]
    const chunks = chunkArray(data, 2)
    expect(chunks).toEqual([[1, 2], [3, 4], [5]])
  })

  it('should return the entire array as a single chunk if size is 0', () => {
    const data = [1, 2, 3, 4, 5]
    const chunks = chunkArray(data, 0)
    expect(chunks).toEqual([[1, 2, 3, 4, 5]])
  })

  it('should return the entire array as a single chunk if size is negative', () => {
    const data = [1, 2, 3, 4, 5]
    const chunks = chunkArray(data, -1)
    expect(chunks).toEqual([[1, 2, 3, 4, 5]])
  })

  it('should return the entire array as a single chunk if size is a non-integer', () => {
    const data = [1, 2, 3, 4, 5]
    const chunks = chunkArray(data, 1.5)
    expect(chunks).toEqual([[1, 2, 3, 4, 5]])
  })

  it('should return the entire array as a single chunk if size is NaN', () => {
    const data = [1, 2, 3, 4, 5]
    const chunks = chunkArray(data, Number.NaN)
    expect(chunks).toEqual([[1, 2, 3, 4, 5]])
  })

  it('should handle an empty array', () => {
    const data: number[] = []
    const chunks = chunkArray(data, 2)
    expect(chunks).toEqual([])
  })
})

describe('uniqueArray', () => {
  it('should remove duplicate elements from an array', () => {
    const array = [1, 2, 3, 2, 4, 1]
    const unique = uniqueArray(array)
    expect(unique).toEqual([1, 2, 3, 4])
  })

  it('should return an empty array if the input array is empty', () => {
    const unique = uniqueArray([])
    expect(unique).toEqual([])
  })
})

describe('isAllZeroArray', () => {
  it('should handle non-array inputs', () => {
    // @ts-expect-error Testing invalid input
    const result = isAllZeroArray(123)
    expect(result).toBe(false)
  })

  it('should return true for an empty array', () => {
    const result = isAllZeroArray([])
    expect(result).toBe(true)
  })

  it('should return false if any element is not a number', () => {
    // @ts-expect-error Testing invalid input
    const result = isAllZeroArray(['a', 'b', 'c'])
    expect(result).toBe(false)
  })

  it('should return false if any element is NaN', () => {
    const result = isAllZeroArray([1, 2, 3, Number.NaN])
    expect(result).toBe(false)
  })

  it('should return false if one or more elements are not zero', () => {
    const result = isAllZeroArray([0, 0, 0, 1])
    expect(result).toBe(false)
  })

  it ('should return true if all elements are zero', () => {
    const result = isAllZeroArray([0, 0, 0, 0])
    expect(result).toBe(true)
  })
})

// Mock UUIDs for deterministic test output
const mockUUIDs = ['uuid-1', 'uuid-2', 'uuid-3']
let uuidIndex = 0

beforeEach(() => {
  uuidIndex = 0
  vi.stubGlobal('crypto', {
    randomUUID: vi.fn(() => mockUUIDs[uuidIndex++]),
  })
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('assignUUID', () => {
  it('should assign UUID to objects without id', () => {
    const input = [{ name: 'Alice' }, { name: 'Bob' }]
    const result = assignUUID(input)

    expect(result).toEqual([
      { name: 'Alice', id: 'uuid-1' },
      { name: 'Bob', id: 'uuid-2' },
    ])
  })

  it('should not overwrite existing ids', () => {
    const input = [{ name: 'Charlie', id: 'existing-id' }, { name: 'Dana' }]
    const result = assignUUID(input)

    expect(result).toEqual([
      { name: 'Charlie', id: 'existing-id' },
      { name: 'Dana', id: 'uuid-1' },
    ])
  })

  it('should return a new array and not mutate the original', () => {
    const input = [{ name: 'Eve' }]
    const result = assignUUID(input)

    expect(result).not.toBe(input)
    expect(input[0]).not.toHaveProperty('id')
    expect(result[0]).toHaveProperty('id', 'uuid-1')
  })
})

// v4‐UUID regex: 8-4-4-4-12, version “4” and variant 8/9/a/b
const V4_REGEX
  = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/

describe('assignUUID – fallback Math.random branch', () => {
  let originalCrypto: any

  beforeEach(() => {
    // Remove crypto.randomUUID
    originalCrypto = globalThis.crypto
    // eslint-disable-next-line ts/no-unsafe-assignment
    globalThis.crypto = undefined as any

    // Stub Math.random to always return 0 => predictable UUID
    vi.spyOn(Math, 'random').mockReturnValue(0)
  })

  afterEach(() => {
    // Restore
    // eslint-disable-next-line ts/no-unsafe-assignment
    globalThis.crypto = originalCrypto
    vi.restoreAllMocks()
  })

  it('falls back to Math.random and produces a valid v4 UUID', () => {
    const [res] = assignUUID(['test'])
    // when Math.random() === 0 for every hex,
    // template yields "00000000-0000-4000-8000-000000000000"
    expect(res.id).toBe('00000000-0000-4000-8000-000000000000')
    expect(res.value).toBe('test')
    // and it still matches the general v4 pattern:
    expect(res.id).toMatch(V4_REGEX)
  })

  it('wraps objects correctly in fallback mode', () => {
    const [res] = assignUUID([{ a: 1 }])
    expect(res.id).toBe('00000000-0000-4000-8000-000000000000')
    expect(res.a).toBe(1)
  })
})

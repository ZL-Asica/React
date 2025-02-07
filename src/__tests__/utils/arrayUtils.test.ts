import { chunkArray, uniqueArray } from '@/utils/arrayUtils'

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

import {
  deepClone,
  isEmpty,
  isObject,
  mergeObjects,
  omit,
  pick,
} from '@/utils/object'

describe('object Utilities', () => {
  it('deepClone should clone deeply nested objects', () => {
    const object = { a: 1, b: { c: 2 } }
    const cloned = deepClone(object)
    cloned.b.c = 3
    expect(object.b.c).toBe(2)
    expect(cloned.b.c).toBe(3)
  })

  it('isObject should correctly identify objects', () => {
    expect(isObject({})).toBe(true)
    expect(isObject([])).toBe(false)
    expect(isObject(null)).toBe(false)
  })

  it('mergeObjects should deeply merge objects', () => {
    const object1 = { a: 1, b: { c: 2 } }
    const object2 = { b: { d: 3 }, e: 4 }
    const merged = mergeObjects(object1, object2)
    expect(merged).toEqual({ a: 1, b: { c: 2, d: 3 }, e: 4 })
  })

  it('pick should select specified keys', () => {
    const object = { a: 1, b: 2, c: 3 }
    const picked = pick(object, ['a', 'c'])
    expect(picked).toEqual({ a: 1, c: 3 })
  })

  it('omit should remove specified keys', () => {
    const object = { a: 1, b: 2, c: 3 }
    const omitted = omit(object, ['b'])
    expect(omitted).toEqual({ a: 1, c: 3 })
  })

  it('should return true for null', () => {
    expect(isEmpty(null)).toBe(true)
  })

  it('should return true for empty strings and arrays', () => {
    expect(isEmpty('')).toBe(true)
    expect(isEmpty([])).toBe(true)
  })

  it('should return true for empty objects', () => {
    expect(isEmpty({})).toBe(true)
  })

  it('should return false for non-empty strings and arrays', () => {
    expect(isEmpty('hello')).toBe(false)
    expect(isEmpty([1, 2, 3])).toBe(false)
  })

  it('should return false for objects with keys', () => {
    expect(isEmpty({ a: 1 })).toBe(false)
  })

  it('should return false for non-object types', () => {
    expect(isEmpty(0)).toBe(false)
    expect(isEmpty(123)).toBe(false)
    expect(isEmpty(true)).toBe(false)
    expect(isEmpty(false)).toBe(false)
    expect(isEmpty(() => {})).toBe(false)
  })
})

import { isObject } from './isObject'

/**
 * Deeply merges two objects into a single object.
 *
 * @param {T} object1 - The first object.
 * @param {U} object2 - The second object.
 * @returns {T & U} A new object that is the result of deeply merging `object1` and `object2`.
 *
 * @example
 * ```tsx
 * const obj1 = { a: 1, b: { c: 2 } };
 * const obj2 = { b: { d: 3 }, e: 4 };
 * const merged = mergeObjects(obj1, obj2);
 * console.log(merged); // { a: 1, b: { c: 2, d: 3 }, e: 4 }
 * ```
 */
export const mergeObjects = <
  T extends Record<string, unknown>,
  U extends Record<string, unknown>,
>(
  object1: T,
  object2: U,
): T & U => {
  const result = { ...object1 } as T & U

  for (const key in object2) {
    if (isObject(object2[key]) && isObject(object1[key])) {
      result[key as keyof U] = mergeObjects(
        object1[key as keyof T] as Record<string, unknown>,
        object2[key as keyof U] as Record<string, unknown>,
      ) as unknown as (T & U)[keyof U]
    }
    else {
      result[key as keyof U] = object2[key as keyof U] as (T & U)[keyof U]
    }
  }

  return result
}

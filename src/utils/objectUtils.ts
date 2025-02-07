/**
 * Creates a deep clone of an object using `structuredClone`.
 *
 * @param {T} object - The object to deeply clone.
 * @returns {T} A deep clone of the object.
 *
 * @example
 * ```tsx
 * const original = { a: 1, b: { c: 2 } };
 * const clone = deepClone(original);
 * clone.b.c = 3;
 * console.log(original.b.c); // 2
 * ```
 */
export const deepClone = <T>(object: T): T => {
  return structuredClone(object)
}

/**
 * Determines whether a value is a non-array object.
 *
 * @param {unknown} value - The value to check.
 * @returns {boolean} `true` if the value is an object, otherwise `false`.
 *
 * @example
 * ```tsx
 * isObject({}); // true
 * isObject(null); // false
 * isObject([]); // false
 * ```
 */
export const isObject = (
  value: unknown = null,
): value is Record<string, unknown> => {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

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

/**
 * Picks specified keys from an object.
 *
 * @param {T} object - The object to pick properties from.
 * @param {Array<keyof T>} keys - The keys to pick.
 * @returns {Partial<T>} A new object containing only the specified keys.
 *
 * @example
 * ```tsx
 * const obj = { a: 1, b: 2, c: 3 };
 * const picked = pick(obj, ['a', 'c']);
 * console.log(picked); // { a: 1, c: 3 }
 * ```
 */
export const pick = <T extends Record<string, unknown>>(
  object: T,
  keys: Array<keyof T>,
): Partial<T> => {
  const result = {} as Partial<T>
  for (const key of keys) {
    if (key in object) {
      result[key] = object[key]
    }
  }
  return result
}

/**
 * Omits specified keys from an object.
 *
 * @param {T} object - The object to omit properties from.
 * @param {Array<keyof T>} keys - The keys to omit.
 * @returns {Partial<T>} A new object excluding the specified keys.
 *
 * @example
 * ```tsx
 * const obj = { a: 1, b: 2, c: 3 };
 * const omitted = omit(obj, ['b']);
 * console.log(omitted); // { a: 1, c: 3 }
 * ```
 */
export const omit = <T extends Record<string, unknown>>(
  object: T,
  keys: Array<keyof T>,
): Partial<T> => {
  const result = { ...object }
  for (const key of keys) {
    delete result[key]
  }
  return result
}

/**
 * Checks if a value is an empty object, array, string, or falsy value.
 *
 * @param {unknown} value - The value to check.
 * @returns {boolean} `true` if the value is empty or falsy, otherwise `false`.
 *
 * @example
 * ```tsx
 * isEmpty({}); // true
 * isEmpty([]); // true
 * isEmpty(''); // true
 * isEmpty(null); // true
 * isEmpty(0); // false
 * isEmpty(true); // false
 * ```
 */
export const isEmpty = (value: unknown): boolean => {
  // Covers `null` and `undefined`
  if (value === null) {
    return true
  }
  if (Array.isArray(value) || typeof value === 'string') {
    return value.length === 0
  }
  if (isObject(value)) {
    return Object.keys(value).length === 0
  }
  return false // Non-empty, non-object, and non-nullish types
}

/**
 * Helper type that, for an object type `T`, merges in an `id: string` property;
 * otherwise wraps a primitive `T` into `{ id: string; value: T }`.
 */
type WithID<T> = T extends object
  ? T & { id: string }
  : { id: string, value: T }

/**
 * Assigns a UUID to each element in the array.
 *
 * - If an object already has a string `id` property, that `id` is preserved.
 * - If an object lacks an `id`, the object is spread and a new `id` is added.
 * - For primitive values, each element is wrapped into `{ id: string; value: T }`.
 *
 * **Note:** When falling back (Next.js server side) to the Math.random–based UUID generator,
 * the IDs are **not** cryptographically secure. This utility is intended for
 * small arrays, loop indexes, UI‑keys, or other non‑critical identifiers.
 * Avoid using it for large volumes of data or any security‑sensitive contexts.
 *
 * @typeParam T
 *   The type of the array elements.
 *
 * @param array
 *   The input array of items to which UUIDs will be assigned.
 *
 * @returns
 *   An array of the same length where each element is either:
 *   - `T & { id: string }` (if `T` is an object),
 *   - or `{ id: string; value: T }` (if `T` is a primitive).
 *
 * @example
 * ```typescript
 * // Objects with and without existing IDs:
 * const objs = [{ id: 'abc', name: 'foo' }, { name: 'bar' }];
 * const withIds = assignUUID(objs);
 * // → [ { id: 'abc', name: 'foo' }, { id: '550e8400-e29b-41d4-a716-446655440000', name: 'bar' } ]
 * ```
 * @example
 * ```typescript
 * // Array of numbers:
 * const nums = [42, 7];
 * const wrappedNums = assignUUID(nums);
 * // → [ { id: '550e8400-e29b-41d4-a716-446655440001', value: 42 },
 * //     { id: '550e8400-e29b-41d4-a716-446655440002', value: 7 } ]
 * ```
 */
export function assignUUID<T extends object>(
  array: T[]
): Array<T & { id: string }>
export function assignUUID<T>(
  array: T[]
): Array<{ id: string, value: T }>

/**
 * Implementation of assignUUID.
 */
export function assignUUID<T>(array: T[]): WithID<T>[] {
  return array.map((item) => {
    // Case 1: object with existing string `id`
    if (
      item !== null
      && typeof item === 'object'
      && 'id' in item
      && typeof item.id === 'string'
    ) {
      return item as WithID<T>
    }

    let id: string
    if (globalThis.crypto !== undefined && globalThis.crypto.randomUUID !== undefined) {
      id = globalThis.crypto.randomUUID()
    }
    else {
      id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0
        const v = c === 'x' ? r : (r & 0x3) | 0x8
        return v.toString(16)
      })
    }

    // Case 2: object without `id` → spread in new `id`
    if (item !== null && typeof item === 'object') {
      return { ...(item as object), id } as WithID<T>
    }

    // Case 3: primitive → wrap into `{ id, value }`
    return { id, value: item } as WithID<T>
  })
}

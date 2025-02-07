'use client'

import { useState } from 'react'

/**
 * useArray
 *
 * A custom React hook for managing an array state with helper functions to modify it.
 *
 * @template T - The type of elements in the array.
 * @param {T[]} [initialArray] - The initial array state (defaults to an empty array).
 * @returns {{
 *   array: T[];
 *   set: React.Dispatch<React.SetStateAction<T[]>>;
 *   push: (item: T) => void;
 *   remove: (index: number) => void;
 *   clear: () => void;
 * }} An object containing:
 *   - `array`: The current state of the array.
 *   - `set`: Function to replace the entire array.
 *   - `push`: Function to add an item to the end of the array.
 *   - `remove`: Function to remove an item at a specific index.
 *   - `clear`: Function to clear the array.
 *
 * @example
 * ```tsx
 * import { useArray } from '@zl-asica/react';
 *
 * const MyComponent = () => {
 *   const { array, push, remove, clear } = useArray<number>([1, 2, 3]);
 *
 *   return (
 *     <div>
 *       <ul>
 *         {array.map((item, index) => (
 *           <li key={index}>
 *             {item}{' '}
 *             <button onClick={() => remove(index)}>Remove</button>
 *           </li>
 *         ))}
 *       </ul>
 *       <button onClick={() => push(array.length + 1)}>Add</button>
 *       <button onClick={clear}>Clear</button>
 *     </div>
 *   );
 * };
 * ```
 */
export const useArray = <T>(
  initialArray: T[] = [],
): {
  array: T[]
  set: React.Dispatch<React.SetStateAction<T[]>>
  push: (item: T) => void
  remove: (index: number) => void
  clear: () => void
} => {
  const [array, setArray] = useState<T[]>(initialArray)

  return {
    array,
    set: setArray,
    push: (item: T) => setArray(previousArray => [...previousArray, item]),
    remove: (index: number) =>
      setArray(previousArray =>
        previousArray.filter((_, index_) => index_ !== index),
      ),
    clear: () => setArray([]),
  }
}

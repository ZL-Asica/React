import { useArray } from '@/hooks/state'

import { act, renderHook } from '@testing-library/react'

describe('useArray', () => {
  it('should manage an array state', () => {
    const { result } = renderHook(() => useArray<number>([1, 2, 3]))

    expect(result.current.array).toEqual([1, 2, 3])

    act(() => result.current.push(4))
    expect(result.current.array).toEqual([1, 2, 3, 4])

    act(() => result.current.remove(1))
    expect(result.current.array).toEqual([1, 3, 4])

    act(() => result.current.clear())
    expect(result.current.array).toEqual([])
  })
})

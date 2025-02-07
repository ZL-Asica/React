import { useCounter } from '@/hooks/state'

import { act, renderHook } from '@testing-library/react'

describe('useCounter', () => {
  it('should initialize with the default value', () => {
    const { result } = renderHook(() => useCounter())
    expect(result.current.count).toBe(0)
  })

  it('should increment the counter', () => {
    const { result } = renderHook(() => useCounter(5))

    act(() => result.current.increment())
    expect(result.current.count).toBe(6)
  })

  it('should decrement the counter', () => {
    const { result } = renderHook(() => useCounter(5))

    act(() => result.current.decrement())
    expect(result.current.count).toBe(4)
  })

  it('should reset the counter', () => {
    const { result } = renderHook(() => useCounter(5))

    act(() => result.current.reset())
    expect(result.current.count).toBe(5)
  })
})

import { useThrottle } from '@/hooks/state'

import { act, renderHook } from '@testing-library/react'

describe('useThrottle', () => {
  vi.useFakeTimers()

  it('should execute the callback immediately on the first call', () => {
    const callback = vi.fn()
    const { result } = renderHook(() => useThrottle(callback, 1000))

    act(() => {
      result.current()
    })

    expect(callback).toHaveBeenCalledTimes(1)
  })

  it('should throttle subsequent calls within the delay period', () => {
    const callback = vi.fn()
    const { result } = renderHook(() => useThrottle(callback, 1000))

    act(() => {
      result.current()
      result.current()
      result.current()
    })

    expect(callback).toHaveBeenCalledTimes(1) // Only the first call should execute

    act(() => {
      vi.advanceTimersByTime(1000) // Advance time by the delay
      result.current()
    })

    expect(callback).toHaveBeenCalledTimes(2) // Now the callback can execute again
  })

  it('should pass arguments to the throttled function', () => {
    const callback = vi.fn()
    const { result } = renderHook(() => useThrottle(callback, 1000))

    act(() => {
      result.current('arg1', 'arg2')
    })

    expect(callback).toHaveBeenCalledWith('arg1', 'arg2')
  })

  it('should handle multiple invocations correctly over time', () => {
    const callback = vi.fn()
    const { result } = renderHook(() => useThrottle(callback, 1000))

    act(() => {
      result.current()
    })

    expect(callback).toHaveBeenCalledTimes(1)

    act(() => {
      vi.advanceTimersByTime(500) // Halfway through the delay
      result.current()
    })

    expect(callback).toHaveBeenCalledTimes(1) // Still throttled

    act(() => {
      vi.advanceTimersByTime(500) // Full delay elapsed
      result.current()
    })

    expect(callback).toHaveBeenCalledTimes(2) // Throttled period ended, second call executes
  })
})

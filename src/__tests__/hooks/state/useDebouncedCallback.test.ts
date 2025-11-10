import { act, renderHook } from '@testing-library/react'

import { useDebouncedCallback } from '@/hooks/state'

describe('useDebouncedCallback', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should debounce the callback execution', () => {
    const mockCallback = vi.fn()

    const { result } = renderHook(() =>
      useDebouncedCallback(mockCallback, 300),
    )

    act(() => {
      result.current('test1')
      result.current('test2')
      result.current('test3')
    })

    // Callback should not be called immediately
    expect(mockCallback).not.toHaveBeenCalled()

    // Advance timers to trigger the debounced function
    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(mockCallback).toHaveBeenCalledTimes(1)
    expect(mockCallback).toHaveBeenCalledWith('test3') // Last call wins
  })

  it('should handle multiple arguments', () => {
    const mockCallback = vi.fn((a: string, b: number) => `${a}-${b}`)

    const { result } = renderHook(() =>
      useDebouncedCallback(mockCallback, 300),
    )

    act(() => {
      result.current('example', 42)
    })

    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(mockCallback).toHaveBeenCalledTimes(1)
    expect(mockCallback).toHaveBeenCalledWith('example', 42)
  })

  it('should update the callback when dependencies change', () => {
    const mockCallback1 = vi.fn()
    const mockCallback2 = vi.fn()

    const { result, rerender } = renderHook(
      ({ callback, delay }) => useDebouncedCallback(callback, delay),
      {
        initialProps: { callback: mockCallback1, delay: 300 },
      },
    )

    act(() => {
      result.current('test1')
    })

    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(mockCallback1).toHaveBeenCalledWith('test1')
    expect(mockCallback2).not.toHaveBeenCalled()

    rerender({ callback: mockCallback2, delay: 300 })

    act(() => {
      result.current('test2')
    })

    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(mockCallback2).toHaveBeenCalledWith('test2')
    expect(mockCallback1).not.toHaveBeenCalledWith('test2')
  })

  it('should clear the timeout on unmount', () => {
    const mockCallback = vi.fn()

    const { result, unmount } = renderHook(() =>
      useDebouncedCallback(mockCallback, 300),
    )

    act(() => {
      result.current('test')
    })

    unmount()

    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(mockCallback).not.toHaveBeenCalled()
  })
})

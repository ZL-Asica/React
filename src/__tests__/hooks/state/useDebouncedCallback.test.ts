import { act, renderHook } from '@testing-library/react'
import { useDebouncedCallback } from '@/hooks/state'

describe('useDebouncedCallback', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('debounces the callback execution (last call wins)', () => {
    const mockCallback = vi.fn()

    const { result } = renderHook(() =>
      useDebouncedCallback<[string]>(mockCallback, 300),
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

  it('handles multiple arguments', () => {
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

  it('uses the default delay when not provided', () => {
    const mockCallback = vi.fn()

    const { result } = renderHook(() =>
      useDebouncedCallback<[string]>(mockCallback),
    )

    act(() => {
      result.current('default-delay')
    })

    // Default delay is 200ms, so at 199ms it should not fire yet
    act(() => {
      vi.advanceTimersByTime(199)
    })
    expect(mockCallback).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(1)
    })
    expect(mockCallback).toHaveBeenCalledTimes(1)
    expect(mockCallback).toHaveBeenCalledWith('default-delay')
  })

  it('updates the callback when it changes', () => {
    const mockCallback1 = vi.fn()
    const mockCallback2 = vi.fn()

    const { result, rerender } = renderHook(
      ({ callback, delay }) => useDebouncedCallback(callback, delay),
      {
        initialProps: { callback: mockCallback1, delay: 300 },
      },
    )

    // First callback
    act(() => {
      result.current('test1')
    })

    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(mockCallback1).toHaveBeenCalledTimes(1)
    expect(mockCallback1).toHaveBeenCalledWith('test1')
    expect(mockCallback2).not.toHaveBeenCalled()

    // Update callback function
    rerender({ callback: mockCallback2, delay: 300 })

    act(() => {
      result.current('test2')
    })

    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(mockCallback2).toHaveBeenCalledTimes(1)
    expect(mockCallback2).toHaveBeenCalledWith('test2')
    expect(mockCallback1).not.toHaveBeenCalledWith('test2')
  })

  it('clears the timeout on unmount (pending call does not fire)', () => {
    const mockCallback = vi.fn()

    const { result, unmount } = renderHook(() =>
      useDebouncedCallback<[string]>(mockCallback, 300),
    )

    act(() => {
      result.current('test')
    })

    // Unmount before the delay elapses
    unmount()

    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(mockCallback).not.toHaveBeenCalled()
  })
})

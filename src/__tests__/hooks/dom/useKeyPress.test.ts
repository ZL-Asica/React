import { act, renderHook } from '@testing-library/react'
import { useKeyPress } from '@/hooks/dom'

describe('useKeyPress', () => {
  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('returns false initially', () => {
    const { result } = renderHook(() => useKeyPress('a'))
    expect(result.current).toBe(false)
  })

  it('sets true on keydown of target key and false on keyup', () => {
    const { result } = renderHook(() => useKeyPress('a'))

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }))
    })
    expect(result.current).toBe(true)

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keyup', { key: 'a' }))
    })
    expect(result.current).toBe(false)
  })

  it('ignores non-matching keys', () => {
    const { result } = renderHook(() => useKeyPress('a'))

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'b' }))
    })
    expect(result.current).toBe(false)

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keyup', { key: 'b' }))
    })
    expect(result.current).toBe(false)
  })

  it('respects debounce for key events when delay > 0', () => {
    vi.useFakeTimers()

    const { result } = renderHook(() => useKeyPress('a', 200))

    // keydown will not immediately set to true
    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }))
    })
    expect(result.current).toBe(false)

    act(() => {
      vi.advanceTimersByTime(199)
    })
    expect(result.current).toBe(false)

    act(() => {
      vi.advanceTimersByTime(1)
    })
    expect(result.current).toBe(true)

    // Trigger keyup, also affected by debounce
    act(() => {
      window.dispatchEvent(new KeyboardEvent('keyup', { key: 'a' }))
    })
    // Timers haven't run yet, still true
    expect(result.current).toBe(true)

    act(() => {
      vi.runAllTimers()
    })
    expect(result.current).toBe(false)
  })

  it('responds to targetKey changes across re-renders', () => {
    const { result, rerender } = renderHook(
      ({ keyName, debounce }) => useKeyPress(keyName, debounce),
      {
        initialProps: { keyName: 'a', debounce: 0 },
      },
    )

    // Initially listening for 'a'
    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }))
    })
    expect(result.current).toBe(true)

    // Release 'a'
    act(() => {
      window.dispatchEvent(new KeyboardEvent('keyup', { key: 'a' }))
    })
    expect(result.current).toBe(false)

    // Switch to listening for 'b'
    rerender({ keyName: 'b', debounce: 0 })

    // Pressing 'a' no longer works
    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }))
    })
    expect(result.current).toBe(false)

    // Pressing 'b' works
    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'b' }))
    })
    expect(result.current).toBe(true)

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keyup', { key: 'b' }))
    })
    expect(result.current).toBe(false)
  })
})

import { act, renderHook } from '@testing-library/react'
import { usePolling } from '@/hooks/async'

describe('usePolling', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('executes the callback periodically', () => {
    const callback = vi.fn()
    renderHook(() => usePolling(callback, 1000))

    expect(callback).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(callback).toHaveBeenCalledTimes(1)

    act(() => {
      vi.advanceTimersByTime(2000)
    })
    expect(callback).toHaveBeenCalledTimes(3)
  })

  it('does not start polling when delay is null', () => {
    const callback = vi.fn()
    renderHook(() => usePolling(callback, null))

    act(() => {
      vi.advanceTimersByTime(3000)
    })

    expect(callback).not.toHaveBeenCalled()
  })

  it('stops polling when delay becomes null', () => {
    const callback = vi.fn()

    const { rerender } = renderHook(
      ({ delay }) => usePolling(callback, delay),
      {
        initialProps: { delay: 1000 as number | null },
      },
    )

    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(callback).toHaveBeenCalledTimes(1)

    rerender({ delay: null })

    act(() => {
      vi.advanceTimersByTime(2000)
    })
    expect(callback).toHaveBeenCalledTimes(1)
  })

  it('stops polling when unmounted', () => {
    const callback = vi.fn()
    const { unmount } = renderHook(() => usePolling(callback, 1000))

    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(callback).toHaveBeenCalledTimes(1)

    unmount()

    act(() => {
      vi.advanceTimersByTime(2000)
    })
    expect(callback).toHaveBeenCalledTimes(1)
  })

  it('uses the latest callback reference', () => {
    const firstCallback = vi.fn()
    const secondCallback = vi.fn()

    const { rerender } = renderHook(
      ({ cb }) => usePolling(cb, 1000),
      {
        initialProps: { cb: firstCallback },
      },
    )

    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(firstCallback).toHaveBeenCalledTimes(1)
    expect(secondCallback).toHaveBeenCalledTimes(0)

    rerender({ cb: secondCallback })

    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(firstCallback).toHaveBeenCalledTimes(1)
    expect(secondCallback).toHaveBeenCalledTimes(1)
  })
})

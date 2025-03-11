import { usePolling } from '@/hooks/async'

import { act, renderHook } from '@testing-library/react'

vi.useFakeTimers()

describe('usePolling', () => {
  it('should execute the callback periodically', () => {
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

  it('should stop polling when delay is null', () => {
    const callback = vi.fn()
    const { rerender } = renderHook(
      ({ delay }) => usePolling(callback, delay),
      {
        initialProps: { delay: 1000 },
      },
    )

    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(callback).toHaveBeenCalledTimes(1)

    // @ts-expect-error: Ignore type error for testing purposes
    rerender({ delay: null })

    act(() => {
      vi.advanceTimersByTime(2000)
    })
    expect(callback).toHaveBeenCalledTimes(1)
  })

  it('should immediately stop polling when unmounted', () => {
    const callback = vi.fn()
    const { unmount } = renderHook(() => usePolling(callback, 1000))

    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(callback).toHaveBeenCalledTimes(1)

    // Unmount the hook
    unmount()

    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(callback).toHaveBeenCalledTimes(1)
  })
})

import { useTimeout } from '@/hooks/state'
import { renderHook } from '@testing-library/react'

vi.useFakeTimers()

describe('useTimeout', () => {
  it('should call callback after the delay', () => {
    const callback = vi.fn()
    renderHook(() => useTimeout(callback, 1000))

    vi.advanceTimersByTime(1000)
    expect(callback).toHaveBeenCalledTimes(1)
  })

  it('should clear timeout on unmount', () => {
    const callback = vi.fn()
    const { unmount } = renderHook(() => useTimeout(callback, 1000))

    unmount()
    vi.advanceTimersByTime(1000)
    expect(callback).not.toHaveBeenCalled()
  })

  it('should reset timeout if delay changes', () => {
    const callback = vi.fn()
    const { rerender } = renderHook(({ delay }) => useTimeout(callback, delay), {
      initialProps: { delay: 1000 },
    })

    vi.advanceTimersByTime(500)
    rerender({ delay: 2000 }) // Change delay

    vi.advanceTimersByTime(1500) // Total elapsed 2000ms (500ms + 1500ms)
    expect(callback).not.toHaveBeenCalled() // Callback should not run because timeout reset

    vi.advanceTimersByTime(500) // 2000ms reached
    expect(callback).toHaveBeenCalledTimes(1)
  })

  it('should run callback immediately if delay is 0', () => {
    const callback = vi.fn()
    renderHook(() => useTimeout(callback, 0))

    expect(callback).toHaveBeenCalledTimes(1)
  })

  it('should run callback only once if delay is negative', () => {
    const callback = vi.fn()
    renderHook(() => useTimeout(callback, -1000))

    expect(callback).toHaveBeenCalledTimes(1)
  })
})

import { act, renderHook } from '@testing-library/react'
import { useAsyncPolling } from '@/hooks/async'

describe('useAsyncPolling', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('polls an async function and updates result', async () => {
    const asyncFn = vi
      .fn<() => Promise<string>>()
      .mockResolvedValueOnce('first')
      .mockResolvedValueOnce('second')

    const { result } = renderHook(() =>
      useAsyncPolling<string>(asyncFn, 1000, { immediate: true }),
    )

    // Flush the initial "immediate" call (no timers involved, just promises)
    await act(async () => {
      await Promise.resolve()
    })

    expect(asyncFn).toHaveBeenCalledTimes(1)
    expect(result.current.result).toBe('first')

    // Advance the polling interval and flush the second async call
    await act(async () => {
      vi.advanceTimersByTime(1000)
      await Promise.resolve()
    })

    expect(asyncFn).toHaveBeenCalledTimes(2)
    expect(result.current.result).toBe('second')
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('stops polling when delay is null', async () => {
    const asyncFn = vi.fn<() => Promise<string>>().mockResolvedValue('value')

    const { rerender } = renderHook(
      ({ delay }) =>
        useAsyncPolling<string>(asyncFn, delay, { immediate: false }),
      {
        initialProps: { delay: 1000 as number | null },
      },
    )

    // First tick should trigger one async call
    await act(async () => {
      vi.advanceTimersByTime(1000)
      await Promise.resolve()
    })

    expect(asyncFn).toHaveBeenCalledTimes(1)

    // Now stop polling
    rerender({ delay: null })

    await act(async () => {
      vi.advanceTimersByTime(2000)
      await Promise.resolve()
    })

    // No further calls after delay becomes null
    expect(asyncFn).toHaveBeenCalledTimes(1)
  })

  it('defaults to immediate=false when options are not provided', async () => {
    const asyncFn = vi.fn<() => Promise<string>>().mockResolvedValue('value')

    const { result } = renderHook(() =>
      // No options argument → options is undefined → options?.immediate ?? false → false
      useAsyncPolling<string>(asyncFn, 1000),
    )

    // Should NOT run immediately
    expect(asyncFn).not.toHaveBeenCalled()
    expect(result.current.loading).toBe(false)

    // First polling tick should trigger the async call
    await act(async () => {
      vi.advanceTimersByTime(1000)
      await Promise.resolve()
    })

    expect(asyncFn).toHaveBeenCalledTimes(1)
  })
})

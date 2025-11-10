import { renderHook } from '@testing-library/react'
import { useAsyncEffect } from '@/hooks/async'

describe('useAsyncEffect', () => {
  it('calls effect with an AbortSignal on mount', () => {
    const effect = vi.fn()

    renderHook(() => useAsyncEffect(effect, []))

    expect(effect).toHaveBeenCalledTimes(1)
    const signal = effect.mock.calls[0][0] as AbortSignal

    expect(signal).toBeInstanceOf(AbortSignal)
    expect(signal.aborted).toBe(false)
  })

  it('aborts the signal on unmount', () => {
    let capturedSignal: AbortSignal | null = null

    const effect = vi.fn((signal: AbortSignal) => {
      capturedSignal = signal
    })

    const { unmount } = renderHook(() => useAsyncEffect(effect, []))

    expect(capturedSignal).not.toBeNull()
    expect(capturedSignal!.aborted).toBe(false)

    unmount()

    expect(capturedSignal!.aborted).toBe(true)
  })

  it('aborts the previous signal and creates a new one when deps change', () => {
    const signals: AbortSignal[] = []

    const effect = vi.fn((signal: AbortSignal) => {
      signals.push(signal)
    })

    const { rerender } = renderHook(
      ({ dep }) => useAsyncEffect(effect, [dep]),
      {
        initialProps: { dep: 1 },
      },
    )

    // First run
    expect(signals).toHaveLength(1)
    const firstSignal = signals[0]
    expect(firstSignal.aborted).toBe(false)

    // Change dependency → cleanup + new effect run
    rerender({ dep: 2 })

    expect(signals).toHaveLength(2)
    const secondSignal = signals[1]

    // First signal should be aborted by cleanup
    expect(firstSignal.aborted).toBe(true)
    // Second signal should be a fresh, non-aborted one
    expect(secondSignal).toBeInstanceOf(AbortSignal)
    expect(secondSignal.aborted).toBe(false)
  })
})

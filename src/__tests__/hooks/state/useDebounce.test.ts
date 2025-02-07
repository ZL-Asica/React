import { useDebounce } from '@/hooks/state'

import { act, renderHook } from '@testing-library/react'

vi.useFakeTimers()

describe('useDebounce', () => {
  it('should debounce the value', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 500 },
      },
    )

    expect(result.current).toBe('initial')

    rerender({ value: 'updated', delay: 500 })

    act(() => {
      vi.advanceTimersByTime(250)
    })
    expect(result.current).toBe('initial') // Value hasn't changed yet

    act(() => {
      vi.advanceTimersByTime(250)
    })
    expect(result.current).toBe('updated') // Value has changed
  })
})

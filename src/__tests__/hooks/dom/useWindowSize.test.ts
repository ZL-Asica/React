import { act, renderHook } from '@testing-library/react'

import { useWindowSize } from '@/hooks/dom'

describe('useWindowSize', () => {
  it('should return the current window size', () => {
    window.innerWidth = 1024
    window.innerHeight = 768

    const { result } = renderHook(() => useWindowSize())
    expect(result.current).toEqual({ width: 1024, height: 768 })
  })

  it('should update size on window resize', () => {
    const { result } = renderHook(() => useWindowSize())

    window.innerWidth = 800
    window.innerHeight = 600

    act(() => {
      globalThis.dispatchEvent(new Event('resize'))
    })

    expect(result.current).toEqual({ width: 800, height: 600 })
  })
})

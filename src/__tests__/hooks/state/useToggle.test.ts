import { act, renderHook } from '@testing-library/react'

import { useToggle } from '@/hooks/state'

describe('useToggle', () => {
  it('should initialize with false by default', () => {
    const { result } = renderHook(() => useToggle())
    expect(result.current[0]).toBe(false)
  })

  it('should toggle the state', () => {
    const { result } = renderHook(() => useToggle())
    const [, toggle] = result.current

    act(() => {
      toggle()
    })
    expect(result.current[0]).toBe(true)

    act(() => {
      toggle()
    })
    expect(result.current[0]).toBe(false)
  })

  it('should initialize with a custom value', () => {
    const { result } = renderHook(() => useToggle(true))
    expect(result.current[0]).toBe(true)
  })
})

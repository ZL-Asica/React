import { act, renderHook } from '@testing-library/react'

import { useBoolean } from '@/hooks/state'

describe('useBoolean', () => {
  it('should initialize with the default value', () => {
    const { result } = renderHook(() => useBoolean(true))
    expect(result.current.value).toBe(true)
  })

  it('should toggle the value', () => {
    const { result } = renderHook(() => useBoolean(false))
    const { setTrue, setFalse } = result.current

    act(() => {
      setTrue()
    })
    expect(result.current.value).toBe(true)

    act(() => {
      setFalse()
    })
    expect(result.current.value).toBe(false)
  })

  it('should set the value explicitly', () => {
    const { result } = renderHook(() => useBoolean(false))
    const { setTrue, setFalse } = result.current

    act(() => {
      setTrue()
    })
    expect(result.current.value).toBe(true)

    act(() => {
      setFalse()
    })
    expect(result.current.value).toBe(false)
  })
})

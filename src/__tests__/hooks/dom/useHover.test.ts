import { useHover } from '@/hooks/dom'

import { act, renderHook } from '@testing-library/react'

describe('useHover', () => {
  it('should detect hover state', () => {
    const element = document.createElement('div')
    const reference = { current: element }

    const { result } = renderHook(() => useHover(reference))
    expect(result.current).toBe(false)

    act(() => {
      element.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }))
    })
    expect(result.current).toBe(true)

    act(() => {
      element.dispatchEvent(new MouseEvent('mouseout', { bubbles: true }))
    })
    expect(result.current).toBe(false)
  })
})

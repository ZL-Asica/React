import { useKeyPress } from '@/hooks/dom'

import { act, renderHook } from '@testing-library/react'

describe('useKeyPress', () => {
  it('should return false initially', () => {
    const { result } = renderHook(() => useKeyPress('Enter'))
    expect(result.current).toBe(false)
  })

  it('should return true when the target key is pressed', () => {
    const { result } = renderHook(() => useKeyPress('Enter'))

    act(() => {
      const keydownEvent = new KeyboardEvent('keydown', { key: 'Enter' })
      globalThis.dispatchEvent(keydownEvent)
    })

    expect(result.current).toBe(true)
  })

  it('should return false when the target key is released', () => {
    const { result } = renderHook(() => useKeyPress('Enter'))

    act(() => {
      const keydownEvent = new KeyboardEvent('keydown', { key: 'Enter' })
      globalThis.dispatchEvent(keydownEvent)
    })

    expect(result.current).toBe(true)

    act(() => {
      const keyupEvent = new KeyboardEvent('keyup', { key: 'Enter' })
      globalThis.dispatchEvent(keyupEvent)
    })

    expect(result.current).toBe(false)
  })

  it('should not react to non-target keys', () => {
    const { result } = renderHook(() => useKeyPress('Enter'))

    act(() => {
      const keydownEvent = new KeyboardEvent('keydown', { key: 'Space' })
      globalThis.dispatchEvent(keydownEvent)
    })

    expect(result.current).toBe(false)
  })
})

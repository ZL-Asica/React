import { useClickOutside } from '@/hooks/dom'

import { renderHook } from '@testing-library/react'

describe('useClickOutside', () => {
  it('should trigger the callback when clicking outside the ref element', () => {
    const callback = vi.fn()
    const reference = { current: document.createElement('div') }

    document.body.append(reference.current)

    renderHook(() => useClickOutside(reference, callback))

    document.body.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
    expect(callback).toHaveBeenCalledTimes(1)

    reference.current?.dispatchEvent(
      new MouseEvent('mousedown', { bubbles: true }),
    )
    expect(callback).toHaveBeenCalledTimes(1)
  })
})

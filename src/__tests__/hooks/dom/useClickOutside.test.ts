import type { RefObject } from 'react'
import { renderHook } from '@testing-library/react'

import { useClickOutside } from '@/hooks/dom'

describe('useClickOutside', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it('calls handler when clicking outside the referenced element', () => {
    const callback = vi.fn()
    const element = document.createElement('div')
    const reference: RefObject<HTMLElement | null> = { current: element }

    document.body.append(element)

    renderHook(() => useClickOutside(reference, callback))

    // click body (outside element)
    document.body.dispatchEvent(
      new MouseEvent('mousedown', { bubbles: true }),
    )

    expect(callback).toHaveBeenCalledTimes(1)
  })

  it('does not call handler when clicking inside the referenced element', () => {
    const callback = vi.fn()
    const element = document.createElement('div')
    const reference: RefObject<HTMLElement | null> = { current: element }

    document.body.append(element)

    renderHook(() => useClickOutside(reference, callback))

    // outside click triggers once
    document.body.dispatchEvent(
      new MouseEvent('mousedown', { bubbles: true }),
    )
    expect(callback).toHaveBeenCalledTimes(1)

    // inside click should not trigger again
    element.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
    expect(callback).toHaveBeenCalledTimes(1)
  })

  it('does nothing when reference.current is null (covers !element branch)', () => {
    const callback = vi.fn()
    const reference: RefObject<HTMLElement | null> = { current: null }

    renderHook(() => useClickOutside(reference, callback))

    document.body.dispatchEvent(
      new MouseEvent('mousedown', { bubbles: true }),
    )

    // This will hit the branch:
    // const element = reference.current  // null
    // if (!element) return
    expect(callback).not.toHaveBeenCalled()
  })

  it('supports touchstart events', () => {
    const callback = vi.fn()
    const element = document.createElement('div')
    const reference: RefObject<HTMLElement | null> = { current: element }

    document.body.append(element)

    renderHook(() => useClickOutside(reference, callback))

    // Trigger touchstart outside the element
    document.body.dispatchEvent(
      new Event('touchstart', { bubbles: true }),
    )

    expect(callback).toHaveBeenCalledTimes(1)

    // Trigger touchstart inside the element should not trigger handler
    element.dispatchEvent(new Event('touchstart', { bubbles: true }))
    expect(callback).toHaveBeenCalledTimes(1)
  })

  it('respects debounce delay when provided', () => {
    vi.useFakeTimers()

    const callback = vi.fn()
    const element = document.createElement('div')
    const reference: RefObject<HTMLElement | null> = { current: element }

    document.body.append(element)

    renderHook(() => useClickOutside(reference, callback, 200))

    // Rapidly click multiple times
    document.body.dispatchEvent(
      new MouseEvent('mousedown', { bubbles: true }),
    )
    document.body.dispatchEvent(
      new MouseEvent('mousedown', { bubbles: true }),
    )
    document.body.dispatchEvent(
      new MouseEvent('mousedown', { bubbles: true }),
    )

    // Because of the debounce, the handler should not be called immediately
    expect(callback).not.toHaveBeenCalled()

    // The handler should not be called within 199ms
    vi.advanceTimersByTime(199)
    expect(callback).not.toHaveBeenCalled()

    // The handler should be called at 200ms
    vi.advanceTimersByTime(1)
    expect(callback).toHaveBeenCalledTimes(1)
  })
})

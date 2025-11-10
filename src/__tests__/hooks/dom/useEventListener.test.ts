import { act, renderHook } from '@testing-library/react'

import { useEventListener } from '@/hooks/dom'

describe('useEventListener', () => {
  it('should attach and detach event listeners', () => {
    const element = document.createElement('div')
    const handler = vi.fn()

    const addSpy = vi.spyOn(element, 'addEventListener')
    const removeSpy = vi.spyOn(element, 'removeEventListener')

    const { unmount } = renderHook(() =>
      useEventListener('click', handler, { current: element }),
    )

    // Trigger the event to verify the handler is called
    const clickEvent = new MouseEvent('click')
    element.dispatchEvent(clickEvent)

    expect(handler).toHaveBeenCalledWith(clickEvent)
    expect(addSpy).toHaveBeenCalledWith(
      'click',
      expect.any(Function),
      undefined,
    )

    unmount()

    expect(removeSpy).toHaveBeenCalledWith(
      'click',
      expect.any(Function),
      undefined,
    )
  })

  it('should handle null element gracefully', () => {
    const handler = vi.fn()
    const { unmount } = renderHook(() =>
      useEventListener('click', handler, undefined),
    )

    // No listener should be attached or removed
    expect(handler).not.toHaveBeenCalled()
    unmount()
  })

  it('should handle debounce functionality correctly', () => {
    vi.useFakeTimers()
    const element = document.createElement('div')
    const handler = vi.fn()

    const { unmount } = renderHook(() =>
      useEventListener('click', handler, { current: element }, undefined, 200),
    )

    // Trigger the event multiple times
    const clickEvent = new MouseEvent('click')
    act(() => {
      element.dispatchEvent(clickEvent)
      element.dispatchEvent(clickEvent)
      element.dispatchEvent(clickEvent)
    })

    // Handler should not be called immediately due to debounce
    expect(handler).not.toHaveBeenCalled()

    // Fast-forward time to trigger the debounce
    act(() => {
      vi.advanceTimersByTime(200)
    })

    expect(handler).toHaveBeenCalledTimes(1)
    expect(handler).toHaveBeenCalledWith(clickEvent)

    unmount()
    vi.useRealTimers()
  })

  it('should update handler when it changes', () => {
    const element = document.createElement('div')
    let handler = vi.fn()

    const { rerender } = renderHook(() =>
      useEventListener('click', handler, { current: element }),
    )

    // Trigger the event with the initial handler
    const clickEvent1 = new MouseEvent('click')
    element.dispatchEvent(clickEvent1)
    expect(handler).toHaveBeenCalledWith(clickEvent1)

    // Update the handler
    handler = vi.fn()
    rerender()

    // Trigger the event with the updated handler
    const clickEvent2 = new MouseEvent('click')
    element.dispatchEvent(clickEvent2)
    expect(handler).toHaveBeenCalledWith(clickEvent2)
  })

  it('should support default window target', () => {
    const handler = vi.fn()

    const addSpy = vi.spyOn(window, 'addEventListener')

    const removeSpy = vi.spyOn(window, 'removeEventListener')

    const { unmount } = renderHook(() => useEventListener('resize', handler))

    // Trigger the event
    const resizeEvent = new Event('resize')
    act(() => {
      window.dispatchEvent(resizeEvent)
    })

    expect(handler).toHaveBeenCalledWith(resizeEvent)
    expect(addSpy).toHaveBeenCalledWith(
      'resize',
      expect.any(Function),
      undefined,
    )

    unmount()

    expect(removeSpy).toHaveBeenCalledWith(
      'resize',
      expect.any(Function),
      undefined,
    )
  })
})

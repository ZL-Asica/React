import { act, renderHook } from '@testing-library/react'
import { useEventListener } from '@/hooks/dom'

describe('useEventListener', () => {
  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('attaches and detaches event listeners on a provided element', () => {
    const element = document.createElement('div')
    const handler = vi.fn()

    const addSpy = vi.spyOn(element, 'addEventListener')
    const removeSpy = vi.spyOn(element, 'removeEventListener')

    const { unmount } = renderHook(() =>
      useEventListener('click', handler, { current: element }),
    )

    const clickEvent = new MouseEvent('click')
    element.dispatchEvent(clickEvent)

    expect(handler).toHaveBeenCalledTimes(1)
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

  it('uses window as the default target when no element ref is provided', () => {
    const handler = vi.fn()

    const addSpy = vi.spyOn(window, 'addEventListener')
    const removeSpy = vi.spyOn(window, 'removeEventListener')

    const { unmount } = renderHook(() =>
      useEventListener('resize', handler),
    )

    const resizeEvent = new Event('resize')

    act(() => {
      window.dispatchEvent(resizeEvent)
    })

    expect(handler).toHaveBeenCalledTimes(1)
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

  it('handles a null element ref gracefully (no listener attached)', () => {
    const handler = vi.fn()

    const { unmount } = renderHook(() =>
      // @ts-expect-error - test-only null ref
      useEventListener('click', handler, { current: null }),
    )

    const event = new MouseEvent('click')

    // Should not crash and should not call handler
    document.dispatchEvent(event)

    expect(handler).not.toHaveBeenCalled()

    unmount()
  })

  it('does nothing when the target does not support addEventListener', () => {
    const handler = vi.fn()

    // Intentionally pass an object without addEventListener
    const badTarget: any = {}

    // eslint-disable-next-line ts/no-unsafe-assignment
    const ref = { current: badTarget }

    expect(() => {
      const { unmount } = renderHook(() =>
        useEventListener('click', handler, ref),
      )
      unmount()
    }).not.toThrow()

    expect(handler).not.toHaveBeenCalled()
  })

  it('supports debounce: handler is called only once after the delay', () => {
    vi.useFakeTimers()

    const element = document.createElement('div')
    const handler = vi.fn()

    const { unmount } = renderHook(() =>
      useEventListener('click', handler, { current: element }, undefined, 200),
    )

    const clickEvent = new MouseEvent('click')

    act(() => {
      element.dispatchEvent(clickEvent)
      element.dispatchEvent(clickEvent)
      element.dispatchEvent(clickEvent)
    })

    // Due to debounce, handler has not been called yet
    expect(handler).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(200)
    })

    expect(handler).toHaveBeenCalledTimes(1)
    expect(handler).toHaveBeenCalledWith(clickEvent)

    unmount()
  })

  it('uses the latest handler when it changes (listener may be rebound)', () => {
    const element = document.createElement('div')
    const firstHandler = vi.fn()
    const secondHandler = vi.fn()

    const addSpy = vi.spyOn(element, 'addEventListener')
    const removeSpy = vi.spyOn(element, 'removeEventListener')

    const { rerender, unmount } = renderHook(
      ({ handler }) =>
        useEventListener('click', handler, { current: element }),
      {
        initialProps: { handler: firstHandler },
      },
    )

    const clickEvent1 = new MouseEvent('click')
    element.dispatchEvent(clickEvent1)

    expect(firstHandler).toHaveBeenCalledTimes(1)
    expect(firstHandler).toHaveBeenCalledWith(clickEvent1)

    // Update handler prop and rerender
    rerender({ handler: secondHandler })

    const clickEvent2 = new MouseEvent('click')
    element.dispatchEvent(clickEvent2)

    // Old handler should not be called again
    expect(firstHandler).toHaveBeenCalledTimes(1)
    // New handler should be invoked
    expect(secondHandler).toHaveBeenCalledTimes(1)
    expect(secondHandler).toHaveBeenCalledWith(clickEvent2)

    // In this kind of test case (where ref object will recreate a new one every time)
    // unbinding and rebinding will occur:
    // - Initial render: add 1
    // - Rerender: cleanup remove 1 + add 2
    expect(addSpy).toHaveBeenCalledTimes(2)
    expect(removeSpy).toHaveBeenCalledTimes(1)

    unmount()

    // Last remove the listener on unmount
    expect(removeSpy).toHaveBeenCalledTimes(2)
  })
})

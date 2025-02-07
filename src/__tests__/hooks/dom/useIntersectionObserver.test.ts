import type { RefObject } from 'react'

import { useIntersectionObserver } from '@/hooks/dom'
import { act, renderHook } from '@testing-library/react'

const mockIntersectionObserver = () => {
  const observeMock = vi.fn()
  const unobserveMock = vi.fn()
  const disconnectMock = vi.fn()

  globalThis.IntersectionObserver = vi.fn(() => ({
    observe: observeMock,
    unobserve: unobserveMock,
    disconnect: disconnectMock,
  })) as unknown as typeof IntersectionObserver

  return { observeMock, unobserveMock, disconnectMock }
}

describe('useIntersectionObserver', () => {
  it('should observe and unobserve the element', () => {
    const { observeMock, unobserveMock } = mockIntersectionObserver()

    const reference = { current: document.createElement('div') }
    const { unmount } = renderHook(() => useIntersectionObserver(reference))

    expect(observeMock).toHaveBeenCalledWith(reference.current)
    expect(unobserveMock).not.toHaveBeenCalled()

    unmount()
    expect(unobserveMock).toHaveBeenCalledWith(reference.current)
  })

  it('should handle ref being null', () => {
    const { observeMock, unobserveMock } = mockIntersectionObserver()

    const reference = { current: null } as unknown as RefObject<HTMLElement>
    const { unmount } = renderHook(() => useIntersectionObserver(reference))

    expect(observeMock).not.toHaveBeenCalled()
    expect(unobserveMock).not.toHaveBeenCalled()

    unmount()
    expect(unobserveMock).not.toHaveBeenCalled()
  })

  it('should update isIntersecting when the observer triggers', () => {
    const { observeMock } = mockIntersectionObserver()

    const reference = { current: document.createElement('div') }
    let callback: IntersectionObserverCallback = () => {};
    (globalThis.IntersectionObserver as ReturnType<typeof vi.fn>).mockImplementation(
      (callback_: IntersectionObserverCallback) => {
        callback = callback_
        return {
          observe: observeMock,
          unobserve: vi.fn(),
          disconnect: vi.fn(),
        }
      },
    )

    const { result } = renderHook(() => useIntersectionObserver(reference))

    act(() => {
      callback(
        [{ isIntersecting: true }] as IntersectionObserverEntry[],
        {} as IntersectionObserver,
      )
    })
    expect(result.current).toBe(true)

    act(() => {
      callback(
        [{ isIntersecting: false }] as IntersectionObserverEntry[],
        {} as IntersectionObserver,
      )
    })
    expect(result.current).toBe(false)
  })

  it('should pass options to IntersectionObserver', () => {
    const options = { threshold: 0.5 }
    const { observeMock } = mockIntersectionObserver()

    const reference = { current: document.createElement('div') }
    renderHook(() => useIntersectionObserver(reference, options))

    expect(globalThis.IntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      options,
    )
    expect(observeMock).toHaveBeenCalledWith(reference.current)
  })
})

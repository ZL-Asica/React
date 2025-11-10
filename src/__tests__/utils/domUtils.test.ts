import {
  backToTop,
  copyToClipboard,
  getScrollPosition,
  pasteFromClipboard,
} from '@/utils/dom'

describe('getScrollPosition', () => {
  it('should return the current scroll position using window.scrollX and window.scrollY', () => {
    Object.defineProperty(globalThis, 'scrollX', {
      value: 100,
      writable: true,
    })
    Object.defineProperty(globalThis, 'scrollY', {
      value: 200,
      writable: true,
    })

    const position = getScrollPosition()
    expect(position).toEqual({ x: 100, y: 200 })
  })

  it('should fall back to document.documentElement.scrollLeft and scrollTop', () => {
    Object.defineProperty(globalThis, 'scrollX', {
      value: undefined,
      writable: true,
    })
    Object.defineProperty(globalThis, 'scrollY', {
      value: undefined,
      writable: true,
    })
    Object.defineProperty(document.documentElement, 'scrollLeft', {
      value: 150,
      writable: true,
    })
    Object.defineProperty(document.documentElement, 'scrollTop', {
      value: 250,
      writable: true,
    })

    const position = getScrollPosition()
    expect(position).toEqual({ x: 150, y: 250 })
  })

  it('should fall back to document.body.scrollLeft and scrollTop', () => {
    Object.defineProperty(globalThis, 'scrollX', {
      value: undefined,
      writable: true,
    })
    Object.defineProperty(globalThis, 'scrollY', {
      value: undefined,
      writable: true,
    })
    Object.defineProperty(document.documentElement, 'scrollLeft', {
      value: undefined,
      writable: true,
    })
    Object.defineProperty(document.documentElement, 'scrollTop', {
      value: undefined,
      writable: true,
    })
    Object.defineProperty(document.body, 'scrollLeft', {
      value: 300,
      writable: true,
    })
    Object.defineProperty(document.body, 'scrollTop', {
      value: 400,
      writable: true,
    })

    const position = getScrollPosition()
    expect(position).toEqual({ x: 300, y: 400 })
  })

  it('should return {x: 0, y: 0} when all scroll positions are undefined', () => {
    Object.defineProperty(globalThis, 'scrollX', {
      value: undefined,
      writable: true,
    })
    Object.defineProperty(globalThis, 'scrollY', {
      value: undefined,
      writable: true,
    })
    Object.defineProperty(document.documentElement, 'scrollLeft', {
      value: undefined,
      writable: true,
    })
    Object.defineProperty(document.documentElement, 'scrollTop', {
      value: undefined,
      writable: true,
    })
    Object.defineProperty(document.body, 'scrollLeft', {
      value: undefined,
      writable: true,
    })
    Object.defineProperty(document.body, 'scrollTop', {
      value: undefined,
      writable: true,
    })

    const position = getScrollPosition()
    expect(position).toEqual({ x: 0, y: 0 })
  })

  it('should handle the case where document.documentElement is null', () => {
    Object.defineProperty(globalThis, 'scrollX', {
      value: 100,
      writable: true,
    })
    Object.defineProperty(globalThis, 'scrollY', {
      value: 200,
      writable: true,
    })
    Object.defineProperty(document, 'documentElement', { value: null })

    const position = getScrollPosition()
    expect(position).toEqual({ x: 100, y: 200 })
  })
})

describe('copyToClipboard', () => {
  it('should copy text to the clipboard', async () => {
    const text = 'Hello, World!'
    const writeText = vi.fn().mockResolvedValue(null)

    Object.assign(navigator, {
      clipboard: { writeText },
    })

    const copied = await copyToClipboard(text)
    expect(writeText).toHaveBeenCalledWith(text)
    expect(copied).toBe(true)
  })

  it('should handle errors when copying to the clipboard', async () => {
    const text = 'Hello, World!'
    const writeText = vi.fn().mockRejectedValue(new Error('Failed to copy'))

    Object.assign(navigator, {
      clipboard: { writeText },
    })

    const copied = await copyToClipboard(text)
    expect(writeText).toHaveBeenCalledWith(text)
    expect(copied).toBe(false)
  })

  it('should run a callback immediately after copying', async () => {
    const text = 'Hello, World!'
    const writeText = vi.fn().mockResolvedValue(null)
    const callback = vi.fn()

    Object.assign(navigator, {
      clipboard: { writeText },
    })

    await copyToClipboard(text, callback)
    expect(writeText).toHaveBeenCalledWith(text)
    expect(callback).toHaveBeenCalledTimes(1)
  })

  it('should run a callback immediately and again after a timeout', async () => {
    const text = 'Hello, World!'
    const writeText = vi.fn().mockResolvedValue(null)
    const callback = vi.fn()

    Object.assign(navigator, {
      clipboard: { writeText },
    })

    vi.useFakeTimers()

    await copyToClipboard(text, callback, 2000)
    expect(writeText).toHaveBeenCalledWith(text)
    expect(callback).toHaveBeenCalledTimes(1)

    // Advance time and check the callback is called again
    vi.advanceTimersByTime(2000)
    expect(callback).toHaveBeenCalledTimes(2)

    vi.useRealTimers()
  })

  it('should not run a callback if it is not a function', async () => {
    const text = 'Hello, World!'
    const writeText = vi.fn().mockResolvedValue(null)

    Object.assign(navigator, {
      clipboard: { writeText },
    })

    await copyToClipboard(text, undefined)
    expect(writeText).toHaveBeenCalledWith(text)
  })
})

describe('pasteFromClipboard', () => {
  it('should paste text from the clipboard', async () => {
    const readText = vi.fn().mockResolvedValue('Hello, World!')

    Object.assign(navigator, {
      clipboard: { readText },
    })

    const text = await pasteFromClipboard()
    expect(readText).toHaveBeenCalled()
    expect(text).toBe('Hello, World!')
  })

  it('should handle errors when pasting from the clipboard', async () => {
    const readText = vi.fn().mockRejectedValue(new Error('Failed to paste'))

    Object.assign(navigator, {
      clipboard: { readText },
    })

    const text = await pasteFromClipboard()
    expect(readText).toHaveBeenCalled()
    expect(text).toBe('')
  })
})

describe('backToTop', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should scroll to the top of the page with default options', () => {
    const scrollTo = vi.fn()
    Object.defineProperty(globalThis, 'scrollTo', { value: scrollTo })

    const handler = backToTop()
    handler() // Simulate calling the returned function

    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })
  })

  it('should scroll to a custom position with custom options', () => {
    const scrollTo = vi.fn()
    Object.defineProperty(globalThis, 'scrollTo', { value: scrollTo })

    const handler = backToTop(100, 'auto')
    handler() // Simulate calling the returned function

    expect(scrollTo).toHaveBeenCalledWith({ top: 100, behavior: 'auto' })
  })

  it('should execute the callback after scrolling with "auto" behavior', () => {
    const scrollTo = vi.fn()
    const callback = vi.fn()
    Object.defineProperty(globalThis, 'scrollTo', { value: scrollTo })

    const handler = backToTop(0, 'auto', callback)
    handler()

    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'auto' })
    expect(callback).toHaveBeenCalled()
  })

  it('should execute the callback after smooth scrolling is complete', () => {
    const scrollTo = vi.fn()
    const callback = vi.fn()
    Object.defineProperty(globalThis, 'scrollTo', { value: scrollTo })
    Object.defineProperty(globalThis, 'scrollY', { value: 0, writable: true })

    const handler = backToTop(0, 'smooth', callback)
    handler()

    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })

    vi.advanceTimersByTime(16)
    expect(callback).toHaveBeenCalled()
  })

  it('should prevent default behavior when called as an event handler', () => {
    const scrollTo = vi.fn()
    const preventDefault = vi.fn()
    Object.defineProperty(globalThis, 'scrollTo', { value: scrollTo })

    const handler = backToTop()
    handler({ preventDefault } as unknown as React.MouseEvent)

    expect(preventDefault).toHaveBeenCalled()
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })
  })

  it('should not throw errors when called without a callback', () => {
    const scrollTo = vi.fn()
    Object.defineProperty(globalThis, 'scrollTo', { value: scrollTo })

    const handler = backToTop(200, 'smooth')
    expect(() => handler()).not.toThrow()

    expect(scrollTo).toHaveBeenCalledWith({ top: 200, behavior: 'smooth' })
  })

  it('should invoke requestAnimationFrame until scroll position reaches the target', () => {
    const scrollTo = vi.fn()
    const callback = vi.fn()
    const requestAnimationFrameSpy = vi.spyOn(
      globalThis,
      'requestAnimationFrame',
    )
    const scrollYMock = vi.spyOn(globalThis, 'scrollY', 'get')

    Object.defineProperty(globalThis, 'scrollTo', { value: scrollTo })

    // Simulate current scroll position
    let mockScrollY = 50 // Start at 50px scroll position
    scrollYMock.mockImplementation(() => mockScrollY)

    const handler = backToTop(0, 'smooth', callback)
    handler()

    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })
    expect(requestAnimationFrameSpy).toHaveBeenCalled()

    // Simulate scrolling towards target
    mockScrollY = 25 // Scroll closer to target
    vi.advanceTimersByTime(16) // Simulate a frame
    expect(requestAnimationFrameSpy).toHaveBeenCalledTimes(2) // Called again

    // Simulate reaching the target
    mockScrollY = 0 // Target position reached
    vi.advanceTimersByTime(16) // Simulate another frame
    expect(callback).toHaveBeenCalled()
  })
})

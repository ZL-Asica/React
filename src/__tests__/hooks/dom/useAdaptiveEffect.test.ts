import { useEffect, useLayoutEffect } from 'react'
import {
  __INTERNAL__resolveAdaptiveEffect,
  useAdaptiveEffect,
} from '@/hooks/dom/useAdaptiveEffect'

describe('useAdaptiveEffect', () => {
  it('uses useLayoutEffect in a DOM-like environment', () => {
    expect(useAdaptiveEffect).toBe(useLayoutEffect)
  })

  it('resolveAdaptiveEffect returns useLayoutEffect when DOM is available', () => {
    const hook = __INTERNAL__resolveAdaptiveEffect(true)
    expect(hook).toBe(useLayoutEffect)
  })

  it('resolveAdaptiveEffect returns useEffect when DOM is not available', () => {
    const hook = __INTERNAL__resolveAdaptiveEffect(false)
    expect(hook).toBe(useEffect)
  })
})

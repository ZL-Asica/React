import { useEffect, useRef } from 'react'

/**
 * Hook that runs a function after a specified delay.
 * The timeout resets if the dependencies change.
 *
 * @param {(() => void) | void} callback - The function to execute after the timeout. Can be a function or a direct callable reference.
 * @param {number} [delay] - The delay in milliseconds. Defaults to 0.
 *
 * @example
 * ```tsx
 * const MyComponent = () => {
 *   const [isVisible, setIsVisible] = useState(true)
 *
 *   useTimeout(() => setIsVisible(false), 1000)
 *   // OR
 *   useTimeout(setIsVisible.bind(null, false), 1000)
 *
 *   return <div>{isVisible ? 'Visible' : 'Hidden'}</div>
 * }
 * ```
 */
export const useTimeout = (callback: (() => void) | void, delay: number = 0): void => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (delay <= 0) {
      if (typeof callback === 'function') {
        callback()
      }
      return
    }

    timeoutRef.current = setTimeout(() => {
      if (typeof callback === 'function') {
        callback()
      }
    }, delay)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [callback, delay])
}

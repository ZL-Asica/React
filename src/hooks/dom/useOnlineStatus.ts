import { useState } from 'react'
import { useEventListener } from './useEventListener'

/**
 * Derive an "online" boolean from environment flags.
 *
 * @internal
 */
export const __INTERNAL__deriveOnlineStatus = (
  hasNavigator: boolean,
  navigatorOnline: boolean,
): boolean => {
  // In non-browser environments, default to "online"
  if (!hasNavigator) {
    return true
  }

  return navigatorOnline
}

/**
 * Compute the initial online status in a safe way for both
 * browser and SSR environments.
 *
 * @internal
 */
export const __INTERNAL__getInitialOnlineStatus = (): boolean => {
  const hasNavigator = typeof navigator !== 'undefined'
  const navigatorOnline = hasNavigator ? navigator.onLine : false

  return __INTERNAL__deriveOnlineStatus(hasNavigator, navigatorOnline)
}

/**
 * A React hook to track whether the current environment is online.
 *
 * It:
 * - Reads the initial value from `navigator.onLine` (when available).
 * - Subscribes to the global `online` and `offline` events on `window`.
 * - Updates state whenever connectivity changes.
 *
 * In non-browser/SSR environments, it defaults to `true` and will only
 * start updating once hydrated in the browser.
 *
 * @returns {boolean} `true` if the browser is online, otherwise `false`.
 *
 * @example
 * ```tsx
 * import { useOnlineStatus } from '@zl-asica/react';
 *
 * const StatusBanner = () => {
 *   const online = useOnlineStatus();
 *
 *   if (!online) {
 *     return <p>You are currently offline.</p>;
 *   }
 *
 *   return <p>All good, you are online ✅</p>;
 * };
 * ```
 */
export const useOnlineStatus = (): boolean => {
  const [online, setOnline] = useState<boolean>(() =>
    __INTERNAL__getInitialOnlineStatus(),
  )

  const handleOnline = (): void => setOnline(true)
  const handleOffline = (): void => setOnline(false)

  // Global window listeners (no debounce needed here)
  useEventListener('online', handleOnline)
  useEventListener('offline', handleOffline)

  return online
}

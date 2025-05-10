import { useAdaptiveEffect } from '@/hooks/dom'
import { useState } from 'react'

/**
 * Retrieves the stored theme from localStorage and checks if it has expired.
 * If the stored theme is older than `expirationDays`, it resets to system default.
 *
 * @param {string} themeStorageKey - The local storage key where the theme is saved.
 * @param {number} [expirationDays] - The number of days before the stored theme expires.
 * @returns {string | null} The stored theme (`"dark"` or `"light"`) if valid, otherwise `null`.
 *
 * @example
 * ```ts
 * const theme = getStoredTheme('color-theme');
 * console.log(theme); // "dark" | "light" | null
 * ```
 */
const getStoredTheme = (themeStorageKey: string, expirationDays: number = 3): string | null => {
  try {
    const storedData = localStorage.getItem(themeStorageKey)
    if (storedData === null) {
      return null
    }

    let parsedData: { theme: string, date: string }
    try {
      parsedData = JSON.parse(storedData) as { theme: string, date: string }
    }
    catch (error) {
      console.error('Invalid JSON in localStorage:', error)
      localStorage.removeItem(themeStorageKey)
      return null
    }

    if (parsedData === null || typeof parsedData !== 'object') {
      localStorage.removeItem(themeStorageKey)
      return null
    }

    const savedTime = new Date(parsedData.date).getTime()
    const now = new Date().getTime()
    const msPerDay = 1000 * 60 * 60 * 24

    if ((now - savedTime) / msPerDay >= expirationDays) {
      localStorage.removeItem(themeStorageKey)
      return null
    }

    return parsedData.theme
  }
  catch (error) {
    console.error('Error reading theme:', error)
  }
  return null
}

/**
 * Custom React hook to manage dark mode with automatic expiration.
 *
 * - Detects system preference (`prefers-color-scheme: dark`).
 * - Saves the user's selection in `localStorage` with an expiration time.
 * - If the stored theme is older than `expirationDays`, it resets to system default (and localStorage is cleared).
 * - Uses Tailwind CSS `.dark` class for styling.
 *
 * @param {string} [themeStorageKey] - The key used in `localStorage` to save the theme.
 * @param {number} [expirationDays] - The number of days before the stored theme expires.
 * @returns {{
 *   isDarkTheme: boolean;
 *   toggleTheme: () => void;
 * }} An object containing:
 * - `isDarkTheme`: A boolean indicating if the dark theme is currently active.
 * - `toggleTheme`: A function to toggle between light and dark themes.
 *
 * @example
 * ```tsx
 * import useTheme from './useTheme';
 *
 * function App() {
 *   const { isDarkTheme, toggleTheme } = useTheme();
 *
 *   return (
 *     <div className="p-4">
 *       <button onClick={toggleTheme} className="bg-skyblue px-4 py-2 text-white rounded">
 *         {isDarkTheme ? "🌙 Dark Mode" : "☀️ Light Mode"}
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * function Example() {
 *   const { isDarkTheme } = useTheme();
 *
 *   return <div className={isDarkTheme ? "dark-mode" : "light-mode"}>Hello, world!</div>;
 * }
 * ```
 */
export const useTheme = (
  themeStorageKey: string = 'color-theme',
  expirationDays: number = 3,
):
  {
    isDarkTheme: boolean
    toggleTheme: () => void
  } => {
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(false)

  useAdaptiveEffect(() => {
    const systemPrefersDark = globalThis.matchMedia('(prefers-color-scheme: dark)').matches
    const storedTheme = getStoredTheme(themeStorageKey, expirationDays)
    if (storedTheme !== null) {
      setIsDarkTheme(storedTheme === 'dark')
      document.documentElement.classList.toggle('dark', storedTheme === 'dark')
    }
    else {
      setIsDarkTheme(systemPrefersDark)
      document.documentElement.classList.toggle('dark', systemPrefersDark)
    }
  }, [themeStorageKey, expirationDays])

  /**
   * Toggles between light and dark themes, updating `localStorage` and class list.
   */
  const toggleTheme = (): void => {
    const newTheme = isDarkTheme ? 'light' : 'dark'
    setIsDarkTheme(newTheme === 'dark')
    document.documentElement.classList.toggle('dark', newTheme === 'dark')

    localStorage.setItem(
      themeStorageKey,
      JSON.stringify({ theme: newTheme, date: new Date().toISOString() }),
    )
  }

  return { isDarkTheme, toggleTheme }
}

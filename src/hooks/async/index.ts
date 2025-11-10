/**
 * Here are all async hooks.
 *
 * Use `@zl-asica/react` or `@zl-asica/react/hooks` for all hooks.
 *
 * @module
 * @example
 * ```tsx
 * import { useFetch } from '@zl-asica/react';
 *
 * const MyComponent = () => {
 *   const { data, error, loading } = useFetch<{ message: string }>(
 *     'https://api.example.com/endpoint'
 *   );
 *
 *   if (loading) return <p>Loading...</p>;
 *   if (error) return <p>Error: {error.message}</p>;
 *
 *   return <p>Data: {data?.message}</p>;
 * };
 * ```
 */

export { useAsync } from './useAsync'
export { useAsyncPolling } from './useAsyncPolling'
export { useFetch } from './useFetch'
export { usePolling } from './usePolling'

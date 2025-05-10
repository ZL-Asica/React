# @zl-asica/react

## 0.6.0

### Minor Changes

- Add assignUUID function for react for list key

  - This function generates a unique identifier for each item in a array, ensuring that each item has a distinct key when rendering lists in React. This is particularly useful for optimizing rendering performance and preventing issues with React's reconciliation process.
  - When calling from client side, it will use `crypto.randomUUID()` to generate a unique identifier.
  - When calling from server side, it will use a function based on `Math.random()` to generate a unique identifier.

## 0.5.0

### Minor Changes

- Add useObfuscatedEmail state hook for email obfuscates

  - This is a React hook that obfuscates an email address to prevent spam bots from scraping it.

## 0.4.1

### Patch Changes

- Bug fix for useTheme in Nextjs

  - In Next.js, the globalthis may be tried to be accessed before client side fully loaded, which will cause an error.

## 0.4.0

### Minor Changes

- Add useTheme() hook for dark mode

  - Detects system preference (`prefers-color-scheme: dark`).
  - Saves the user's selection in `localStorage` with an expiration time.
  - If the stored theme is older than `expirationDays`, it resets to system default (and localStorage is cleared).
  - Uses Tailwind CSS `.dark` class for styling.

## 0.3.17

### Patch Changes

- Docs update

## 0.3.16

### Patch Changes

- dcbfba5: Fix `threshold` param for useHideOnScrollDown()

  Update doc header and `fix-markdown.mjs` script logging logic.

## 0.3.15

### Patch Changes

- Add robustness of dateUtils formatDate()

## 0.3.14

### Patch Changes

- Remove unsless throw Error & add isAllZeroArray()

  - `src/utils/stringUtils.ts`: Removed throw Error in `truncateToNearestWord` when user input illegal value (return raw data instead).
  - `src/utils/arrayUtils.ts`: Added `isAllZeroArray` function to check if all elements in an array are zero.
  - Remove some unclear JSDoc comments.
  - Bump up some dependencies.

## 0.3.13

### Patch Changes

- fix useHideOnScrollDown type, add useTimeout

## 0.3.12

### Patch Changes

- update pre-push hook

## 0.3.11

### Patch Changes

- Add useHideOnScrollDown and truncateToNearestWord

## 0.3.10

### Patch Changes

- Fix useScrollPosition may have undefined element

## 0.3.9

### Patch Changes

- Fix nextjs issue in SSR

## 0.3.8

### Patch Changes

- Multiple minor JSDoc bugs, typos fixed

## 0.3.7

### Patch Changes

- Refactor useEventListener for wider use cases

## 0.3.6

### Patch Changes

- Update version of the generateUniqueId function.

## 0.3.5

### Patch Changes

- Add generateUniqueId for user decided length.

  Support millisecond precision for generateUniqueId.

## 0.3.4

### Patch Changes

- Minor bugs fixed for debounce and eventlistener

## 0.3.3

### Patch Changes

- Update jsr config

## 0.3.2

### Patch Changes

- Add lost return type declaration. Publish to JSR

## 0.3.1

### Patch Changes

- Update all dom hooks with debounce and extend

  - Update all dom hooks with debounce
  - Extend dom hooks not only for window but also for document and element
  - Merge `useScrollProgress` into `useScrollPosition`
  - Add `useSessionStorage` and `useThread` state hook

## 0.3.0

### Minor Changes

- Support NextJS Client side components

## 0.2.2

### Patch Changes

- Try to support for nextjs

## 0.2.1

### Patch Changes

- add timeout to copy util.

## 0.2.0

### Minor Changes

- First Version ready for Production

  - **Build & Packaging**: Fixed the incomplete build process, ensuring all exports and types are properly included.
  - **Production Readiness**: This is the first usable version of `@zl-asica/react`.
  - Ready for use in modern React (support 19RC) and Next.js (support 15) projects.

## 0.1.6

### Patch Changes

- Fix React peerDependencies issue

## 0.1.5

### Patch Changes

- Update JSDoc, add new functions.

  - Hooks:
    - useInViewport: Hook to check if an element is in the viewport (could provide a offset).
    - useIsBottom: Hook to check if an element is at the bottom of the viewport (could provide a offset).
    - useIsTop: Hook to check if an element is at the top of the viewport (could provide a offset).
    - useKeyPress: Hook to listen to key presses.
    - useScrollProgress: Hook to get the scroll progress of current window (from 0 to 100).
    - useDebouncedCallback: Hook to create a debounced callback.
  - Utils:
    - mathUtils, dateUtils, stringUtils, objectUtils: add new functions.

## 0.1.4

### Patch Changes

- Bump up to test new workflow

## 0.1.3

### Patch Changes

- Update documentation site structure

## 0.1.2

### Patch Changes

- bump version to 0.1.2

## 0.1.1

### Patch Changes

- b588129: Update package.json

## 0.1.0

### ✨ Minor Changes

- Initialize project with core features:
  - Lightweight and reusable React hooks.
  - Fully typed TypeScript support.
  - Organized utilities for async, state, and DOM management.

### 📚 Documentation

- Added initial API documentation.
- Integrated VitePress for generating project documentation.

### ✅ Tests

- Set up basic testing framework using Vitest.
- Achieved ~100% test coverage for core utilities.

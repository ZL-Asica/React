# Guide

Welcome to the **React Hooks and Utils by ZL Asica**! This guide will help you integrate and utilize the library in your React projects.

## Installation

To get started, install the package via `npm`, `yarn`, `pnpm`, `bun`, or `deno` from JSR:

```bash
# With npm
npm install @zl-asica/react
# With yarn
yarn add @zl-asica/react
# With pnpm
pnpm add @zl-asica/react
# With bun
bun add @zl-asica/react
```

```ts
// With deno from JSR
import { useLocalStorage } from 'jsr:@zl-asica/react'
```

## Usage

Here are some examples to help you get started:

### Example 1: `useToggle`

Toggle between `true` and `false` easily (default value is `false`):

```tsx
import { useToggle } from '@zl-asica/react'

const ToggleExample = () => {
  const [isToggled, toggle] = useToggle()

  return (
    <button type="button" onClick={toggle}>
      {isToggled ? 'ON' : 'OFF'}
    </button>
  )
}

export default ToggleExample
```

---

### Example 2: `useFetch`

Simplify API calls with built-in error and loading states:

```tsx
import { useFetch } from '@zl-asica/react'

const FetchExample = () => {
  const { data, error, loading } = useFetch('https://api.example.com/data')

  if (loading) {
    return <p>Loading...</p>
  }
  if (error) {
    return (
      <p>
        Error:
        {error.message}
      </p>
    )
  }

  return <pre>{JSON.stringify(data, null, 2)}</pre>
}

export default FetchExample
```

---

### Example 3: `useLocalStorage`

Persist state to `localStorage` with ease:

```tsx
import { useLocalStorage } from '@zl-asica/react'

const LocalStorageExample = () => {
  const [value, setValue] = useLocalStorage('key', 'default value')

  return (
    <div>
      <p>
        Value:
        {value}
      </p>
      <button type="button" onClick={() => setValue('new value')}>
        Set New Value
      </button>
    </div>
  )
}

export default LocalStorageExample
```

---

## Explore More

Check out the [Docs](/docs/) to learn more about available hooks and utilities.

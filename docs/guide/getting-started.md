# Getting Started

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
# With deno
deno add jsr:@zl-asica/react
```

```ts
// With deno from JSR
import { useToggle } from 'jsr:@zl-asica/react'
```

## Usage

Here are some examples to help you get started:

### Example 1: `useToggle`

Toggle between `true` and `false` easily (default value is `false`):

```tsx
import { useToggle } from '@zl-asica/react/hooks'

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

### Example 2: `assignUUID`

Assign a UUID to an array of objects:

```tsx
// ✅ Works in SSR (Server-Side Rendering)
import { assignUUID } from '@zl-asica/react/utils'

const AssignUUIDExample = () => {
  const data = assignUUID([
    { id: '1', name: 'John' },
    { id: '2', name: 'Jane' },
  ])

  return data.map(item => (
    // Avoid using `key` prop, use `id` instead
    <p key={item.id}>
      {item.id}
      {item.name}
    </p>
  ))
}

export default AssignUUIDExample
```

### Example 3: `useLocalStorage`

Persist state to `localStorage` with ease:

```tsx
import { useLocalStorage } from '@zl-asica/react/hooks'

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

## SSR

Using this library in SSR? Check out the [SSR](/guide/ssr) guide.

## Explore More

Check out the [Docs](/docs/) to learn more about available hooks and utilities.

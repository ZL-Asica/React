# React Utilities 🚀

[![npm version][npm-version-badge]][npm-versions-link]
[![JSR][jsr-badge]][jsr-link]
[![License][license-badge]][license-link]
[![Coverage][coverage-badge]][coverage-link]
[![Node.js][node-badge]][node-link]
[![pnpm Version][pnpm-badge]][pnpm-link] |
[![React][react-badge]][react-link]
[![Vitest][vitest-badge]][vitest-link]
[![Eslint][eslint-badge]][eslint-link]
[![Prettier][prettier-badge]][prettier-link]

This repository is **NOT** a reimplementation of React itself. It is a collection of reusable React hooks, utilities, and tools to enhance development productivity. 🎉

## Features

- 🚀 Lightweight and optimized hooks and utilities for React projects.
- 📦 Fully typed with TypeScript for better developer experience.
- 🔒 Clean and consistent utilities for DOM, state, and async operations.
- ✅ 100% (almost) test coverage with robust testing using Vitest.

## Installation

Install the package via `npm`, `yarn`, `pnpm`, `bun`, or `deno` from JSR:

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

For more examples, check the [documentation](https://react.zla.app).

### Example: `useToggle`

```tsx
import { useToggle } from '@zl-asica/react'

const App = () => {
  const [isToggled, toggle] = useToggle(false)

  return (
    <button type="button" onClick={toggle}>
      {isToggled ? 'ON' : 'OFF'}
    </button>
  )
}

export default App
```

## Limitations

ESM only. This package is built with ESM and is not compatible with CommonJS. If you are using CommonJS, sorry, this package is not for you. 😢

## Contributing

Contributions are welcome! Feel free to open an issue or submit a PR. ❤️

## License

This project is licensed under the [MIT License](./LICENSE).

<!-- Badges / Links -->

[coverage-badge]: https://img.shields.io/codecov/c/github/ZL-Asica/React
[coverage-link]: https://codecov.io/gh/ZL-Asica/React
[eslint-badge]: https://img.shields.io/badge/eslint-4B32C3?logo=eslint&logoColor=white
[eslint-link]: https://www.npmjs.com/package/eslint-config-zl-asica
[jsr-badge]: https://jsr.io/badges/@zl-asica/react
[jsr-link]: https://jsr.io/@zl-asica/react
[license-badge]: https://img.shields.io/github/license/ZL-Asica/React
[license-link]: https://github.com/ZL-Asica/React/blob/main/LICENSE
[node-badge]: https://img.shields.io/badge/node%3E=18-339933?logo=node.js&logoColor=white
[node-link]: https://nodejs.org/
[npm-version-badge]: https://img.shields.io/npm/v/@zl-asica/react
[npm-versions-link]: https://www.npmjs.com/package/@zl-asica/react
[pnpm-badge]: https://img.shields.io/github/package-json/packageManager/ZL-Asica/React?label=&logo=pnpm&logoColor=fff&color=F69220
[pnpm-link]: https://pnpm.io/
[prettier-badge]: https://img.shields.io/badge/Prettier-F7B93E?logo=Prettier&logoColor=white
[prettier-link]: https://www.npmjs.com/package/@zl-asica/prettier-config
[react-badge]: https://img.shields.io/badge/React-%2320232a.svg?logo=react&logoColor=%2361DAFB
[react-link]: https://react.dev/
[vitest-badge]: https://img.shields.io/badge/vitest-6E9F18?logo=vitest&logoColor=white
[vitest-link]: https://vitest.dev/

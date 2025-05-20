# SSR

## What is SSR?

**Server-Side Rendering (SSR)** refers to the technique of rendering React components on the server before sending the fully rendered HTML to the client. This is commonly used in frameworks like **Next.js**, **React Router (Remix)**, or **Tanstack Start**, where SEO, performance, or fast initial page loads are critical.

SSR differs from traditional **Client-Side Rendering (CSR)**, where rendering happens entirely in the browser after JavaScript is downloaded and executed.

## Do You Need to Worry About SSR?

Most users **do not need to worry about SSR**. If you’re:

- Using **Create React App**, **Vite**, or any other client-only (SPA) React environment
- Building frontend UI without server-side rendering or hydration concerns

➡️ You can safely use `@zl-asica/react` and `@zl-asica/react/hooks` without any restrictions.

However, if you are:

- Building with **Next.js**, **React Router (Remix)**, or **Tanstack Start**
- Rendering React components **on the server**
- Running React in an **edge** or **Node.js server** context

➡️ You may need **SSR-safe utilities**, since some browser-specific features (like `window`, `document`, or hooks tied to the DOM lifecycle) are not available during server rendering.

## SSR Compatibility in `@zl-asica/react`

We offer a dedicated set of **SSR-compatible utilities** to ensure safe use in environments without a DOM.

📦 Import them like this:

```ts
// ✅ Safe for SSR
import { assignUUID } from '@zl-asica/react/utils'
```

These utilities are designed to avoid any references to browser-only globals like `window`, `document`, or React lifecycle hooks that require the DOM.

## What About Client-Side?

If you are on the client side (e.g., inside a browser or client-only React app), feel free to use:

- `@zl-asica/react`: General components, utilities, and hooks
- `@zl-asica/react/hooks`: Standalone composable hooks

Example:

```ts
// ✅ Works in the browser
import { useToggle } from '@zl-asica/react'
import { useToggle } from '@zl-asica/react/hooks'
```

## Summary

| Environment         | Use Package                                | Notes                                             |
| ------------------- | ------------------------------------------ | ------------------------------------------------- |
| SSR (e.g., Next.js) | `@zl-asica/react/utils`                    | SSR-safe utility functions only                   |
| Client (Browser)    | `@zl-asica/react`, `@zl-asica/react/hooks` | Full support for components, hooks, and utilities |

> 📝 If you're unsure whether your code runs on the server or client, you're probably on the client — and you're good to go with the default imports.

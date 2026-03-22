---
title: "React Server Components: What They Are and Why They Matter"
date: "2024-12-03"
description: "React Server Components represent a fundamental shift in how we think about rendering. Here's a clear-eyed look at what they solve, how they work, and when to use them."
tags: ["React", "Next.js", "Server Components", "Performance"]
---

# React Server Components: What They Are and Why They Matter

React Server Components (RSC) are one of the most significant architectural changes in React's history. They blur the boundary between server and client in a genuinely new way.

## The Core Idea

Traditional React renders everything on the client. Even with server-side rendering (SSR), the JavaScript bundle is still shipped to the browser, and the full component tree hydrates there.

Server Components run **exclusively on the server** — their output (a serialized component tree) is sent to the client, but none of their code ever ships to the browser.

## The Bundle Size Problem They Solve

Consider a syntax highlighting component:

```javascript
// This approach ships the entire highlight.js library to the browser
import { highlight } from 'highlight.js';

export function CodeBlock({ code, language }) {
  const highlighted = highlight(code, { language });
  return <pre dangerouslySetInnerHTML={{ __html: highlighted.value }} />;
}
```

With a Server Component:

```javascript
// highlight.js never goes to the browser — zero bundle cost
import { highlight } from 'highlight.js';

export async function CodeBlock({ code, language }) {
  const highlighted = highlight(code, { language });
  return <pre dangerouslySetInnerHTML={{ __html: highlighted.value }} />;
}
```

The library is used only on the server. The client receives pure HTML.

## What Server Components Can Do

- Direct database access (no API layer needed)
- Read from the filesystem
- Use server-only secrets (API keys, credentials)
- Import heavy libraries without bundle cost
- `async/await` at the component level

```javascript
// Direct database query in a component — no useEffect, no API route
export async function UserProfile({ userId }) {
  const user = await db.users.findById(userId);

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.bio}</p>
    </div>
  );
}
```

## What Server Components Cannot Do

- Use React state (`useState`)
- Use React effects (`useEffect`)
- Use browser APIs (`window`, `document`)
- Use event handlers (`onClick`, `onChange`)
- Use Context (as consumers)

For these, you need Client Components.

## Client Components: The "use client" Directive

```javascript
'use client';

import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(c => c + 1)}>
      Count: {count}
    </button>
  );
}
```

`'use client'` marks the boundary. Everything in this file and its imports become client-side code.

## Composing Server and Client Components

The key insight: you can pass Server Components *as children* to Client Components:

```javascript
// page.tsx (Server Component)
import { ClientShell } from './ClientShell';
import { ServerData } from './ServerData';

export default function Page() {
  return (
    <ClientShell>
      <ServerData /> {/* Still runs on the server */}
    </ClientShell>
  );
}
```

This lets you keep interactivity at the edges while heavy data fetching stays server-side.

## When to Use Each

| Scenario | Component Type |
|---------|---------------|
| Fetch data from database | Server |
| Display static content | Server |
| Handle user interaction | Client |
| Use browser APIs | Client |
| Use `useState` / `useEffect` | Client |
| Access environment secrets | Server |

## The Mental Model Shift

Think of it this way: your application has two "environments" — the server and the client. Server Components let you deliberately choose where each piece of code runs. By default in Next.js 13+, components are Server Components. Add `'use client'` only when you need client-side capabilities.

This reduces JavaScript shipped to the browser, improves initial load performance, and keeps sensitive logic safely on the server.

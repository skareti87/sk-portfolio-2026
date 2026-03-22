---
title: "React Hooks Deep Dive: useCallback, useMemo, and useRef"
date: "2024-11-15"
description: "A thorough exploration of React's performance hooks — when to use them, when to skip them, and how they actually work under the hood."
tags: ["React", "JavaScript", "Performance", "Hooks"]
---

# React Hooks Deep Dive: useCallback, useMemo, and useRef

React Hooks have transformed how we write components, but three hooks — `useCallback`, `useMemo`, and `useRef` — are frequently misused or misunderstood. This article breaks down each one clearly.

## useCallback

`useCallback` returns a memoized version of a callback function. The function is only recreated when one of its dependencies changes.

```javascript
const handleClick = useCallback(() => {
  doSomething(value);
}, [value]);
```

**When to use it:** Only when passing callbacks to child components that are wrapped in `React.memo`, or when the callback is a dependency of another hook like `useEffect`.

**When NOT to use it:** Don't wrap every function. If the child re-renders anyway, `useCallback` adds overhead for zero benefit.

## useMemo

`useMemo` memoizes the *result* of a computation:

```javascript
const sortedList = useMemo(() => {
  return items.sort((a, b) => a.name.localeCompare(b.name));
}, [items]);
```

**The rule of thumb:** Only use `useMemo` when the computation is genuinely expensive (i.e., involves large data sets or complex algorithms). For simple derivations, plain variables are faster because they skip the memoization overhead.

### Measuring if it's worth it

```javascript
console.time('compute');
const result = expensiveComputation(data);
console.timeEnd('compute');
```

If the logged time is under 1ms, `useMemo` is likely unnecessary.

## useRef

`useRef` has two distinct use cases:

1. **DOM access** — the classic use case:

```javascript
const inputRef = useRef(null);

useEffect(() => {
  inputRef.current.focus();
}, []);

return <input ref={inputRef} />;
```

2. **Storing mutable values without triggering re-renders** — less obvious but equally important:

```javascript
const renderCount = useRef(0);

useEffect(() => {
  renderCount.current += 1;
  console.log(`Rendered ${renderCount.current} times`);
});
```

Unlike `useState`, updating `ref.current` does not cause a re-render.

## The Overoptimization Trap

A common mistake is wrapping everything in `useCallback` or `useMemo` "just to be safe." This actually hurts performance because:

- Every memoized value requires React to store it in memory
- Every hook call adds overhead per render
- Dependency arrays must be compared on every render

**Profile first, optimize second.** Use the React DevTools Profiler to identify actual bottlenecks before reaching for memoization.

## Summary

| Hook | Purpose | Use When |
|------|---------|----------|
| `useCallback` | Memoize a function reference | Passing to `memo`-wrapped children |
| `useMemo` | Memoize a computed value | Expensive calculations |
| `useRef` | Persist mutable value or DOM ref | Without triggering re-renders |

Understanding *why* you're using a hook is more valuable than using it reflexively. Keep your components lean, profile when performance matters, and reach for these tools deliberately.

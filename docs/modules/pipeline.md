# Pipeline Module

**File:** `src/core/pipeline.ts`

## Purpose

This module exposes `createPipeline()`, the main entry point of the package.

---

## What `createPipeline()` Does

1. creates a `PipelineBuilder` from the supplied config
2. returns an object with `.use()` and `.process()`
3. normalizes plugin inputs
4. creates fresh runtime context for each process call

---

## Plugin Handling

### Object plugins

- must satisfy `isPipelinePlugin()`
- must also provide a non-empty `name`
- may include `version`

### Function plugins

- use the function itself as `setup`
- derive their trace/display name from:
  1. `displayName`
  2. `function.name`
  3. `"anonymous-plugin"`

Unnamed function plugins trigger a `console.warn()` message to encourage explicit naming.

Invalid inputs throw `PluginError`.

---

## Per-Run Context

`process(file)` creates:

```ts
const ctx: PipelineContext = {
  file,
  metadata: {},
  meta: {
    plugins: [...builder.meta.plugins],
    trace: [],
  },
};
```

That means plugin metadata is copied, while trace state is reset on every run.

---

## Dependencies

- `core/builder.ts`
- `core/executor.ts`
- `types/pipeline.ts`
- `types/plugin.ts`
- `utils/plugins.ts`
- `utils/errors.ts`

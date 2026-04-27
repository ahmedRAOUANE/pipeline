# Hooks Module

**File:** `src/types/hooks.ts`

## Purpose

This module defines the lifecycle hook signatures used by the builder and executor.

---

## Hook Shape

```ts
type PipelineHooks = {
  onStart?: (ctx: PipelineContext) => void | Promise<void>;
  afterValidate?: (ctx: PipelineContext) => void | Promise<void>;
  afterProcess?: (ctx: PipelineContext) => void | Promise<void>;
  onError?: (error: PipelineError | Error, ctx: PipelineContext) => void | Promise<void>;
  onFinish?: (result: PipelineResult, ctx: PipelineContext) => void | Promise<void>;
};
```

---

## Execution Points

| Hook | When it runs |
|------|--------------|
| `onStart` | before validators |
| `afterValidate` | after all validators succeed |
| `afterProcess` | after all processors succeed |
| `onFinish` | after storage succeeds |
| `onError` | after any stage throws |

---

## Where Hooks Are Combined

`PipelineHooks` only defines the shape.

Actual hook composition happens in `src/core/builder.ts`, where handlers of the same name are chained in registration order.

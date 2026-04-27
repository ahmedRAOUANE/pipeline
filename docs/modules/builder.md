# Builder Module

**File:** `src/core/builder.ts`

## Purpose

`PipelineBuilder` stores the reusable configuration that plugins and callers assemble before any file is processed.

---

## State

```ts
class PipelineBuilder {
  validators: Validator[] = [];
  processors: Processor[] = [];
  hooks: PipelineHooks = {};
  storage: Storage;
  meta: PipelineMeta = {
    plugins: [],
    trace: [],
  };
}
```

`meta.trace` exists on the builder shape but is not reused directly at runtime. Each `process()` call gets a fresh trace array.

---

## Main Methods

| Method | Behavior |
|--------|----------|
| `addValidator(v)` | appends a validator |
| `addProcessor(p)` | appends a processor |
| `setStorage(storage)` | replaces the active storage |
| `mergeHooks(hooks)` | chains hook handlers in registration order |
| `registerPlugin(meta)` | appends plugin metadata |

---

## Hook Merging

`mergeHooks()` composes hook handlers rather than replacing them.

- `onStart`, `afterValidate`, `afterProcess` are chained as `(ctx) => existing(ctx) -> incoming(ctx)`
- `onError` is chained as `(error, ctx) => existing(error, ctx) -> incoming(error, ctx)`
- `onFinish` is chained as `(result, ctx) => existing(result, ctx) -> incoming(result, ctx)`

---

## Relationship To Runtime

- `createPipeline()` owns the builder
- `.use()` mutates it
- `.process()` reads its current configuration and hands it to the executor

The builder is configuration state, not per-request state.

# Data Flow Overview

## High-Level Flow

```text
createPipeline(config)
  -> optional .use(plugin)
  -> process(file)
  -> hooks.onStart
  -> validators[]
  -> hooks.afterValidate
  -> processors[]
  -> hooks.afterProcess
  -> storage.save(ctx.file)
  -> hooks.onFinish
  -> PipelineResult
```

On any error:

```text
stage throws
  -> hooks.onError
  -> original error re-thrown
```

---

## Creation Phase

1. `createPipeline(config)` instantiates a `PipelineBuilder`
2. `.use(plugin)` mutates the builder by registering validators, processors, hooks, or storage
3. plugin metadata is stored on the builder for future process runs

---

## Processing Phase

### Initial context

```ts
const ctx = {
  file,
  metadata: {},
  meta: {
    plugins: [...builder.meta.plugins],
    trace: [],
  },
};
```

### Stage order

| Stage | Input | Output |
|-------|-------|--------|
| `onStart` | `PipelineContext` | same context |
| validators | `PipelineContext` | same context or throw |
| `afterValidate` | `PipelineContext` | same context |
| processors | `PipelineContext` | enriched `PipelineContext` |
| `afterProcess` | `PipelineContext` | same context |
| storage | `PipelineFile` | `PipelineResult` |
| `onFinish` | `PipelineResult`, `PipelineContext` | side effects only |

---

## Metadata Flow

- `ctx.metadata` starts as `{}` and may be enriched by processors or hooks
- `result.metadata` comes from the storage adapter
- the final return value merges metadata as `{ ...ctx.metadata, ...result.metadata }`
- `ctx.meta.trace` is the authoritative trace array returned to the caller

---

## Trace Flow

Each run records events like:

```ts
{
  plugin: "core" | "storage" | "<validator name>" | "<processor name>",
  stage: "validator" | "processor" | "hook" | "storage",
  message: string,
  timestamp: number,
  duration?: number,
}
```

The executor emits trace entries after:

1. `onStart`
2. each validator
3. `afterValidate`
4. each processor
5. `afterProcess`
6. storage save
7. `onFinish`
8. `onError`

---

## Result Shape

```ts
{
  url,
  path,
  size,
  metadata,
  meta,
  originalName,
  storedName,
  mimeType,
  provider: "local",
}
```

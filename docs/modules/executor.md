# Executor Module

**File:** `src/core/executor.ts`

## Purpose

`executePipeline()` is the runtime orchestrator. It receives a prepared `PipelineContext`, runs the configured stages in order, records trace data, and returns the final `PipelineResult`.

---

## Function Shape

```ts
async function executePipeline(params: {
  ctx: PipelineContext;
  validators?: Validator[];
  processors?: Processor[];
  storage: Storage;
  hooks?: PipelineHooks;
}): Promise<PipelineResult>
```

---

## Stage Order

```text
onStart
  -> validators[]
  -> afterValidate
  -> processors[]
  -> afterProcess
  -> storage.save()
  -> onFinish
```

On failure:

```text
throw
  -> onError
  -> re-throw original error
```

---

## Important Runtime Details

- validators run sequentially and fail fast
- processors run sequentially and may replace the context
- storage receives `ctx.file`, not the whole context
- the final return value uses `ctx.meta`, not the `meta` returned by storage
- final metadata merges as `{ ...ctx.metadata, ...result.metadata }`

---

## Error Handling Nuance

The executor converts non-`Error` values into an `Error` instance for the `onError` hook, but it re-throws the original `err`.

If `hooks.onError` throws, that secondary failure is logged to `console.error` and the original failure still wins.

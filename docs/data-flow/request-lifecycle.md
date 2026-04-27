# Request Lifecycle

This document follows one call to `pipeline.process(file)` from setup through completion.

---

## 1. Pipeline Creation

```ts
const pipeline = createPipeline({
  storage: localStorage("./uploads"),
  validators: [maxSize(5 * 1024 * 1024)],
});
```

At creation time:

- `createPipeline()` creates a `PipelineBuilder`
- validators, processors, hooks, and storage are copied into the builder
- `builder.meta.plugins` starts empty

---

## 2. Plugin Registration

```ts
pipeline.use(plugin);
```

### Object plugin path

- validates that `plugin.name` is a non-empty string
- uses `plugin.setup(builder)`
- stores `{ name, version }` in builder metadata

### Function plugin path

- uses the function itself as setup
- derives the plugin name from:
  1. `plugin.displayName`
  2. `plugin.name`
  3. `"anonymous-plugin"`
- warns through `console.warn()` if the function has no usable name

Invalid plugin inputs throw `PluginError`.

---

## 3. Process Call

```ts
const result = await pipeline.process(file);
```

`process()` creates a fresh context:

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

Important detail:

- plugin metadata is copied per run
- trace data is always reset per run

---

## 4. Executor Stages

### `onStart`

```ts
await hooks?.onStart?.(ctx);
trace(ctx, { plugin: "core", stage: "hook", message: "onStart executed" });
```

### Validators

Each validator receives the current context and may throw:

```ts
for (const validator of validators ?? []) {
  const start = Date.now();
  await validator(ctx);
  trace(ctx, {
    plugin: validator.name || "anonymous-validator",
    stage: "validator",
    message: "validation passed",
    duration: Date.now() - start,
  });
}
```

### `afterValidate`

```ts
await hooks?.afterValidate?.(ctx);
trace(ctx, { plugin: "core", stage: "hook", message: "afterValidate executed" });
```

### Processors

Each processor may replace the context:

```ts
for (const processor of processors ?? []) {
  const start = Date.now();
  ctx = await processor(ctx);
  trace(ctx, {
    plugin: processor.name || "anonymous-processor",
    stage: "processor",
    message: "processed",
    duration: Date.now() - start,
  });
}
```

### `afterProcess`

```ts
await hooks?.afterProcess?.(ctx);
trace(ctx, { plugin: "core", stage: "hook", message: "afterProcess executed" });
```

### Storage

```ts
const result = await storage.save(ctx.file);
trace(ctx, {
  plugin: "storage",
  stage: "storage",
  message: "file saved",
  duration: Date.now() - start,
});
```

### `onFinish`

```ts
await hooks?.onFinish?.(result, ctx);
trace(ctx, { plugin: "core", stage: "hook", message: "onFinish executed" });
```

---

## 5. Final Return Value

The executor returns:

```ts
{
  ...result,
  metadata: { ...ctx.metadata, ...result.metadata },
  meta: ctx.meta,
}
```

That means:

- storage decides the base `PipelineResult`
- pipeline metadata replaces `result.meta`
- storage metadata wins if it shares keys with `ctx.metadata`

---

## 6. Error Path

If any stage throws:

```ts
catch (err) {
  const error = err instanceof Error ? err : new Error(String(err));
  await hooks?.onError?.(error, ctx);
  trace(ctx, { plugin: "core", stage: "hook", message: "onError executed" });
  throw err;
}
```

Additional behavior:

- if `onError` itself fails, that failure is logged with `console.error`
- the original thrown error is preserved and re-thrown

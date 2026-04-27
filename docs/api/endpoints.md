# API Reference

## Overview

This document describes the public package surface exported from `src/index.ts` and the runtime behavior behind it.

---

## Public Exports

### Functions and values

| Export | Kind | Notes |
|--------|------|-------|
| `createPipeline` | function | Creates a pipeline instance with `.use()` and `.process()` |
| `localStorage` | function | Built-in filesystem storage adapter |
| `maxSize` | function | Built-in size validator factory |
| `allowedMimeTypes` | function | Built-in MIME validator factory |
| `identityProcessor` | value | Built-in no-op processor |
| `PipelineBuilder` | class | Exported mainly for plugin authors |

### Types exported from the package root

| Export | Kind |
|--------|------|
| `PipelineFile` | type |
| `PipelineResult` | type |
| `Processor` | type |
| `Validator` | type |
| `Storage` | type |
| `PipelineContext` | type |
| `PipelinePlugin` | type |
| `PipelineErrorCode` | type |

### Error classes

| Export | Kind |
|--------|------|
| `PipelineError` | class |
| `ValidationError` | class |
| `ProcessorError` | class |
| `StorageError` | class |
| `PluginError` | class |

---

## `createPipeline(config)`

Creates a pipeline instance.

### Configuration shape

`PipelineConfig` is used internally by the library, but it is not currently exported from the package root. The runtime shape is:

```ts
{
  validators?: Validator[];
  processors?: Processor[];
  storage: Storage;
  hooks?: {
    onStart?: (ctx: PipelineContext) => void | Promise<void>;
    afterValidate?: (ctx: PipelineContext) => void | Promise<void>;
    afterProcess?: (ctx: PipelineContext) => void | Promise<void>;
    onError?: (error: PipelineError | Error, ctx: PipelineContext) => void | Promise<void>;
    onFinish?: (result: PipelineResult, ctx: PipelineContext) => void | Promise<void>;
  };
}
```

### Returned API

```ts
{
  use(plugin: PipelinePlugin | ((builder: PipelineBuilder) => void)): this;
  process(file: PipelineFile): Promise<PipelineResult>;
}
```

### Example

```ts
import {
  createPipeline,
  localStorage,
  maxSize,
  allowedMimeTypes,
} from "media-pipeline";

const pipeline = createPipeline({
  storage: localStorage("./uploads"),
  validators: [
    maxSize(5 * 1024 * 1024),
    allowedMimeTypes(["image/jpeg", "image/png"]),
  ],
});
```

---

## `pipeline.use(plugin)`

Registers a plugin and returns the same pipeline instance.

### Supported plugin forms

#### Object plugin

```ts
const plugin = {
  name: "images",
  version: "1.0.0",
  setup(builder: PipelineBuilder) {
    // register validators, processors, hooks, or storage
  },
};
```

#### Function plugin

```ts
function images(builder: PipelineBuilder) {
  // register validators, processors, hooks, or storage
}

images.displayName = "images";
```

### Runtime behavior

- Object plugins must have a non-empty `name`
- Function plugins may use `displayName`, then `function.name`, then `"anonymous-plugin"`
- Invalid plugin inputs throw `PluginError`
- Registered plugin metadata is copied into each new `process()` call

---

## `pipeline.process(file)`

Processes a single `PipelineFile`.

### Input

```ts
type PipelineFile = {
  buffer: Buffer;
  filename: string;
  mimeType: string;
  size: number;
};
```

### Output

```ts
type PipelineResult = {
  url: string;
  path: string;
  size: number;
  metadata: Record<string, any>;
  meta: {
    plugins: Array<{ name: string; version?: string; priority?: number }>;
    trace: Array<{
      plugin: string;
      stage: "validator" | "processor" | "hook" | "storage";
      message: string;
      timestamp: number;
      duration?: number;
    }>;
  };
  originalName: string;
  storedName: string;
  mimeType: string;
  provider: "local";
};
```

### Notes

- `metadata` in the final result is merged as `{ ...ctx.metadata, ...result.metadata }`
- `meta.trace` is created fresh for each `process()` call
- built-in local storage returns a `file://` URL

---

## Built-in Utilities

### `localStorage(basePath: string)`

Creates a filesystem-backed `Storage`.

Runtime behavior:

- creates `basePath` if missing
- checks that `basePath` is writable
- sanitizes the original filename
- generates a unique stored filename
- writes the buffer to disk

### `maxSize(limit: number)`

Returns a validator that throws `ValidationError` when `ctx.file.size > limit`.

### `allowedMimeTypes(types: string[])`

Returns a validator that throws `ValidationError` when the incoming MIME type is not in the allowed list.

### `identityProcessor`

An async processor that returns the incoming context unchanged.

---

## `PipelineBuilder`

`PipelineBuilder` is exported for plugin authors and internal-style composition.

### Methods

| Method | Purpose |
|--------|---------|
| `addValidator(v)` | append a validator |
| `addProcessor(p)` | append a processor |
| `setStorage(storage)` | replace the active storage |
| `mergeHooks(hooks)` | chain lifecycle hooks in registration order |
| `registerPlugin(meta)` | track plugin metadata for later process runs |

---

## Error Model

`PipelineErrorCode` currently includes:

```ts
"VALIDATION_ERROR" | "PROCESSOR_ERROR" | "STORAGE_ERROR" | "UNKNOWN_ERROR" | "PLUGIN_ERROR"
```

The library exports matching error classes for callers who want `instanceof` checks.

# Request And Response Schemas

## Overview

This document captures the current runtime shapes used by the pipeline.

---

## `PipelineFile`

```ts
type PipelineFile = {
  buffer: Buffer;
  filename: string;
  mimeType: string;
  size: number;
};
```

Example:

```json
{
  "buffer": "<Buffer ...>",
  "filename": "photo.jpg",
  "mimeType": "image/jpeg",
  "size": 204800
}
```

---

## `PipelineContext`

```ts
type PipelineContext = {
  file: PipelineFile;
  metadata: Record<string, any>;
  meta: PipelineMeta;
};
```

This object is created at the start of each `process()` call and flows through validators, processors, hooks, and tracing.

---

## `PluginMeta`

```ts
type PluginMeta = {
  name: string;
  version?: string;
  priority?: number;
};
```

---

## `PluginTraceEvent`

```ts
type PluginTraceEvent = {
  plugin: string;
  stage: "validator" | "processor" | "hook" | "storage";
  message: string;
  timestamp: number;
  duration?: number;
};
```

---

## `PipelineMeta`

```ts
type PipelineMeta = {
  plugins: PluginMeta[];
  trace: PluginTraceEvent[];
};
```

Notes:

- `plugins` is copied from the builder into each process run
- `trace` starts empty for each run and is filled by the executor

---

## `PipelineResult`

```ts
type PipelineProvider = "local";

type PipelineResult = {
  url: string;
  path: string;
  size: number;
  metadata: Record<string, any>;
  meta: PipelineMeta;
  originalName: string;
  storedName: string;
  mimeType: string;
  provider: PipelineProvider;
};
```

Example from the built-in local storage adapter:

```json
{
  "url": "file:///abs/path/uploads/1714210000000-abc123.jpg",
  "path": "./uploads/1714210000000-abc123.jpg",
  "size": 204800,
  "metadata": {},
  "meta": {
    "plugins": [],
    "trace": []
  },
  "originalName": "photo.jpg",
  "storedName": "1714210000000-abc123.jpg",
  "mimeType": "image/jpeg",
  "provider": "local"
}
```

---

## `Storage`

```ts
type Storage = {
  save(file: PipelineFile): Promise<PipelineResult>;
};
```

---

## Validator And Processor Contracts

```ts
type Validator = (ctx: PipelineContext) => void | Promise<void>;

type Processor = (ctx: PipelineContext) => PipelineContext | Promise<PipelineContext>;
```

---

## Hook Contract

The hook type is defined internally in `src/types/hooks.ts`:

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

## Plugin Contracts

```ts
type PipelinePlugin = {
  name: string;
  version?: string;
  setup: (builder: PipelineBuilder) => void;
};
```

Function plugins are also accepted at runtime:

```ts
type PipelinePluginFunction = ((builder: PipelineBuilder) => void) & {
  displayName?: string;
};
```

---

## Error Shape

```ts
type PipelineErrorCode =
  | "VALIDATION_ERROR"
  | "PROCESSOR_ERROR"
  | "STORAGE_ERROR"
  | "UNKNOWN_ERROR"
  | "PLUGIN_ERROR";
```

Example:

```json
{
  "name": "ValidationError",
  "message": "File too large",
  "code": "VALIDATION_ERROR",
  "details": {
    "size": 10485760,
    "limit": 5242880
  }
}
```

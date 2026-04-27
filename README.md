# Media Pipeline

A storage-agnostic file processing pipeline for Node.js.

Media Pipeline takes a file buffer through a predictable sequence:

```text
file -> validate -> process -> store -> result
```

It is designed for server-side applications that already have a file in memory and want a clean way to validate, transform, and persist it.

## Features

- Chainable pipeline creation with `createPipeline()`
- Built-in validators for size and MIME type
- Built-in local filesystem storage via `localStorage()`
- Plugin support through `.use()`
- Lifecycle hooks for start, post-validation, post-processing, finish, and error handling
- Per-run tracing through `result.meta.trace`
- Dual package output for CommonJS and ESM
- Zero runtime npm dependencies

## Installation

```bash
npm install media-pipeline
```

## Quick Start

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

const result = await pipeline.process({
  buffer: Buffer.from("data"),
  filename: "image.jpg",
  mimeType: "image/jpeg",
  size: 1024,
});

console.log(result.url);
console.log(result.storedName);
console.log(result.meta.trace);
```

## Core API

### `createPipeline(config)`

Creates a pipeline instance with:

- `use(plugin)`
- `process(file)`

Runtime shape of `config`:

```ts
{
  validators?: Validator[];
  processors?: Processor[];
  storage: Storage;
  hooks?: {
    onStart?: (ctx) => void | Promise<void>;
    afterValidate?: (ctx) => void | Promise<void>;
    afterProcess?: (ctx) => void | Promise<void>;
    onError?: (error, ctx) => void | Promise<void>;
    onFinish?: (result, ctx) => void | Promise<void>;
  };
}
```

### `pipeline.process(file)`

Processes a single file:

```ts
type PipelineFile = {
  buffer: Buffer;
  filename: string;
  mimeType: string;
  size: number;
};
```

Returns:

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

## Built-In Utilities

### Validators

- `maxSize(limit)`
- `allowedMimeTypes(types)`

Example:

```ts
validators: [
  maxSize(10 * 1024 * 1024),
  allowedMimeTypes(["image/jpeg", "image/png"]),
];
```

### Processor

- `identityProcessor`

This is a no-op async processor that returns the incoming context unchanged.

### Storage

- `localStorage(basePath)`

The built-in storage adapter:

- creates the directory if needed
- checks that it is writable
- sanitizes the original filename
- generates a unique stored filename
- writes the file to disk
- returns a `file://` URL

## Hooks

Hooks let you attach side effects to the pipeline lifecycle.

```ts
const pipeline = createPipeline({
  storage: localStorage("./uploads"),
  hooks: {
    onStart(ctx) {
      console.log("Starting:", ctx.file.filename);
    },
    onFinish(result) {
      console.log("Saved:", result.url);
    },
    onError(error) {
      console.error("Pipeline failed:", error.message);
    },
  },
});
```

Hook order during a successful run:

1. `onStart`
2. validators
3. `afterValidate`
4. processors
5. `afterProcess`
6. storage
7. `onFinish`

On failure, `onError` is called and the original error is re-thrown.

## Plugins

Plugins can register validators, processors, hooks, or even replace storage through `PipelineBuilder`.

### Object plugin

```ts
const imagePlugin = {
  name: "image-plugin",
  version: "1.0.0",
  setup(builder) {
    builder.addValidator(allowedMimeTypes(["image/png", "image/jpeg"]));
  },
};

pipeline.use(imagePlugin);
```

### Function plugin

```ts
function auditPlugin(builder) {
  builder.mergeHooks({
    onStart(ctx) {
      console.log("Processing", ctx.file.filename);
    },
  });
}

auditPlugin.displayName = "audit-plugin";

pipeline.use(auditPlugin);
```

Notes:

- object plugins must have a non-empty `name`
- function plugins use `displayName`, then `function.name`, then `"anonymous-plugin"` for tracing
- invalid plugin inputs throw `PluginError`

## Custom Processors

```ts
import type { Processor } from "media-pipeline";

const renameProcessor: Processor = async (ctx) => {
  return {
    ...ctx,
    file: {
      ...ctx.file,
      filename: `processed-${ctx.file.filename}`,
    },
  };
};
```

## Errors

The package exports these error classes:

- `PipelineError`
- `ValidationError`
- `ProcessorError`
- `StorageError`
- `PluginError`

Example:

```ts
import { ValidationError } from "media-pipeline";

try {
  await pipeline.process(file);
} catch (err) {
  if (err instanceof ValidationError) {
    console.log(err.details);
  }
}
```

## Current Limitations

- Files are processed in memory as `Buffer` objects
- Validators and processors run sequentially
- Only local filesystem storage is built in
- `PipelineResult.provider` is currently typed as `"local"`
- The repository currently exposes only a `build` npm script

## Development

Build the package with:

```bash
npm run build
```

The repository includes more detailed project docs under [`docs/`](docs/), including architecture, module breakdowns, API notes, and data-flow references.

## License

MIT

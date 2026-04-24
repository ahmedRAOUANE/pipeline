# Media Pipeline

**Version:** 1.5.11
**Runtime:** Node.js
**Purpose:** Storage-agnostic, extensible file validation, transformation, and storage pipeline.

---

## Overview

Media Pipeline is a modular file processing system where files flow through a structured pipeline:

```
Input → Validators → Processors → Storage → Output
```

Each stage is fully customizable and extensible via plugins.

---

## Installation

```bash
npm install media-pipeline
```

---

## Basic Usage

```ts
import {
  createPipeline,
  localStorage,
  maxSize,
  allowedMimeTypes
} from 'media-pipeline';

const pipeline = createPipeline({
  validators: [
    maxSize(5 * 1024 * 1024),
    allowedMimeTypes(['image/jpeg'])
  ],
  storage: localStorage('./uploads')
});

const file = {
  buffer: Buffer.from('data'),
  filename: 'image.jpg',
  mimeType: 'image/jpeg',
  size: 1024
};

const result = await pipeline.process(file);
console.log(result);
```

---

## Core Concepts

### Pipeline Flow

1. **Input**: Raw file object
2. **Validators**: Ensure file meets requirements
3. **Processors**: Transform file
4. **Storage**: Persist file
5. **Output**: Result with metadata and trace

---

## API Reference

### `createPipeline(config)`

Creates a new pipeline instance.

#### Config

```ts
type PipelineConfig = {
  validators?: Validator[];
  processors?: Processor[];
  storage: Storage;
  hooks?: PipelineHooks;
};
```

---

### Built-in Utilities

#### `localStorage(basePath)`

Stores files locally.

#### `maxSize(limit)`

Validates file size.

#### `allowedMimeTypes(types)`

Validates MIME type.

#### `identityProcessor()`

No-op processor.

---

## Types

### PipelineFile

```ts
{
  buffer: Buffer;
  filename: string;
  mimeType: string;
  size: number;
}
```

### PipelineResult

```ts
{
  url: string;
  path: string;
  size: number;
  metadata: Record<string, any>;
  meta: {
    plugins: PluginMeta[];
    trace: TraceEvent[];
  };
}
```

### PipelineContext

```ts
{
  file: PipelineFile;
  metadata: Record<string, any>;
  meta: PipelineMeta;
}
```

---

## Validators

Validators check conditions and throw errors if invalid.

```ts
type Validator = (ctx: PipelineContext) => void | Promise<void>;
```

### Example

```ts
function imageOnlyValidator(ctx) {
  if (!ctx.file.mimeType.startsWith('image/')) {
    throw new Error('Invalid file type');
  }
}
```

---

## Processors

Processors transform files.

```ts
type Processor = (ctx: PipelineContext) => PipelineContext | Promise<PipelineContext>;
```

### Example

```ts
function renameProcessor(ctx) {
  return {
    ...ctx,
    file: {
      ...ctx.file,
      filename: `processed-${ctx.file.filename}`
    }
  };
}
```

---

## Storage

Storage persists files.

```ts
type Storage = {
  save(file: PipelineFile): Promise<PipelineResult>;
};
```

---

## Hooks

Hooks allow lifecycle customization.

```ts
type PipelineHooks = {
  onStart?: (ctx) => void | Promise<void>;
  afterValidate?: (ctx) => void | Promise<void>;
  afterProcess?: (ctx) => void | Promise<void>;
  onError?: (error, ctx) => void | Promise<void>;
  onFinish?: (result, ctx) => void | Promise<void>;
};
```

---

## Plugin System

Plugins extend functionality.

### Plugin Types

#### Object Plugin

```ts
{
  name: string;
  version?: string;
  setup(builder: PipelineBuilder): void;
}
```

#### Function Plugin

```ts
(builder: PipelineBuilder) => void;
```

---

### Builder API

```ts
builder.addValidator(fn);
builder.addProcessor(fn);
builder.mergeHooks(hooks);
builder.setStorage(storage);
```

---

### Example Plugin (Image Resize)

```ts
const sharpPlugin = {
  name: 'sharp-resize',
  setup(builder) {
    builder.addProcessor(async (ctx) => {
      if (ctx.file.mimeType.startsWith('image/')) {
        const sharp = require('sharp');
        const buffer = await sharp(ctx.file.buffer)
          .resize(800, 800)
          .toBuffer();

        return {
          ...ctx,
          file: {
            ...ctx.file,
            buffer,
            size: buffer.length
          }
        };
      }
      return ctx;
    });
  }
};
```

---

## Execution Flow

1. `onStart`
2. Validators
3. `afterValidate`
4. Processors
5. `afterProcess`
6. Storage
7. `onFinish`

On error:

* `onError` is called
* Error is re-thrown

---

## Tracing

Each step is recorded.

```ts
{
  plugin: string;
  stage: 'validator' | 'processor' | 'hook' | 'storage';
  message: string;
  duration?: number;
  timestamp: number;
}
```

---

## Errors

### Classes

* `PipelineError`
* `ValidationError`
* `ProcessorError`
* `StorageError`

### Example Handling

```ts
try {
  await pipeline.process(file);
} catch (err) {
  if (err instanceof ValidationError) {
    console.log(err.details);
  }
}
```

---

## Best Practices

* Use named functions for better tracing
* Always handle errors
* Keep processors pure
* Use plugins for reusable logic

---

## Limitations

* No streaming support
* Sequential execution only
* Trace accumulation across runs
* No automatic error wrapping

---

## Advanced Usage

### Using Plugins

```ts
pipeline.use(sharpPlugin);
```

### Custom Storage Example

```ts
const memoryStorage = {
  async save(file) {
    return {
      url: 'memory://file',
      path: file.filename,
      size: file.size,
      metadata: {}
    };
  }
};
```

---

## Design Principles

* Separation of concerns
* Composability
* Extensibility
* Minimal core

---

## Future Improvements

* Streaming support
* Parallel processing
* Queue system
* Plugin marketplace

---

## License

MIT

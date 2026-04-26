# API Reference

## Overview

This document provides a complete API reference for the Media Pipeline library.

---

## Main Exports

| Export | Type | Description |
|--------|------|-------------|
| `createPipeline` | Function | Create a new pipeline instance |
| `localStorage` | Function | Create local filesystem storage |
| `maxSize` | Function | Create size validator |
| `allowedMimeTypes` | Function | Create MIME type validator |
| `identityProcessor` | Constant | No-op processor |
| `PipelineBuilder` | Class | Pipeline builder class |
| `PipelinePlugin` | Type | Plugin type definition |

---

## Functions

### `createPipeline(config: PipelineConfig): Pipeline`

Creates a new pipeline instance.

**Parameters:**
```typescript
type PipelineConfig = {
    validators?: Validator[];
    processors?: Processor[];
    storage: Storage;
    hooks?: PipelineHooks;
};
```

**Returns:**
```typescript
{
    use(plugin: PipelinePlugin | PipelinePluginSetup): this;
    process(file: PipelineFile): Promise<PipelineResult>;
}
```

**Example:**
```typescript
const pipeline = createPipeline({
    storage: localStorage('./uploads'),
    validators: [maxSize(5 * 1024 * 1024)],
    processors: [imageProcessor],
    hooks: { onFinish: logResult }
});
```

---

### `localStorage(basePath: string): Storage`

Creates a local filesystem storage backend.

**Parameters:**
- `basePath` - Directory path for file storage

**Returns:** `Storage` interface

**Example:**
```typescript
const storage = localStorage('./uploads');
```

---

### `maxSize(limit: number): Validator`

Creates a file size validator.

**Parameters:**
- `limit` - Maximum file size in bytes

**Returns:** `Validator` function

**Example:**
```typescript
const validator = maxSize(5 * 1024 * 1024); // 5MB
```

---

### `allowedMimeTypes(types: string[]): Validator`

Creates a MIME type validator.

**Parameters:**
- `types` - Array of allowed MIME types

**Returns:** `Validator` function

**Example:**
```typescript
const validator = allowedMimeTypes(['image/png', 'image/jpeg']);
```

---

## Pipeline Instance Methods

### `pipeline.use(plugin): this`

Register a plugin with the pipeline.

**Parameters:**
```typescript
// Form 1: Plugin object
plugin: {
    name: string;
    version?: string;
    setup: (builder: PipelineBuilder) => void;
}

// Form 2: Setup function
plugin: (builder: PipelineBuilder) => void;
```

**Returns:** `this` (chainable)

**Example:**
```typescript
pipeline
    .use(validatorPlugin)
    .use(processorPlugin);
```

---

### `pipeline.process(file): Promise<PipelineResult>`

Process a file through the pipeline.

**Parameters:**
```typescript
type PipelineFile = {
    buffer: Buffer;
    filename: string;
    mimeType: string;
    size: number;
};
```

**Returns:** `Promise<PipelineResult>`

```typescript
type PipelineResult = {
    url: string;
    path: string;
    size: number;
    metadata: Record<string, any>;
    meta: PipelineMeta;
};
```

**Example:**
```typescript
const result = await pipeline.process({
    buffer: Buffer.from('file content'),
    filename: 'image.jpg',
    mimeType: 'image/jpeg',
    size: 1024
});
```

---

## Classes

### `PipelineBuilder`

The builder class for configuring pipelines.

**Constructor:**
```typescript
constructor(config: PipelineConfig)
```

**Methods:**

| Method | Parameters | Description |
|--------|------------|-------------|
| `addValidator` | `v: Validator` | Add a validator |
| `addProcessor` | `p: Processor` | Add a processor |
| `setStorage` | `s: Storage` | Set storage backend |
| `mergeHooks` | `h: PipelineHooks` | Merge hook functions |
| `registerPlugin` | `m: PluginMeta` | Register plugin metadata |

---

## Types

### Core Types

```typescript
// Input file
type PipelineFile = {
    buffer: Buffer;
    filename: string;
    mimeType: string;
    size: number;
};

// Processing context
type PipelineContext = {
    file: PipelineFile;
    metadata: Record<string, any>;
    meta: PipelineMeta;
};

// Output result
type PipelineResult = {
    url: string;
    path: string;
    size: number;
    metadata: Record<string, any>;
    meta: PipelineMeta;
};
```

### Component Types

```typescript
// Storage backend
type Storage = {
    save(file: PipelineFile): Promise<PipelineResult>;
};

// Validator function
type Validator = (ctx: PipelineContext) => void | Promise<void>;

// Processor function
type Processor = (ctx: PipelineContext) => PipelineContext | Promise<PipelineContext>;
```

### Hook Types

```typescript
type PipelineHooks = {
    onStart?: (ctx: PipelineContext) => void | Promise<void>;
    afterValidate?: (ctx: PipelineContext) => void | Promise<void>;
    afterProcess?: (ctx: PipelineContext) => void | Promise<void>;
    onError?: (error: PipelineError | Error, ctx: PipelineContext) => void | Promise<void>;
    onFinish?: (result: PipelineResult, ctx: PipelineContext) => void | Promise<void>;
};
```

---

## Error Types

```typescript
// Error codes
type PipelineErrorCode = 
    | "VALIDATION_ERROR"
    | "PROCESSOR_ERROR"
    | "STORAGE_ERROR"
    | "UNKNOWN_ERROR";

// Error classes
class PipelineError extends Error { ... }
class ValidationError extends PipelineError { ... }
class ProcessorError extends PipelineError { ... }
class StorageError extends PipelineError { ... }
```

---

## Plugin Types

```typescript
type PipelinePluginSetup = (builder: PipelineBuilder) => void;

type PipelinePlugin = {
    name: string;
    version?: string;
    setup: PipelinePluginSetup;
};

function isPipelinePlugin(obj: any): obj is PipelinePlugin;
```
# Request & Response Schemas

## Overview

This document defines the data schemas for pipeline inputs, outputs, and internal structures.

---

## PipelineFile (Input)

Represents a file entering the pipeline.

```typescript
type PipelineFile = {
    buffer: Buffer;      // File content as Buffer
    filename: string;   // Original filename
    mimeType: string;   // MIME type (e.g., "image/jpeg")
    size: number;       // File size in bytes
};
```

**Example:**
```json
{
    "buffer": "<Buffer 89 50 4e 47 ...>",
    "filename": "photo.jpg",
    "mimeType": "image/jpeg",
    "size": 204800
}
```

---

## PipelineContext (Internal)

Internal context passed between pipeline stages.

```typescript
type PipelineContext = {
    file: PipelineFile;
    metadata: Record<string, any>;
    meta: PipelineMeta;
};
```

**Properties:**
- `file` - Current file state (may be modified by processors)
- `metadata` - User-defined metadata accumulated during processing
- `meta` - Pipeline execution metadata

---

## PipelineMeta (Internal)

Metadata about pipeline execution.

```typescript
type PipelineMeta = {
    pluginTrace: PluginTraceEvent[];
    startTime: number;
    endTime?: number;
};
```

**Properties:**
- `pluginTrace` - Array of trace events from plugins
- `startTime` - Unix timestamp when processing started
- `endTime` - Unix timestamp when processing finished

---

## PluginTraceEvent

Event recorded during plugin execution.

```typescript
type PluginTraceEvent = {
    plugin: string;
    event: string;
    timestamp: number;
    data?: Record<string, any>;
};
```

**Example:**
```json
{
    "plugin": "image-processor",
    "event": "resize",
    "timestamp": 1699876543000,
    "data": { "width": 800, "height": 600 }
}
```

---

## PipelineResult (Output)

Result returned after successful pipeline processing.

```typescript
type PipelineResult = {
    url: string;        // Public URL to access the file
    path: string;       // Storage path
    size: number;       // Final file size in bytes
    metadata: Record<string, any>;
    meta: PipelineMeta;
};
```

**Example:**
```json
{
    "url": "https://example.com/uploads/photo.jpg",
    "path": "./uploads/photo.jpg",
    "size": 153600,
    "metadata": {
        "processedAt": "2023-11-13T10:00:00Z",
        "resized": true
    },
    "meta": {
        "pluginTrace": [],
        "startTime": 1699876540000,
        "endTime": 1699876543000
    }
}
```

---

## PipelineConfig

Configuration for creating a pipeline.

```typescript
type PipelineConfig = {
    validators?: Validator[];
    processors?: Processor[];
    storage: Storage;
    hooks?: PipelineHooks;
};
```

**Properties:**
- `validators` - Optional array of validators
- `processors` - Optional array of processors
- `storage` - Required storage backend
- `hooks` - Optional lifecycle hooks

---

## Validator

Function that validates the pipeline context.

```typescript
type Validator = (ctx: PipelineContext) => void | Promise<void>;
```

**Behavior:**
- Throws `ValidationError` if validation fails
- Synchronous or async

---

## Processor

Function that transforms the file.

```typescript
type Processor = (ctx: PipelineContext) => PipelineContext | Promise<PipelineContext>;
```

**Behavior:**
- Receives and returns modified context
- Can modify `ctx.file` and `ctx.metadata`
- Synchronous or async

---

## Storage

Interface for file storage backends.

```typescript
type Storage = {
    save(file: PipelineFile): Promise<PipelineResult>;
};
```

**Methods:**
- `save(file)` - Persist file and return result

---

## PipelineHooks

Lifecycle hook functions.

```typescript
type PipelineHooks = {
    onStart?: (ctx: PipelineContext) => void | Promise<void>;
    afterValidate?: (ctx: PipelineContext) => void | Promise<void>;
    afterProcess?: (ctx: PipelineContext) => void | Promise<void>;
    onError?: (error: PipelineError | Error, ctx: PipelineContext) => void | Promise<void>;
    onFinish?: (result: PipelineResult, ctx: PipelineContext) => void | Promise<void>;
};
```

**Hooks:**
- `onStart` - Called before validation
- `afterValidate` - Called after validation passes
- `afterProcess` - Called after all processors complete
- `onError` - Called when an error occurs
- `onFinish` - Called after successful completion

---

## Error Response

When an error occurs, the pipeline throws an error.

```typescript
// ValidationError
{
    "name": "ValidationError",
    "message": "File too large",
    "code": "VALIDATION_ERROR",
    "details": {
        "size": 10485760,
        "limit": 5242880
    }
}

// ProcessorError
{
    "name": "ProcessorError",
    "message": "Image processing failed",
    "code": "PROCESSOR_ERROR",
    "details": {
        "processor": "image-resizer"
    }
}

// StorageError
{
    "name": "StorageError",
    "message": "Failed to write file",
    "code": "STORAGE_ERROR",
    "details": {
        "path": "./uploads/photo.jpg"
    }
}
```

---

## Plugin Schema

### PipelinePlugin

```typescript
type PipelinePlugin = {
    name: string;           // Unique plugin identifier
    version?: string;       // Semantic version
    setup: (builder: PipelineBuilder) => void;
};
```

### PipelinePluginSetup

```typescript
type PipelinePluginSetup = (builder: PipelineBuilder) => void;
```

---

## Type Relationships

```
PipelineFile (input)
       │
       ▼
PipelineContext (internal)
       │
       ├─► Validator ──throws──► ValidationError
       │
       ├─► Processor ──modifies──► PipelineContext
       │
       ▼
Storage.save()
       │
       ▼
PipelineResult (output)
```
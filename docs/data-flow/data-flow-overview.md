# Data Flow Overview

## High-Level Data Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT CODE                                    │
│  createPipeline(config).use(plugin).process(file)                          │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         PIPELINE CREATION PHASE                             │
│  1. createPipeline(config)                                                  │
│     └── Instantiates PipelineBuilder                                        │
│  2. .use(plugin)                                                            │
│     └── Calls plugin.setup(builder)                                         │
│     └── Registers plugin metadata                                           │
│  3. Returns { use, process }                                                │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         PROCESSING PHASE                                    │
│                                                                             │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────┐ │
│  │   onStart    │───▶│  VALIDATORS  │───▶│  PROCESSORS  │───▶│  STORAGE │ │
│  │   (hook)     │    │   (array)    │    │   (array)    │    │  (save)  │ │
│  └──────────────┘    └──────────────┘    └──────────────┘    └──────────┘ │
│       │                    │                    │                  │       │
│       ▼                    ▼                    ▼                  ▼       │
│  [tracing]           [tracing]             [tracing]           [tracing]  │
│                                                                             │
│  On Error: ─────────────────────────────────────────────────────────▶       │
│            onError hook + exception thrown                                 │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         RESULT PHASE                                        │
│  PipelineResult { url, path, size, metadata, meta }                        │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Data Transformation

### Input → Output

| Stage | Input | Output |
|-------|-------|--------|
| **Entry** | `PipelineFile` | - |
| **Validators** | `PipelineFile` | (throws on invalid) |
| **Processors** | `PipelineContext` | `PipelineContext` (enriched) |
| **Storage** | `PipelineFile` | `PipelineResult` |
| **Exit** | - | `PipelineResult` |

### Context Enrichment

The `PipelineContext` accumulates data through the pipeline:

```typescript
// Initial state
ctx = {
    file: { buffer, filename, mimeType, size },
    metadata: {},
    meta: { plugins: [], trace: [] }
}

// After processors
ctx.metadata = { step1: true, step2: true, ... }
ctx.meta.trace = [ /* trace events */ ]

// Final result
result = {
    url, path, size,
    metadata: ctx.metadata,
    meta: ctx.meta
}
```

---

## Trace Data Flow

Each pipeline stage emits trace events:

```typescript
type PluginTraceEvent = {
    plugin: string;           // Source of the event
    stage: "validator" | "processor" | "hook" | "storage";
    message: string;          // Event description
    timestamp: number;        // Unix timestamp
    duration?: number;        // Execution time in ms
};
```

**Trace Collection:**
1. `onStart` hook triggers → trace event
2. Each validator completes → trace event
3. `afterValidate` hook triggers → trace event
4. Each processor completes → trace event
5. `afterProcess` hook triggers → trace event
6. Storage save completes → trace event
7. `onFinish` hook triggers → trace event

---

## Error Propagation

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Validator  │────▶│  Processor  │────▶│   Storage   │
│  (throws)   │     │  (throws)   │     │  (throws)   │
└─────────────┘     └─────────────┘     └─────────────┘
       │                   │                   │
       └───────────────────┴───────────────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │   onError hook  │
                  │   (if registered)│
                  └────────┬────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │  Exception      │
                  │  re-thrown      │
                  └─────────────────┘
```

---

## Hook Execution Order

| # | Stage | Hook Called | Parameters |
|---|-------|-------------|------------|
| 1 | Start | `onStart` | `ctx` |
| 2 | Validate | (each validator) | `ctx` |
| 3 | Post-Validate | `afterValidate` | `ctx` |
| 4 | Process | (each processor) | `ctx` |
| 5 | Post-Process | `afterProcess` | `ctx` |
| 6 | Storage | `storage.save()` | `file` |
| 7 | Finish | `onFinish` | `result, ctx` |
| - | Error (any stage) | `onError` | `error, ctx` |

---

## Plugin Contribution Flow

```
Plugin.setup(builder)
       │
       ├── builder.addValidator(fn) ──▶ validators[]
       ├── builder.addProcessor(fn) ──▶ processors[]
       └── builder.mergeHooks({...}) ──▶ hooks{} (merged)
              │
              └── Multiple plugins' hooks are chained
                  (executed in registration order)
```

---

## Key Data Structures

### PipelineFile (Input)
```typescript
{
    buffer: Buffer;      // File content
    filename: string;    // Original filename
    mimeType: string;    // MIME type
    size: number;        // Size in bytes
}
```

### PipelineContext (Processing)
```typescript
{
    file: PipelineFile;
    metadata: Record<string, any>;  // Processor-added data
    meta: {
        plugins: PluginMeta[];      // Registered plugins
        trace: PluginTraceEvent[];  // Execution trace
    };
}
```

### PipelineResult (Output)
```typescript
{
    url: string;         // Storage location (URL)
    path: string;        // Storage location (path)
    size: number;        // Final file size
    metadata: {...};     // Enriched metadata
    meta: {...};         // Plugin metadata + trace
}
```
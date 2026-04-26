# Module Map

## Overview

This document provides a high-level map of all modules in the Media Pipeline project, their responsibilities, and dependencies.

---

## Module Directory

```
src/
├── index.ts                    # Public API exports
├── core/
│   ├── pipeline.ts            # Pipeline factory
│   ├── builder.ts             # Pipeline builder (DSL)
│   ├── executor.ts            # Pipeline execution engine
│   ├── hooks.ts               # Lifecycle hook types
│   ├── plugin.ts              # Plugin definitions
│   ├── plugin-meta.ts         # Plugin metadata types
│   ├── tracer.ts              # Execution tracing
│   └── types.ts               # Core type definitions
├── storage/
│   └── local.storage.ts       # Local filesystem storage
├── validators/
│   ├── size.validator.ts      # File size validation
│   └── mime.validator.ts      # MIME type validation
├── processors/
│   └── identity.processor.ts  # No-op processor
└── utils/
    └── errors.ts              # Error classes
```

---

## Module Classification

### Core Modules (src/core/)

| Module | Responsibility | Public API |
|--------|---------------|------------|
| `pipeline.ts` | Pipeline factory, plugin registration | `createPipeline()` |
| `builder.ts` | Component accumulation, hook merging | `PipelineBuilder` class |
| `executor.ts` | Pipeline execution orchestration | `executePipeline()` |
| `hooks.ts` | Lifecycle hook type definitions | `PipelineHooks` type |
| `plugin.ts` | Plugin structure definitions | `PipelinePlugin`, `isPipelinePlugin()` |
| `plugin-meta.ts` | Metadata and trace types | `PluginMeta`, `PipelineMeta` |
| `tracer.ts` | Execution trace recording | `trace()` |
| `types.ts` | Core type definitions | `PipelineFile`, `PipelineResult`, etc. |

### Storage Modules (src/storage/)

| Module | Responsibility | Public API |
|--------|---------------|------------|
| `local.storage.ts` | Filesystem storage implementation | `localStorage(basePath)` |

### Validator Modules (src/validators/)

| Module | Responsibility | Public API |
|--------|---------------|------------|
| `size.validator.ts` | File size validation | `maxSize(limit)` |
| `mime.validator.ts` | MIME type validation | `allowedMimeTypes(types)` |

### Processor Modules (src/processors/)

| Module | Responsibility | Public API |
|--------|---------------|------------|
| `identity.processor.ts` | No-op passthrough processor | `identityProcessor` |

### Utility Modules (src/utils/)

| Module | Responsibility | Public API |
|--------|---------------|------------|
| `errors.ts` | Error class hierarchy | `PipelineError`, `ValidationError`, etc. |

---

## Module Dependencies

```
index.ts
│
├── core/pipeline.ts
│   ├── core/builder.ts
│   │   ├── core/types.ts
│   │   ├── core/hooks.ts
│   │   └── core/plugin-meta.ts
│   ├── core/executor.ts
│   │   ├── core/types.ts
│   │   ├── core/hooks.ts
│   │   └── core/tracer.ts
│   ├── core/plugin.ts
│   └── core/plugin-meta.ts
│
├── storage/local.storage.ts
│   └── core/types.ts
│
├── validators/size.validator.ts
│   ├── core/types.ts
│   └── utils/errors.ts
│
├── validators/mime.validator.ts
│   ├── core/types.ts
│   └── utils/errors.ts
│
├── processors/identity.processor.ts
│   └── core/types.ts
│
└── utils/errors.ts
```

---

## Module Details

### Core Layer

| File | Exports | Key Types/Functions |
|------|---------|---------------------|
| `index.ts` | All public APIs | `createPipeline`, `localStorage`, validators, processors, types, errors |
| `pipeline.ts` | Pipeline factory | `createPipeline(config)` |
| `builder.ts` | Builder class | `PipelineBuilder` class |
| `executor.ts` | Execution engine | `executePipeline(params)` |
| `hooks.ts` | Hook types | `PipelineHooks` |
| `plugin.ts` | Plugin types | `PipelinePlugin`, `PipelinePluginSetup`, `isPipelinePlugin()` |
| `plugin-meta.ts` | Metadata types | `PluginMeta`, `PipelineMeta`, `PluginTraceEvent` |
| `tracer.ts` | Tracing utility | `trace(ctx, event)` |
| `types.ts` | Core types | `PipelineFile`, `PipelineResult`, `PipelineContext`, `Storage`, `Validator`, `Processor` |

### Supporting Layers

| Layer | Files | Purpose |
|-------|-------|---------|
| Storage | `local.storage.ts` | Pluggable storage backends |
| Validators | `size.validator.ts`, `mime.validator.ts` | Pre-storage validation |
| Processors | `identity.processor.ts` | File transformation |
| Utils | `errors.ts` | Error handling |

---

## Public vs Internal APIs

### Public (exported from index.ts)
- `createPipeline`
- `localStorage`
- `maxSize`
- `allowedMimeTypes`
- `identityProcessor`
- `PipelineBuilder`
- `PipelinePlugin`
- All types and errors

### Internal (not exported)
- `executePipeline`
- `trace`
- `PipelineBuilder` internals
- `PluginMeta` (exposed via types)

---

## Module Interaction Summary

```
Client Code
    │
    ▼
createPipeline() ──▶ PipelineBuilder
    │                    │
    │                    ├── addValidator()
    │                    ├── addProcessor()
    │                    ├── mergeHooks()
    │                    └── registerPlugin()
    │
    ▼
.use(plugin) ──────▶ plugin.setup(builder)
    │
    ▼
.process(file) ──▶ executePipeline()
                       │
                       ├── onStart hook
                       ├── validators (loop)
                       ├── afterValidate hook
                       ├── processors (loop)
                       ├── afterProcess hook
                       ├── storage.save()
                       └── onFinish hook
```
# Media Pipeline - Project Overview

**Version:** 1.5.12  
**Runtime:** Node.js  
**Language:** TypeScript  
**License:** MIT  
**Author:** ahmedRAOUANE

---

## Purpose

Media Pipeline is a **storage-agnostic, extensible file processing pipeline** for Node.js. It provides a modular architecture for validating, processing, and storing files through a configurable pipeline system.

---

## Core Value Proposition

- **Plugin-based extensibility** - Add custom validators, processors, and hooks
- **Storage abstraction** - Swap storage backends without changing pipeline logic
- **Lifecycle hooks** - Execute custom code at key pipeline stages
- **Traceability** - Built-in execution tracing for debugging

---

## Key Features

| Feature | Description |
|---------|-------------|
| Validators | Pre-storage file validation (size, MIME type, custom) |
| Processors | File transformation/augmentation pipeline |
| Storage | Pluggable storage backends (local, cloud, etc.) |
| Hooks | Lifecycle callbacks (onStart, afterValidate, afterProcess, onFinish, onError) |
| Plugins | Bundle validators, processors, and hooks into reusable units |
| Tracing | Execution trace with timing and stage information |

---

## Quick Start

```typescript
import {
  createPipeline,
  localStorage,
  maxSize,
  allowedMimeTypes
} from 'media-pipeline';

const pipeline = createPipeline({
  validators: [
    maxSize(5 * 1024 * 1024),
    allowedMimeTypes(['image/jpeg', 'image/png'])
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
```

---

## Project Structure

```
src/
├── index.ts              # Public API exports
├── core/
│   ├── pipeline.ts       # Pipeline factory
│   ├── builder.ts        # Pipeline builder
│   ├── executor.ts       # Pipeline execution engine
│   ├── tracer.ts         # Execution tracing
├── types/
│   ├── hooks.ts             # Lifecycle hook types
│   ├── plugin.ts            # Plugin definitions
│   ├── plugin-meta.ts       # Plugin metadata types
│   └── pipeline.ts          # Core type definitions
├── storage/
│   └── local.storage.ts  # Local filesystem storage
├── validators/
│   ├── size.validator.ts # File size validation
│   └── mime.validator.ts # MIME type validation
├── processors/
│   └── identity.processor.ts # No-op processor
└── utils/
    └── errors.ts         # Error classes
```

---

## Related Documentation

- [System Architecture](architecture/system-architecture.md)
- [Design Patterns](architecture/design-patterns.md)
- [Data Flow](data-flow/data-flow-overview.md)
- [API Reference](api/endpoints.md)
- [Module Breakdown](modules/module-map.md)
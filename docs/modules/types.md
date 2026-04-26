# Types Module

**File:** `src/core/types.ts`

## Overview

Defines all core TypeScript types used throughout the pipeline system.

---

## Core Types

### PipelineFile

Represents the input file to the pipeline.

```typescript
type PipelineFile = {
    buffer: Buffer;      // File content as Buffer
    filename: string;    // Original filename
    mimeType: string;    // MIME type (e.g., 'image/png')
    size: number;        // Size in bytes
};
```

### PipelineResult

Represents the output after pipeline completes.

```typescript
type PipelineResult = {
    url: string;                              // Storage location (URL)
    path: string;                             // Storage location (path)
    size: number;                             // Final file size
    metadata: Record<string, any>;            // Processor-added metadata
    meta: PipelineMeta;                       // Plugin metadata + trace
};
```

### PipelineContext

Carries state through the pipeline stages.

```typescript
type PipelineContext = {
    file: PipelineFile;                       // The file being processed
    metadata: Record<string, any>;            // Accumulated metadata
    meta: PipelineMeta;                       // Plugin metadata + trace
};
```

---

## Component Types

### Storage

Storage backend interface.

```typescript
type Storage = {
    save(file: PipelineFile): Promise<PipelineResult>;
};
```

### Validator

A function that validates the file.

```typescript
type Validator = (
    ctx: PipelineContext
) => void | Promise<void>;
```

**Behavior:**
- Throws on validation failure
- Returns void on success

### Processor

A function that transforms the file/context.

```typescript
type Processor = (
    ctx: PipelineContext
) => PipelineContext | Promise<PipelineContext>;
```

**Behavior:**
- Receives and returns enriched context

---

## Configuration Types

### PipelineConfig

Configuration for creating a pipeline.

```typescript
type PipelineConfig = {
    validators?: Validator[];     // Initial validators
    processors?: Processor[];     // Initial processors
    storage: Storage;             // Storage backend (required)
    hooks?: PipelineHooks;        // Lifecycle hooks
};
```

---

## Owned Types

Types that track which plugin added a component.

```typescript
type OwnedProcessor = {
    fn: Processor;
    plugin: string;
};

type OwnedValidator = {
    fn: Validator;
    plugin: string;
};
```

**Note:** These types are defined but not actively used in the current implementation (commented out in builder.ts).

---

## Code Reference

```typescript
// filepath: src/core/types.ts
import { PipelineHooks } from "./hooks";
import { PipelineMeta } from "./plugin-meta";

export type PipelineFile = {
    buffer: Buffer;
    filename: string;
    mimeType: string;
    size: number;
};

export type PipelineResult = {
    url: string;
    path: string;
    size: number;
    metadata: Record<string, any>;
    meta: PipelineMeta;
};

export type Storage = {
    save(file: PipelineFile): Promise<PipelineResult>;
};

export type PipelineContext = {
    file: PipelineFile;
    metadata: Record<string, any>;
    meta: PipelineMeta;
};

export type Validator = (
    ctx: PipelineContext
) => void | Promise<void>;

export type Processor = (
    ctx: PipelineContext
) => PipelineContext | Promise<PipelineContext>;

export type PipelineConfig = {
    validators?: Validator[];
    processors?: Processor[];
    storage: Storage;
    hooks?: PipelineHooks;
};

export type OwnedProcessor = {
    fn: Processor;
    plugin: string;
};

export type OwnedValidator = {
    fn: Validator;
    plugin: string;
};
```

---

## Related Modules

| Module | Relationship |
|--------|--------------|
| All modules | Import types from here |
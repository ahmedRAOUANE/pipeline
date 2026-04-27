# Types Module

**File:** `src/types/pipeline.ts`

## Purpose

This module defines the core pipeline contracts shared across the builder, executor, storage, validators, and processors.

---

## Core Types

```ts
type PipelineFile = {
  buffer: Buffer;
  filename: string;
  mimeType: string;
  size: number;
};

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

type PipelineContext = {
  file: PipelineFile;
  metadata: Record<string, any>;
  meta: PipelineMeta;
};
```

---

## Behavior Types

```ts
type Storage = {
  save(file: PipelineFile): Promise<PipelineResult>;
};

type Validator = (ctx: PipelineContext) => void | Promise<void>;

type Processor = (ctx: PipelineContext) => PipelineContext | Promise<PipelineContext>;
```

---

## Configuration Type

```ts
type PipelineConfig = {
  validators?: Validator[];
  processors?: Processor[];
  storage: Storage;
  hooks?: PipelineHooks;
};
```

`PipelineConfig` is used internally by the implementation, but it is not re-exported from the package root today.

---

## Related Type Modules

- `src/types/hooks.ts` - lifecycle hook signatures
- `src/types/plugin.ts` - plugin types
- `src/types/plugin-meta.ts` - trace and plugin metadata

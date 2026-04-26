# System Architecture

## High-Level Architecture

Media Pipeline follows a **layered, plugin-based architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                      Client Code                            │
│                  (createPipeline().use())                   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Pipeline Layer                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │  Pipeline   │  │   Builder   │  │     Executor        │ │
│  │   Factory   │──▶│   (DSL)     │──▶│   (Orchestrator)   │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   Processing Layer                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │ Validators  │──▶│ Processors  │──▶│      Storage       │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Hook System                              │
│  onStart → afterValidate → afterProcess → onFinish         │
│       ↘─────────────────────────────────────↗              │
│                    onError (on exception)                   │
└─────────────────────────────────────────────────────────────┘
```

---

## Core Components

### 1. Pipeline Factory (`pipeline.ts`)

**Responsibility:** Creates pipeline instances and manages plugin registration.

**Public API:**
- `createPipeline(config)` - Factory function returning pipeline instance

**Internal Logic:**
1. Instantiates `PipelineBuilder` with config
2. Returns object with `use()` and `process()` methods
3. Handles plugin normalization (function vs object form)

---

### 2. Pipeline Builder (`builder.ts`)

**Responsibility:** Accumulates pipeline components during configuration phase.

**State:**
- `validators[]` - Array of validator functions
- `processors[]` - Array of processor functions
- `hooks{}` - Lifecycle hook functions
- `storage` - Storage backend instance
- `meta` - Plugin metadata and trace

**Key Methods:**
- `addValidator(v)` - Register validator
- `addProcessor(p)` - Register processor
- `setStorage(s)` - Set storage backend
- `mergeHooks(h)` - Merge hook functions (chaining)
- `registerPlugin(m)` - Track plugin metadata

---

### 3. Pipeline Executor (`executor.ts`)

**Responsibility:** Orchestrates the actual file processing flow.

**Execution Flow:**
```
onStart → [validators] → afterValidate → [processors] → afterProcess → storage.save() → onFinish
                                    ↓
                              onError (on exception)
```

**Key Features:**
- Sequential validator execution (fail-fast)
- Sequential processor execution (context passes through)
- Single storage save at end
- Comprehensive error handling with hook callbacks

---

### 4. Plugin System (`plugin.ts`, `plugin-meta.ts`)

**Responsibility:** Enables reusable, composable pipeline extensions.

**Plugin Structure:**
```typescript
type PipelinePlugin = {
  name: string;
  version?: string;
  setup: (builder: PipelineBuilder) => void;
};
```

**Plugin Capabilities:**
- Add validators via `builder.addValidator()`
- Add processors via `builder.addProcessor()`
- Register hooks via `builder.mergeHooks()`
- Track metadata for traceability

---

### 5. Hook System (`hooks.ts`)

**Responsibility:** Provides lifecycle extension points.

| Hook | Timing | Parameters |
|------|--------|------------|
| `onStart` | Before validation | `ctx: PipelineContext` |
| `afterValidate` | After all validators pass | `ctx: PipelineContext` |
| `afterProcess` | After all processors complete | `ctx: PipelineContext` |
| `onFinish` | After successful storage | `result, ctx` |
| `onError` | On any exception | `error, ctx` |

---

### 6. Storage Abstraction (`types.ts`, `local.storage.ts`)

**Responsibility:** Decouple file persistence from pipeline logic.

**Storage Interface:**
```typescript
type Storage = {
  save(file: PipelineFile): Promise<PipelineResult>;
};
```

**Current Implementation:**
- `localStorage(basePath)` - Filesystem storage

**Extensibility:** Implement `Storage` interface for cloud storage (S3, GCS, etc.)

---

## Data Flow Architecture

```
┌──────────┐     ┌────────────┐     ┌───────────┐     ┌─────────┐     ┌─────────┐
│  Input   │────▶│  Validate  │────▶│  Process  │────▶│  Store  │────▶│ Output  │
│  File    │     │  (array)   │     │  (array)  │     │         │     │ Result  │
└──────────┘     └────────────┘     └───────────┘     └─────────┘     └─────────┘
                      │                   │               │
                      ▼                   ▼               ▼
                 [onStart]          [afterValidate]   [onFinish]
                 [afterValidate]    [afterProcess]    [onError]
```

---

## Module Dependencies

```
index.ts
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
├── storage/local.storage.ts
│   └── core/types.ts
├── validators/*.ts
│   ├── core/types.ts
│   └── utils/errors.ts
├── processors/identity.processor.ts
│   └── core/types.ts
└── utils/errors.ts
```

---

## Design Decisions

| Decision | Rationale |
|----------|-----------|
| Sequential validators | Fail-fast behavior; simpler error handling |
| Sequential processors | Context dependencies; predictable ordering |
| Storage at end | All transformations complete before persistence |
| Hook chaining | Multiple plugins can contribute to same hook |
| Plugin metadata | Traceability and debugging support |
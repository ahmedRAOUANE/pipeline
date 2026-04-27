# Design Patterns

Media Pipeline uses a handful of simple patterns rather than a large framework.

---

## 1. Factory Pattern

**Location:** `src/core/pipeline.ts`

`createPipeline(config)` hides the builder and executor internals behind a small public API.

Benefits:

- callers never construct core classes directly
- the package can evolve internally without changing the entry point

---

## 2. Builder Pattern

**Location:** `src/core/builder.ts`

`PipelineBuilder` accumulates validators, processors, hooks, storage, and plugin metadata before any file is processed.

Benefits:

- configuration is separated from execution
- plugins can extend the pipeline incrementally

---

## 3. Strategy Pattern

**Locations:** `src/types/pipeline.ts`, `src/storage/local.storage.ts`

Validators, processors, and storage all follow interface-shaped contracts:

- validator strategy: `(ctx) => void | Promise<void>`
- processor strategy: `(ctx) => PipelineContext | Promise<PipelineContext>`
- storage strategy: `save(file) => Promise<PipelineResult>`

Benefits:

- behavior can be swapped without changing executor logic
- custom implementations stay outside the core

---

## 4. Plugin Pattern

**Locations:** `src/types/plugin.ts`, `src/utils/plugins.ts`, `src/core/pipeline.ts`

Plugins group related validators, processors, hooks, or storage changes into reusable units.

Supported forms:

- object plugin with `name`, optional `version`, and `setup()`
- function plugin with optional `displayName`

Benefits:

- reusable configuration bundles
- traceable plugin metadata

---

## 5. Chain Of Responsibility

**Location:** `src/core/executor.ts`

Validators and processors run in order. Each step decides whether the pipeline continues or fails.

Benefits:

- predictable sequencing
- small focused handlers
- fail-fast validation

---

## 6. Observer-Style Hooks

**Locations:** `src/types/hooks.ts`, `src/core/builder.ts`, `src/core/executor.ts`

Lifecycle hooks let callers observe or extend the run at key checkpoints:

- `onStart`
- `afterValidate`
- `afterProcess`
- `onFinish`
- `onError`

Benefits:

- logging, metrics, and notifications stay outside core logic
- multiple hooks can be merged in registration order

---

## 7. Error Hierarchy

**Location:** `src/utils/errors.ts`

The library uses a small typed error family:

```text
PipelineError
|-- ValidationError
|-- ProcessorError
|-- StorageError
`-- PluginError
```

Benefits:

- clearer failure categories
- better `instanceof` handling in consuming apps

---

## 8. Trace Recording

**Locations:** `src/core/tracer.ts`, `src/types/plugin-meta.ts`

The executor emits structured events into `ctx.meta.trace`.

Benefits:

- lightweight observability
- no external tracing dependency

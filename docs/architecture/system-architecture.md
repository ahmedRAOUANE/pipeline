# System Architecture

## Overview

Media Pipeline uses a small layered architecture built around three ideas:

1. configuration is collected first
2. execution happens later through a single orchestrator
3. storage stays behind an interface

---

## High-Level Layout

```text
client code
  -> createPipeline(config)
  -> .use(plugin)
  -> .process(file)

core layer
  -> PipelineBuilder
  -> executePipeline()
  -> trace()

extension layer
  -> validators
  -> processors
  -> hooks
  -> storage

type and utility layer
  -> src/types/*
  -> utils/errors.ts
  -> utils/file.ts
  -> utils/plugins.ts
```

---

## Main Components

### `src/core/pipeline.ts`

- creates the pipeline instance
- normalizes plugins
- throws `PluginError` for invalid plugin inputs
- prepares a fresh per-run context before delegating to the executor

### `src/core/builder.ts`

- stores validators, processors, hooks, storage, and plugin metadata
- merges hook handlers in registration order

### `src/core/executor.ts`

- runs the lifecycle in sequence
- records trace events
- invokes `onError` before re-throwing failures

### `src/storage/local.storage.ts`

- built-in storage implementation
- sanitizes the incoming filename
- generates a unique stored name
- ensures the target directory exists and is writable

### `src/types/*`

- separates pipeline, hook, plugin, and meta types from the execution code

---

## Execution Sequence

```text
process(file)
  -> onStart
  -> validators[]
  -> afterValidate
  -> processors[]
  -> afterProcess
  -> storage.save()
  -> onFinish
```

On failure:

```text
throw
  -> onError
  -> re-throw original error
```

---

## Data Ownership

- `PipelineBuilder` owns reusable configuration
- `PipelineContext` owns per-run mutable state
- `PipelineResult` owns persisted-file output data
- `PipelineMeta.trace` is owned by the current process run

---

## Public Surface vs Internal Surface

### Public

- `createPipeline`
- `localStorage`
- built-in validators and processor
- selected types and error classes from `src/index.ts`

### Internal

- `executePipeline`
- `trace`
- `isPipelinePlugin`
- most type modules in `src/types/`

---

## Current Architectural Constraints

- pipeline input is buffer-only
- execution is sequential
- only one built-in storage provider exists
- custom storage is structurally supported, but `PipelineResult.provider` is currently typed as `"local"`

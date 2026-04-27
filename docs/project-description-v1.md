# Media Pipeline v1 Baseline

## Overview

This document captures the original MVP shape of Media Pipeline and maps it to the current implementation in version `1.6.1`.

---

## Original Core Idea

The project started from a simple target:

```text
file -> validators -> processors -> storage -> result
```

That core idea is still the heart of the library today.

---

## What The Current Code Already Delivers

The repository now includes:

- `createPipeline()` as the public factory
- `PipelineBuilder` as the configuration layer
- `executePipeline()` as the runtime engine
- built-in validators for size and MIME type
- a built-in no-op processor
- local filesystem storage
- plugin registration with object and function plugin support
- lifecycle hooks
- structured trace metadata
- typed errors including `PluginError`

---

## What Changed Since The Early MVP Plan

### Types moved into `src/types/`

The early layout assumed more type definitions would live under `src/core/`. The current codebase separates these into:

- `src/types/pipeline.ts`
- `src/types/hooks.ts`
- `src/types/plugin.ts`
- `src/types/plugin-meta.ts`

### Plugin system is implemented

The first MVP notes assumed there was no plugin system yet. That is no longer true:

- `.use()` supports object plugins
- `.use()` supports function plugins
- function plugins may provide `displayName`
- invalid plugin registration throws `PluginError`

### Storage output is richer

The earliest result shape focused on `url`, `path`, and `size`.

The current `PipelineResult` also includes:

- `originalName`
- `storedName`
- `mimeType`
- `provider`
- `metadata`
- `meta`

---

## Current Source Layout

```text
src/
|-- core/
|   |-- builder.ts
|   |-- executor.ts
|   |-- pipeline.ts
|   `-- tracer.ts
|-- processors/
|   `-- identity.processor.ts
|-- storage/
|   `-- local.storage.ts
|-- types/
|   |-- hooks.ts
|   |-- pipeline.ts
|   |-- plugin-meta.ts
|   `-- plugin.ts
|-- utils/
|   |-- errors.ts
|   |-- file.ts
|   `-- plugins.ts
|-- validators/
|   |-- mime.validator.ts
|   `-- size.validator.ts
`-- index.ts
```

---

## Still Ahead Of The Current Implementation

The original MVP roadmap also imagined things that are still future work:

- first-party image processing helpers
- first-party cloud storage adapters
- streaming support
- batch processing
- a stronger automated test workflow

So the early vision was directionally right, but the live package today is best described as a compact, buffer-based pipeline core with local storage and plugin support.

# 📦 Media Pipeline — Changelog

All notable changes to this project will be documented in this file.

This project follows **Semantic Versioning**.

---

# 🚀 [1.1.0] — Context System Upgrade

## ✨ Added

### 🧠 Pipeline Context System

Introduced a new internal abstraction:

```ts
type PipelineContext = {
  file: PipelineFile;
  metadata: Record<string, any>;
};
```

This replaces the previous direct `PipelineFile` flow inside the pipeline engine.

---

### 🔄 Context-based Execution Engine

Pipeline execution now operates on `PipelineContext`:

* Validators receive `ctx`
* Processors receive and return `ctx`
* Storage still receives `ctx.file` only

---

### 📦 Metadata Support

Added a flexible `metadata` object:

* Allows processors to share data
* Enables future features (hashing, thumbnails, logging)
* Provides extensibility without breaking API

Example:

```ts
ctx.metadata.hash = "abc123";
ctx.metadata.timestamp = Date.now();
```

---

## 🔧 Changed

### 🔁 Processor Signature

**Before:**

```ts
(file: PipelineFile) => PipelineFile
```

**After:**

```ts
(ctx: PipelineContext) => PipelineContext
```

---

### 🔁 Validator Signature

**Before:**

```ts
(file: PipelineFile) => void
```

**After:**

```ts
(ctx: PipelineContext) => void
```

---

### ⚙️ Internal Execution Flow

**Before:**

```text
file → validator → processor → storage
```

**After:**

```text
ctx(file + metadata) → validator → processor → storage(file)
```

---

## 🛡 Backward Compatibility

✅ No breaking changes

* Public API remains unchanged:

```ts
pipeline.process(file)
```

* Existing implementations continue to work without modification

---

## 🧠 Architectural Impact

This upgrade enables:

* Plugin system (planned)
* Logging hooks
* File metadata enrichment
* Multi-step processing pipelines
* Future async workflows

---

## ⚠️ Notes for Contributors

* Validators must NOT mutate `ctx`
* Processors are allowed to mutate or return new `ctx`
* Storage must only use `ctx.file`

---

# 🎉 [1.0.0] — Initial Release

## ✨ Features

* Core pipeline system
* Validator support
* Processor support
* Storage abstraction
* Local filesystem storage adapter
* TypeScript support
* NPM package publishing

---

## 🧱 Architecture

```text
file → validate → process → store → result
```

---

## 🔌 Components

* `createPipeline` (main API)
* Validators (size, mime)
* Processors (identity)
* Storage (local)

---

## 📦 Packaging

* CommonJS build
* Type definitions included (`.d.ts`)
* Compatible with Node.js and TypeScript

---

## 🚀 Status

* MVP stable
* Ready for extension

---

# 🧭 Roadmap (Upcoming)

## [1.2.0] — Error System

* Custom error classes
* Structured error handling

## [1.3.0] — Hooks System

* Lifecycle hooks (onStart, onProcess, etc.)

## [1.4.0] — Plugin System

* `pipeline.use()`
* Plugin architecture

## [1.5.0] — Image Processing

* Sharp integration
* Resize / compress / format conversion

---

# 📌 Summary

* **v1.0.0** → Core pipeline (MVP)
* **v1.1.0** → Context system (foundation for extensibility)
* Future versions → ecosystem & real-world capabilities

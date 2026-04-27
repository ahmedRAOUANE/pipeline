# Media Pipeline

Media Pipeline is a Node.js library for processing a file in three explicit stages:

```text
file -> validate -> process -> store -> result
```

Its current focus is not upload transport, UI, or media hosting. The library starts after a file is already available as a `Buffer` and ends when a storage adapter returns a normalized `PipelineResult`.

---

## What It Solves

Applications often need the same repeatable workflow:

- accept a file from some outer layer
- reject bad inputs early
- apply one or more transformations
- persist the final output
- return metadata and trace information

Media Pipeline turns that workflow into a small composable runtime instead of forcing every application to hand-roll it again.

---

## Current Scope

The implementation in this repository currently provides:

- pipeline creation through `createPipeline()`
- plugin registration through `.use()`
- built-in validators:
  - `maxSize(limit)`
  - `allowedMimeTypes(types)`
- built-in processor:
  - `identityProcessor`
- built-in storage:
  - `localStorage(basePath)`
- lifecycle hooks for start, post-validation, post-processing, finish, and error handling
- trace collection through `result.meta.trace`
- dual CommonJS and ESM package output

---

## What It Is Not

Media Pipeline does not currently provide:

- multipart upload parsing
- HTTP routing
- a browser uploader
- image resizing out of the box
- cloud storage adapters out of the box
- batch or streaming execution

Those concerns belong either to the consuming application or to future extensions.

---

## Architectural Shape

The package is organized around a few small contracts:

- `Validator` decides whether a file may continue
- `Processor` transforms or annotates the runtime context
- `Storage` persists the final file and returns a `PipelineResult`
- `PipelineBuilder` accumulates configuration
- `executePipeline()` runs the lifecycle in order

This keeps the core small while letting consumers plug in custom logic where it matters.

---

## Current Strengths

- no runtime npm dependencies
- clear per-stage lifecycle
- typed error hierarchy
- plugin-friendly configuration model
- trace data returned with each run

---

## Current Constraints

- buffer-only input
- sequential execution
- only one built-in storage provider
- provider typing currently only includes `"local"`
- no npm-wired test runner yet

---

## Intended Usage

Typical consumers are server-side applications that already have a file in memory and want a predictable way to validate, transform, and persist it without mixing that logic into controllers or route handlers.

# Glossary

## Terms

### Pipeline

A processing chain that takes a file through validation, transformation, and storage stages.

### Plugin

An extension module that can add validators, processors, hooks, or storage backends to a pipeline.

### Validator

A function that checks if a file meets certain criteria (e.g., size, MIME type).

### Processor

A function that transforms a file or its metadata during pipeline execution.

### Storage

An interface for persisting files to a backend (local filesystem, S3, etc.).

### Hook

A lifecycle callback function that runs at specific points during pipeline execution.

### Context

The internal state object passed between pipeline stages containing file data and metadata.

### Result

The output object returned after successful pipeline processing.

---

## Types

### PipelineFile

The input file object containing buffer, filename, mimeType, and size.

### PipelineContext

The internal context object passed through validators and processors.

### PipelineResult

The output object returned after successful processing.

### PipelineConfig

Configuration object for creating a pipeline instance.

### PipelineHooks

Object containing lifecycle hook functions.

---

## Error Types

### PipelineError

Base error class for all pipeline errors.

### ValidationError

Error thrown when file validation fails.

### ProcessorError

Error thrown when a processor fails.

### StorageError

Error thrown when storage operation fails.

---

## Patterns

### Builder Pattern

A design pattern where a builder object accumulates configuration before creating the final product.

### Chain of Responsibility

A design pattern where each handler in a chain processes a request or passes it to the next handler.

### Plugin Architecture

A system design where functionality is extended through modular, composable plugins.

### Hook Pattern

A pattern where callback functions are called at specific lifecycle events.

---

## Technical Terms

### Buffer

A Node.js Buffer object containing raw binary file data.

### MIME Type

Media type identifier (e.g., "image/jpeg", "application/pdf").

### ESM

ECMAScript Module - JavaScript module format using `import`/`export`.

### CJS

CommonJS - JavaScript module format using `require`/`module.exports`.

### tsup

A TypeScript bundler used to build the project.

### TypeScript

A typed superset of JavaScript.

---

## Related

- [Module Map](modules/module-map.md)
- [API Reference](api/endpoints.md)
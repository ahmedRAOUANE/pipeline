# Assumptions

## Runtime Assumptions

- The library runs in Node.js, not the browser
- Files enter the pipeline as `Buffer` objects
- Validation, processing, and storage happen sequentially
- Consumers are comfortable handling async functions and thrown errors

---

## Current Implementation Assumptions

- `createPipeline()` is called with a valid `storage` implementation
- Plugin objects passed to `.use()` have a non-empty `name` and a `setup()` function
- Function plugins may be unnamed; in that case the pipeline falls back to `displayName`, `function.name`, or `"anonymous-plugin"`
- Each `process()` call gets a fresh `trace` array and a copied plugin metadata list
- The built-in storage adapter writes to a writable local directory

---

## File Handling Assumptions

- The current pipeline is buffer-based and loads the whole file into memory
- `localStorage()` sanitizes the incoming filename before generating a stored filename
- `localStorage()` generates a unique persisted filename instead of writing the original filename directly
- No streaming support is built in yet

---

## Error Handling Assumptions

- Errors are propagated back to the caller after `onError` runs
- The core library provides typed error classes, but it does not automatically wrap every arbitrary processor failure into `ProcessorError`
- Hook failures inside `onError` are logged to `console.error` and do not replace the original thrown error

---

## Packaging Assumptions

- Consumers may use either `require()` or `import`
- The package root is the supported public entry point
- Not every internal type is re-exported from `src/index.ts`

---

## Known Design Tensions

- The `Storage` interface is generic enough for custom backends, but `PipelineResult.provider` is currently narrowed to `"local"`
- The repository includes `tests/`, but there is no official npm-driven automated test workflow yet
- The root `README.md` is older than the implementation and may lag the docs in `docs/`

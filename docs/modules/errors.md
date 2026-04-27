# Errors Module

**File:** `src/utils/errors.ts`

## Error Hierarchy

```text
PipelineError
|-- ValidationError
|-- ProcessorError
|-- StorageError
`-- PluginError
```

---

## Error Codes

```ts
type PipelineErrorCode =
  | "VALIDATION_ERROR"
  | "PROCESSOR_ERROR"
  | "STORAGE_ERROR"
  | "UNKNOWN_ERROR"
  | "PLUGIN_ERROR";
```

---

## Notes On Usage

- `ValidationError` is used by the built-in validators
- `StorageError` is used by the built-in local storage adapter
- `PluginError` is used during invalid plugin registration
- `ProcessorError` is exported for consumers and custom processors, but the core executor does not automatically wrap every thrown processor failure into `ProcessorError`

---

## Common Caller Pattern

```ts
try {
  await pipeline.process(file);
} catch (err) {
  if (err instanceof ValidationError) {
    // validation issue
  } else if (err instanceof StorageError) {
    // persistence issue
  } else if (err instanceof PluginError) {
    // registration issue
  }
}
```

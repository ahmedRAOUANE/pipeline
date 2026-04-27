# Storage Module

**Files:** `src/storage/local.storage.ts`, `src/utils/file.ts`

## Purpose

The built-in storage layer persists files to the local filesystem and returns a normalized `PipelineResult`.

---

## `localStorage(basePath)`

Returns a `Storage` implementation with a single `save(file)` method.

### Save flow

1. sanitize `file.filename`
2. generate a unique stored name from the sanitized filename and MIME type
3. create the base directory if needed
4. verify the directory is writable
5. write the file buffer
6. return a result with local metadata

---

## Result Shape

The built-in adapter returns:

```ts
{
  url: `file://${absolutePath}`,
  path: filePath,
  size: file.size,
  originalName,
  storedName,
  mimeType: file.mimeType,
  provider: "local",
  metadata: {},
  meta: {
    plugins: [],
    trace: [],
  },
}
```

The executor later replaces `meta` with the runtime context meta object.

---

## Helper Functions

### `sanitizeFilename(filename)`

- replaces path separators and other unsafe characters with `-`
- removes null bytes
- trims whitespace
- falls back to `"file"` if nothing usable remains

### `generateStoredName(originalName, mimeType)`

- preserves a safe original extension when possible
- otherwise infers a small set of extensions from MIME type
- prefixes the final name with a timestamp and random suffix

---

## Error Behavior

If the directory is not writable, `localStorage()` throws `StorageError` with the original error message in `details.originalError`.

# Validators Module

**Files:** `src/validators/size.validator.ts`, `src/validators/mime.validator.ts`

## Built-In Validators

### `maxSize(limit)`

- returns a `Validator`
- throws `ValidationError` when `ctx.file.size > limit`
- includes `size` and `limit` in `details`

### `allowedMimeTypes(types)`

- returns a `Validator`
- throws `ValidationError` when `ctx.file.mimeType` is not in `types`
- includes `received` and `allowed` in `details`

---

## Shared Characteristics

- both validators operate on `PipelineContext`
- both can be used directly in `createPipeline({ validators: [...] })`
- both are synchronous today, though the validator contract allows async implementations

---

## Internal Dependencies

- `src/types/pipeline.ts`
- `src/utils/errors.ts`

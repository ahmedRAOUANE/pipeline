# Module Map

## Source Tree

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

## Module Roles

| Area | Files | Responsibility |
|------|-------|----------------|
| Entry point | `index.ts` | package exports |
| Core | `core/*` | pipeline creation and execution |
| Types | `types/*` | shared type definitions |
| Storage | `storage/local.storage.ts` | built-in filesystem persistence |
| Validators | `validators/*` | built-in validation rules |
| Processors | `processors/*` | built-in processing steps |
| Utilities | `utils/*` | errors, filename helpers, plugin type guard |

---

## Core Dependencies

```text
index.ts
  -> core/pipeline.ts
  -> core/builder.ts
  -> storage/local.storage.ts
  -> validators/*
  -> processors/*
  -> utils/errors.ts

core/pipeline.ts
  -> core/executor.ts
  -> core/builder.ts
  -> types/pipeline.ts
  -> types/plugin.ts
  -> utils/plugins.ts
  -> utils/errors.ts

core/executor.ts
  -> types/pipeline.ts
  -> types/hooks.ts
  -> core/tracer.ts

core/builder.ts
  -> types/pipeline.ts
  -> types/hooks.ts
  -> types/plugin-meta.ts

storage/local.storage.ts
  -> types/pipeline.ts
  -> utils/errors.ts
  -> utils/file.ts
```

---

## Public Package Surface

Exported from `src/index.ts`:

- `createPipeline`
- `localStorage`
- `maxSize`
- `allowedMimeTypes`
- `identityProcessor`
- `PipelineBuilder`
- `PipelineFile`
- `PipelineResult`
- `Processor`
- `Validator`
- `Storage`
- `PipelineContext`
- `PipelinePlugin`
- `PipelineErrorCode`
- `PipelineError`
- `ValidationError`
- `ProcessorError`
- `StorageError`
- `PluginError`

Not exported from the root package:

- `executePipeline`
- `trace`
- `isPipelinePlugin`
- `PipelineConfig`
- `PipelineHooks`
- `PipelineMeta`
- `PluginMeta`
- `PipelinePluginFunction`
- `PipelinePluginSetup`

---

## Practical Reading Order

1. `src/index.ts`
2. `src/core/pipeline.ts`
3. `src/core/builder.ts`
4. `src/core/executor.ts`
5. `src/types/pipeline.ts`
6. `src/storage/local.storage.ts`
7. `src/utils/errors.ts`

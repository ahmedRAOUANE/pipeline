# External Services

## Overview

The core library does not depend on any external services.

- Built-in storage: local filesystem via `localStorage(basePath)`
- Built-in validators and processor: fully local
- Built-in tracing: in-memory only

External services only enter the picture when a consuming application supplies a custom `Storage`, validator, processor, or hook.

---

## Current Integration Surface

The primary extension point for outside services is the `Storage` interface:

```ts
type Storage = {
  save(file: PipelineFile): Promise<PipelineResult>;
};
```

Custom processors and validators can also call third-party SDKs if needed.

---

## Important Current Limitation

`PipelineResult.provider` is currently typed as `"local"` in `src/types/pipeline.ts`.

That means custom cloud adapters are structurally possible, but fully typed provider names such as `"s3"` or `"cloudinary"` are not part of the exported union yet. Consumers who build those adapters today will need to work around that typing gap until the provider union is expanded.

---

## Example: S3-style Storage Adapter

```ts
import type { PipelineFile, PipelineResult, Storage } from "media-pipeline";

const s3Storage: Storage = {
  async save(file: PipelineFile): Promise<PipelineResult> {
    const originalName = file.filename;
    const storedName = `${Date.now()}-${file.filename}`;
    const key = `uploads/${storedName}`;

    // upload file.buffer with your SDK here

    return {
      url: `https://example-bucket.s3.amazonaws.com/${key}`,
      path: key,
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
    };
  },
};
```

The `provider: "local"` value above is a temporary typing compromise imposed by the current `PipelineProvider` union.

---

## Common Integrations

| Category | Typical use | Where it plugs in |
|----------|-------------|-------------------|
| AWS S3 / MinIO / GCS / Azure Blob | Remote persistence | `Storage.save()` |
| `sharp` | Image resize or conversion | custom `Processor` |
| `file-type` | MIME sniffing from bytes | custom `Validator` |
| metrics/logging SDKs | observability | hooks such as `onStart`, `onFinish`, `onError` |

---

## Practical Guidance

- Keep remote SDK calls inside storage adapters or processors, not in the core pipeline setup
- Return a complete `PipelineResult` shape from custom storage implementations
- Preserve `metadata` and `meta` objects even if the adapter does not add anything itself
- If you need a provider name beyond `"local"`, document the cast locally until the core type grows

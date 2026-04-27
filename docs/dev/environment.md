# Environment Configuration

## Overview

The library itself does not require any environment variables. All core behavior is configured in code through `createPipeline()` and `localStorage(basePath)`.

Environment variables only become relevant in consuming applications when they want to parameterize storage paths, size limits, or third-party credentials for custom adapters.

---

## No Required Core Variables

The following are true for the current codebase:

- `localStorage()` receives its base path as a function argument
- validators receive their limits through normal function parameters
- processors and hooks are regular functions and can read `process.env` if the consuming app wants them to
- the package does not read any environment variables on its own

---

## Common Consumer Patterns

### Local storage path

```ts
const uploadPath = process.env.STORAGE_PATH || "./uploads";

const pipeline = createPipeline({
  storage: localStorage(uploadPath),
});
```

### Validation limits

```ts
const maxBytes = Number(process.env.MAX_FILE_SIZE || "5242880");
const allowedTypes = (process.env.ALLOWED_MIME_TYPES || "image/jpeg,image/png").split(",");

const pipeline = createPipeline({
  storage: localStorage("./uploads"),
  validators: [maxSize(maxBytes), allowedMimeTypes(allowedTypes)],
});
```

---

## Custom Storage Credentials

If you implement your own `Storage`, the credentials belong to that integration layer rather than the core package.

Examples:

```bash
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=...
S3_BUCKET=...
```

```bash
AZURE_STORAGE_CONNECTION_STRING=...
AZURE_STORAGE_CONTAINER_NAME=...
```

---

## Current Build Configuration

### `tsconfig.json`

```json
{
  "compilerOptions": {
    "module": "NodeNext",
    "target": "esnext",
    "types": ["node"],
    "sourceMap": true,
    "declaration": true,
    "declarationMap": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "strict": true,
    "jsx": "react-jsx",
    "ignoreDeprecations": "6.0",
    "isolatedModules": true,
    "noUncheckedSideEffectImports": true,
    "moduleDetection": "force",
    "skipLibCheck": true
  }
}
```

### `tsup.config.ts`

```ts
import { defineConfig } from "tsup";

export default defineConfig({
    entry: ["src/index.ts"],
    format: ["cjs", "esm"],
    dts: true,
    clean: true,
    outDir: "dist",
});
```

---

## Operational Notes

- `localStorage()` writes to disk and checks that the target directory is writable
- the generated result URL uses the `file://` scheme for local storage
- per-run trace data is created in memory and returned through `result.meta.trace`

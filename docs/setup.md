# Media Pipeline - Development Setup Report

## Overview

This document captures the current development setup for the library as it exists in this repository on version `1.6.1`.

- Repository folder: `media-pipline`
- Published package name: `media-pipeline`
- Build output folder: `dist/`
- Documentation root: `docs/`

---

## Current Tooling

| Tool | Version | Role |
|------|---------|------|
| `typescript` | `^6.0.3` | Source typing and declaration generation |
| `tsup` | `^8.5.1` | Bundling to CommonJS and ESM |
| `ts-node` | `^10.9.2` | Ad hoc TypeScript execution during development |
| `@types/node` | `^25.6.0` | Node.js type definitions |

The project has no runtime npm dependencies. Production code only relies on Node.js built-in modules such as `fs`, `path`, and `crypto`.

---

## package.json Snapshot

```json
{
  "name": "media-pipeline",
  "version": "1.6.1",
  "description": "A storage-agnostic file processing pipeline for Node.js",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.js"
    }
  },
  "scripts": {
    "build": "tsup"
  },
  "files": [
    "dist"
  ]
}
```

### Notes

- The package publishes dual module output through the root `exports` map.
- Only the `build` script is wired in `package.json`.
- The repository contains `tests/`, but there is no configured npm test runner at the moment.

---

## Build Configuration

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

### Current build outputs

- `dist/index.js` - CommonJS entry used by `require()`
- `dist/index.mjs` - ESM entry used by `import`
- `dist/index.d.ts` - CommonJS-flavored type declarations
- `dist/index.d.mts` - ESM-flavored type declarations

---

## TypeScript Configuration

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

### Notes

- The repo uses `NodeNext` module semantics during development.
- Declarations and declaration maps are produced for consumers.
- Strict type-checking is enabled.

---

## Source Layout

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

### Important implementation details

- Core type definitions live in `src/types/`, not `src/core/`.
- `localStorage()` sanitizes the original filename, generates a unique stored filename, checks directory writability, and returns a `file://` URL.
- `createPipeline().use()` supports both object plugins and function plugins.
- Function plugins can provide a `displayName` for better trace naming.

---

## Current Development Workflow

1. Install dependencies with `npm install`
2. Build with `npm run build`
3. Consume the generated package from `dist/` or from the packed tarball

The repository also includes exploratory scripts in `tests/`, but they are not currently exposed through npm scripts and should be treated as manual smoke tests rather than a formal automated suite.

---

## Known Gaps In The Setup

- No `engines` field is declared in `package.json`
- No `test`, `dev`, or `typecheck` npm scripts are configured
- No lint or format tooling is checked in
- The root `README.md` is older than the codebase and should not be treated as the source of truth

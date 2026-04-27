# NPM Packages

## Overview

This document lists the npm packages declared in the current repository state.

---

## Runtime Dependencies

The library declares no production dependencies.

| Package | Version | Purpose |
|---------|---------|---------|
| None | - | Runtime code uses Node.js built-ins only |

---

## Dev Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `@types/node` | `^25.6.0` | Node.js type definitions |
| `ts-node` | `^10.9.2` | Manual TypeScript execution |
| `tsup` | `^8.5.1` | Bundling and declaration output |
| `typescript` | `^6.0.3` | Source typing |

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

### Output files

- `dist/index.js`
- `dist/index.mjs`
- `dist/index.d.ts`
- `dist/index.d.mts`

---

## TypeScript Configuration

Key TypeScript settings from `tsconfig.json`:

```json
{
  "compilerOptions": {
    "module": "NodeNext",
    "target": "esnext",
    "types": ["node"],
    "sourceMap": true,
    "declaration": true,
    "declarationMap": true,
    "strict": true,
    "isolatedModules": true,
    "skipLibCheck": true
  }
}
```

---

## package.json Scripts

```json
{
  "scripts": {
    "build": "tsup"
  }
}
```

The repository does not currently define `dev`, `test`, or `typecheck` scripts.

---

## Package Philosophy

- Zero runtime dependencies
- Dual CommonJS and ESM output
- Minimal public surface from `src/index.ts`
- Extension through custom validators, processors, and storage implementations instead of bundled integrations

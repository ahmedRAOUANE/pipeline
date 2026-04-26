# NPM Packages

## Overview

This document lists all npm dependencies used by the Media Pipeline project.

---

## Dependencies

### Production Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| None | - | Zero runtime dependencies |

The Media Pipeline is designed to be **dependency-free** at runtime, relying only on Node.js built-in modules.

---

## Dev Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `typescript` | ^5.0.0 | TypeScript language support |
| `tsup` | ^8.0.0 | Build tool for bundling |
| `vitest` | ^1.0.0 | Testing framework |
| `@types/node` | ^20.0.0 | Node.js type definitions |

---

## Build Configuration

### tsup

The project uses `tsup` for building:

```typescript
// tsup.config.ts
import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/index.ts'],
    format: ['cjs', 'esm'],
    dts: true,
    splitting: false,
    sourcemap: true,
    clean: true,
});
```

**Output:**
- CommonJS: `dist/index.cjs`
- ESM: `dist/index.js`
- TypeScript declarations: `dist/index.d.ts`

---

## TypeScript Configuration

```json
// tsconfig.json
{
    "compilerOptions": {
        "target": "ES2020",
        "module": "ESNext",
        "lib": ["ES2020"],
        "moduleResolution": "node",
        "strict": true,
        "esModuleInterop": true,
        "skipLibCheck": true,
        "forceConsistentCasingInFileNames": true,
        "declaration": true,
        "declarationMap": true,
        "sourceMap": true,
        "outDir": "./dist"
    },
    "include": ["src/**/*"],
    "exclude": ["node_modules", "dist", "tests"]
}
```

---

## Package.json Scripts

```json
{
    "scripts": {
        "build": "tsup",
        "dev": "tsup --watch",
        "test": "vitest run",
        "test:watch": "vitest",
        "typecheck": "tsc --noEmit"
    }
}
```

---

## Philosophy

The project follows a **minimal dependencies** philosophy:

- **No runtime dependencies** - Reduces attack surface and bundle size
- **Node.js native** - Uses built-in `fs`, `path`, `buffer` modules
- **Plugin architecture** - External integrations via user-provided implementations

---

## Related Documentation

- [Setup Guide](../dev/setup.md)
- [Environment Configuration](../dev/environment.md)
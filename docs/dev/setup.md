# Setup Guide

## Prerequisites

| Requirement | Version | Notes |
|-------------|---------|-------|
| Node.js | >= 18.0.0 | LTS recommended |
| npm | >= 9.0.0 | Comes with Node.js |

---

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd media-pipeline
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Build the Project

```bash
npm run build
```

This generates:
- `dist/index.cjs` - CommonJS build
- `dist/index.js` - ES Module build
- `dist/index.d.ts` - TypeScript declarations

---

## Development

### Watch Mode

For development with auto-rebuild:

```bash
npm run dev
```

### Type Checking

```bash
npm run typecheck
```

---

## Testing

### Run All Tests

```bash
npm test
```

### Watch Mode

```bash
npm run test:watch
```

### Test Coverage

```bash
npm test -- --coverage
```

---

## Project Structure

```
media-pipeline/
├── src/
│   ├── index.ts           # Main entry point
│   ├── core/              # Core pipeline modules
│   │   ├── builder.ts
│   │   ├── executor.ts
│   │   ├── hooks.ts
│   │   ├── pipeline.ts
│   │   ├── plugin.ts
│   │   ├── plugin-meta.ts
│   │   ├── tracer.ts
│   │   └── types.ts
│   ├── processors/        # Built-in processors
│   ├── storage/           # Storage implementations
│   ├── utils/             # Utilities
│   └── validators/        # Built-in validators
├── tests/                 # Test files
├── dist/                  # Build output
├── docs/                  # Documentation
├── package.json
├── tsconfig.json
└── tsup.config.ts
```

---

## Creating a Pipeline

### Basic Usage

```typescript
import { createPipeline, localStorage, maxSize, allowedMimeTypes } from './dist/index.js';

// Create pipeline
const pipeline = createPipeline({
    storage: localStorage('./uploads'),
    validators: [
        maxSize(5 * 1024 * 1024),           // 5MB limit
        allowedMimeTypes(['image/jpeg', 'image/png'])
    ]
});

// Process a file
const result = await pipeline.process({
    buffer: Buffer.from('...'),
    filename: 'photo.jpg',
    mimeType: 'image/jpeg',
    size: 1024000
});

console.log(result.url);  // Output URL
```

### With Plugins

```typescript
import { createPipeline, localStorage } from './dist/index.js';
import imagePlugin from './plugins/image-processor';

const pipeline = createPipeline({
    storage: localStorage('./uploads')
})
.use(imagePlugin);

const result = await pipeline.process(file);
```

---

## Building for Production

### Build Command

```bash
npm run build
```

### Output Files

| File | Format | Usage |
|------|--------|-------|
| `dist/index.cjs` | CommonJS | `require('media-pipeline')` |
| `dist/index.js` | ES Module | `import from 'media-pipeline'` |
| `dist/index.d.ts` | TypeScript | Type definitions |

---

## Troubleshooting

### Build Errors

If build fails, ensure:
1. Node.js >= 18 is installed
2. Dependencies are installed: `npm install`
3. TypeScript is available: `npx tsc --version`

### Type Errors

Run type checking:
```bash
npm run typecheck
```

### Test Failures

Run tests with verbose output:
```bash
npm test -- --verbose
```

---

## Related Documentation

- [Environment Configuration](environment.md)
- [API Reference](../api/endpoints.md)
- [Module Documentation](../modules/module-map.md)
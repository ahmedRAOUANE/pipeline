# Environment Configuration

## Overview

This document describes environment variables and configuration options for the Media Pipeline.

---

## Environment Variables

### Storage Configuration

| Variable | Required | Description | Default |
|----------|----------|-------------|---------|
| `STORAGE_PATH` | No | Base path for local storage | `./uploads` |
| `STORAGE_BASE_URL` | No | Public URL prefix for stored files | Dynamic |

### Custom Storage Providers

#### AWS S3

```bash
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
S3_BUCKET=your-bucket-name
```

#### Cloudinary

```bash
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

#### Azure Blob

```bash
AZURE_STORAGE_CONNECTION_STRING=your_connection_string
AZURE_STORAGE_CONTAINER_NAME=your_container
```

---

## Configuration Files

### TypeScript Configuration

`tsconfig.json`:

```json
{
    "compilerOptions": {
        "target": "ES2020",
        "module": "ESNext",
        "strict": true,
        "esModuleInterop": true,
        "skipLibCheck": true,
        "forceConsistentCasingInFileNames": true
    }
}
```

### Build Configuration

`tsup.config.ts`:

```typescript
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

---

## Pipeline Configuration

### Programmatic Configuration

```typescript
const pipeline = createPipeline({
    storage: localStorage(process.env.STORAGE_PATH || './uploads'),
    validators: [
        maxSize(parseInt(process.env.MAX_FILE_SIZE || '5242880'))
    ],
    hooks: {
        onError: (err, ctx) => {
            console.error('Pipeline error:', err.message);
        }
    }
});
```

### Validation Limits

```typescript
// Environment-driven limits
const MAX_SIZE = parseInt(process.env.MAX_FILE_SIZE || '10485760');  // 10MB default
const ALLOWED_TYPES = (process.env.ALLOWED_MIME_TYPES || 'image/jpeg,image/png').split(',');

const pipeline = createPipeline({
    storage: localStorage('./uploads'),
    validators: [
        maxSize(MAX_SIZE),
        allowedMimeTypes(ALLOWED_TYPES)
    ]
});
```

---

## Logging Configuration

### Basic Logging

```typescript
const pipeline = createPipeline({
    storage: localStorage('./uploads'),
    hooks: {
        onStart: (ctx) => console.log('Starting:', ctx.file.filename),
        onFinish: (result) => console.log('Completed:', result.url),
        onError: (err) => console.error('Error:', err.message)
    }
});
```

### Structured Logging

```typescript
const pipeline = createPipeline({
    storage: localStorage('./uploads'),
    hooks: {
        onStart: (ctx) => {
            console.log(JSON.stringify({
                event: 'pipeline_start',
                filename: ctx.file.filename,
                size: ctx.file.size,
                timestamp: new Date().toISOString()
            }));
        }
    }
});
```

---

## Security Configuration

### File Size Limits

Always set maximum file sizes to prevent DoS:

```typescript
const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE || '10485760'); // 10MB

const pipeline = createPipeline({
    storage: localStorage('./uploads'),
    validators: [maxSize(MAX_FILE_SIZE)]
});
```

### MIME Type Validation

Restrict allowed types:

```typescript
const ALLOWED_TYPES = (process.env.ALLOWED_MIME_TYPES || 'image/jpeg,image/png,image/gif').split(',');

const pipeline = createPipeline({
    storage: localStorage('./uploads'),
    validators: [allowedMimeTypes(ALLOWED_TYPES)]
});
```

---

## Node.js Configuration

### Recommended Settings

```bash
# Increase memory for large file processing
NODE_OPTIONS="--max-old-space-size=4096"

# Enable experimental features if needed
NODE_OPTIONS="--experimental-vm-modules"
```

### Process Environment

```typescript
// Access environment in processors
const myProcessor: Processor = async (ctx) => {
    const featureFlag = process.env.ENABLE_FEATURE === 'true';
    if (featureFlag) {
        // Feature logic
    }
    return ctx;
};
```

---

## Related Documentation

- [Setup Guide](setup.md)
- [API Reference](../api/endpoints.md)
- [External Services](../dependencies/external-services.md)
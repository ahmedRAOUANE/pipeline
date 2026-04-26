# Storage Module

**File:** `src/storage/local.storage.ts`

## Overview

Provides a local filesystem storage implementation for the pipeline.

---

## Responsibilities

1. **File Persistence** - Save files to local filesystem
2. **Directory Creation** - Create upload directories as needed
3. **Result Generation** - Return storage location and metadata

---

## Public API

### `localStorage(basePath: string): Storage`

Creates a local storage instance.

**Parameters:**
- `basePath` - Directory path where files will be saved

**Returns:**
- `Storage` interface implementation

---

## Implementation Details

```typescript
function localStorage(basePath: string): Storage {
    return {
        async save(file: PipelineFile): Promise<PipelineResult> {
            const filePath = path.join(basePath, file.filename);
            
            await fs.mkdir(basePath, { recursive: true });
            await fs.writeFile(filePath, file.buffer);
            
            return {
                url: filePath,
                path: filePath,
                size: file.size,
                metadata: {},
                meta: {
                    plugins: [],
                    trace: [],
                },
            };
        },
    };
}
```

---

## Usage

```typescript
import { createPipeline, localStorage } from 'media-pipeline';

const pipeline = createPipeline({
    storage: localStorage('./uploads')
});

const result = await pipeline.process({
    buffer: Buffer.from('file content'),
    filename: 'document.pdf',
    mimeType: 'application/pdf',
    size: 1024
});

console.log(result.url);  // "./uploads/document.pdf"
```

---

## Code Reference

```typescript
// filepath: src/storage/local.storage.ts
import fs from "fs/promises";
import path from "path";
import { PipelineFile, PipelineResult, Storage } from "../core/types";

export function localStorage(basePath: string): Storage {
    return {
        async save(file: PipelineFile): Promise<PipelineResult> {
            const filePath = path.join(basePath, file.filename);

            await fs.mkdir(basePath, { recursive: true });
            await fs.writeFile(filePath, file.buffer);

            return {
                url: filePath,
                path: filePath,
                size: file.size,
                metadata: {},
                meta: {
                    plugins: [], 
                    trace: [],
                },
            };
        },
    };
}
```

---

## Extending Storage

To implement custom storage (e.g., S3, GCS):

```typescript
import { Storage, PipelineFile, PipelineResult } from 'media-pipeline';

const s3Storage = (config: S3Config): Storage => ({
    async save(file: PipelineFile): Promise<PipelineResult> {
        const key = `uploads/${file.filename}`;
        await s3Client.upload({
            Bucket: config.bucket,
            Key: key,
            Body: file.buffer
        });
        
        return {
            url: `https://${config.bucket}.s3.amazonaws.com/${key}`,
            path: key,
            size: file.size,
            metadata: {},
            meta: { plugins: [], trace: [] }
        };
    }
});

const pipeline = createPipeline({
    storage: s3Storage({ bucket: 'my-bucket' })
});
```

---

## Related Modules

| Module | Relationship |
|--------|--------------|
| `types.ts` | Defines Storage interface |
| `pipeline.ts` | Uses storage from config |
| `executor.ts` | Calls storage.save() |
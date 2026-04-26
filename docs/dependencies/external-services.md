# External Services

## Overview

This document lists external services and integrations used by the Media Pipeline.

---

## Storage Backends

### Local Filesystem

**Default storage:** Local filesystem via `localStorage()`

- Uses Node.js `fs` module
- Files stored in configured base path
- No external service dependencies

### Custom Storage

Implement the `Storage` interface to integrate external services:

```typescript
import { Storage, PipelineFile, PipelineResult } from 'media-pipeline';

const s3Storage: Storage = {
    async save(file: PipelineFile): Promise<PipelineResult> {
        // Upload to S3
        const url = await s3Client.upload(file);
        return { url, path: s3Key, size: file.size };
    }
};
```

---

## Common Integrations

### Cloud Storage Providers

| Provider | Interface | Notes |
|----------|-----------|-------|
| AWS S3 | `Storage` | Use AWS SDK |
| Google Cloud Storage | `Storage` | Use @google-cloud/storage |
| Azure Blob Storage | `Storage` | Use @azure/storage-blob |

### Image Processing

| Library | Purpose | Integration |
|---------|---------|-------------|
| `sharp` | Image resizing, format conversion | Custom processor |
| `imagemagick` | Advanced image operations | Custom processor |
| `canvas` | Canvas operations | Custom processor |

### File Validation

| Library | Purpose | Integration |
|---------|---------|-------------|
| `file-type` | Detect MIME type from buffer | Custom validator |
| `magic-bytes` | Magic number detection | Custom validator |

---

## Example: S3 Storage Integration

```typescript
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { Storage, PipelineFile, PipelineResult } from "media-pipeline";

const s3Client = new S3Client({ region: "us-east-1" });

const s3Storage: Storage = {
    async save(file: PipelineFile): Promise<PipelineResult> {
        const key = `uploads/${Date.now()}-${file.filename}`;
        
        await s3Client.send(new PutObjectCommand({
            Bucket: process.env.S3_BUCKET,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimeType
        }));
        
        const url = `https://${process.env.S3_BUCKET}.s3.amazonaws.com/${key}`;
        
        return {
            url,
            path: key,
            size: file.size,
            metadata: {},
            meta: { pluginTrace: [], startTime: Date.now() }
        };
    }
};

// Usage
const pipeline = createPipeline({
    storage: s3Storage,
    validators: [maxSize(10 * 1024 * 1024)]
});
```

---

## Example: Cloudinary Integration

```typescript
import { v2 as cloudinary } from 'cloudinary';
import { Storage, PipelineFile, PipelineResult } from "media-pipeline";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const cloudinaryStorage: Storage = {
    async save(file: PipelineFile): Promise<PipelineResult> {
        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { folder: 'uploads' },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            uploadStream.end(file.buffer);
        });
        
        return {
            url: result.secure_url,
            publicId: result.public_id,
            size: result.bytes,
            metadata: {},
            meta: { pluginTrace: [], startTime: Date.now() }
        };
    }
};
```

---

## Related Documentation

- [Storage Module](../modules/storage.md)
- [Custom Processors](../modules/processors.md)
- [Custom Validators](../modules/validators.md)
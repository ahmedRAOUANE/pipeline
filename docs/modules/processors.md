# Processors Module

**File:** `src/processors/identity.processor.ts`

## Overview

Built-in processor functions for file transformation.

---

## Identity Processor

**File:** `src/processors/identity.processor.ts`

### `identityProcessor: Processor`

A no-op (identity) processor that returns the context unchanged.

**Purpose:**
- Placeholder for cases where no transformation needed
- Testing and debugging
- Preserving context through pipeline stage

### Usage

```typescript
import { identityProcessor, createPipeline, localStorage } from 'media-pipeline';

const pipeline = createPipeline({
    storage: localStorage('./uploads'),
    processors: [
        identityProcessor  // No transformation
    ]
});
```

### Code Reference

```typescript
// filepath: src/processors/identity.processor.ts
import { Processor } from "../core/types";

export const identityProcessor: Processor = async (ctx) => {
    return ctx;
};
```

---

## Custom Processors

### Creating a Custom Processor

Processors receive and return a `PipelineContext`:

```typescript
import { Processor, PipelineContext } from 'media-pipeline';

const imageResizer: Processor = async (ctx: PipelineContext) => {
    // Access file
    const { buffer, filename, mimeType } = ctx.file;
    
    // Transform (example with sharp or similar)
    // const resized = await sharp(buffer).resize(800, 600).toBuffer();
    
    // Update context
    ctx.file = {
        buffer: buffer,  // or resized
        filename: filename,
        mimeType: mimeType,
        size: buffer.length
    };
    
    // Add metadata
    ctx.metadata.resized = true;
    ctx.metadata.originalSize = ctx.file.size;
    
    return ctx;
};
```

### Processor Chaining

Multiple processors execute in order:

```typescript
const pipeline = createPipeline({
    storage: localStorage('./uploads'),
    processors: [
        imageResizer,      // First: resize
        imageCompress,     // Second: compress
        watermark          // Third: add watermark
    ]
});
```

### Async Processors

Processors can be async:

```typescript
const asyncProcessor: Processor = async (ctx) => {
    const data = await externalService.process(ctx.file.buffer);
    ctx.metadata.externalResult = data;
    return ctx;
};
```

---

## Processor Patterns

### Metadata Enrichment

```typescript
const metadataProcessor: Processor = async (ctx) => {
    ctx.metadata.processedAt = new Date().toISOString();
    ctx.metadata.processor = 'custom';
    return ctx;
};
```

### File Transformation

```typescript
const transformProcessor: Processor = async (ctx) => {
    // Transform ctx.file.buffer
    // Update ctx.file properties
    return ctx;
};
```

### Conditional Processing

```typescript
const conditionalProcessor: Processor = async (ctx) => {
    if (ctx.file.mimeType.startsWith('image/')) {
        // Process images only
    }
    return ctx;
};
```

---

## Related Modules

| Module | Relationship |
|--------|--------------|
| `types.ts` | Processor type definition |
| `builder.ts` | Stores processors |
| `executor.ts` | Executes processors |
# Validators Module

**Files:** `src/validators/size.validator.ts`, `src/validators/mime.validator.ts`

## Overview

Built-in validator functions for common file validation scenarios.

---

## Size Validator

**File:** `src/validators/size.validator.ts`

### `maxSize(limit: number): Validator`

Validates that file size does not exceed the specified limit.

**Parameters:**
- `limit` - Maximum allowed size in bytes

**Returns:**
- `Validator` function

### Usage

```typescript
import { maxSize, createPipeline, localStorage } from 'media-pipeline';

const pipeline = createPipeline({
    storage: localStorage('./uploads'),
    validators: [
        maxSize(5 * 1024 * 1024)  // 5MB limit
    ]
});

// This will throw ValidationError if file > 5MB
const result = await pipeline.process(file);
```

### Code Reference

```typescript
// filepath: src/validators/size.validator.ts
import { Validator } from "../core/types";
import { ValidationError } from "../utils/errors";

export function maxSize(limit: number): Validator {
    return (ctx) => {
        if (ctx.file.size > limit) {
            throw new ValidationError("File too large", {
                size: ctx.file.size,
                limit,
            });
        }
    };
}
```

---

## MIME Type Validator

**File:** `src/validators/mime.validator.ts`

### `allowedMimeTypes(types: string[]): Validator`

Validates that the file's MIME type is in the allowed list.

**Parameters:**
- `types` - Array of allowed MIME types

**Returns:**
- `Validator` function

### Usage

```typescript
import { allowedMimeTypes, createPipeline, localStorage } from 'media-pipeline';

const pipeline = createPipeline({
    storage: localStorage('./uploads'),
    validators: [
        allowedMimeTypes(['image/jpeg', 'image/png', 'image/gif'])
    ]
});

// This will throw ValidationError if not an image
const result = await pipeline.process(file);
```

### Code Reference

```typescript
// filepath: src/validators/mime.validator.ts
import { Validator } from "../core/types";
import { ValidationError } from "../utils/errors";

export function allowedMimeTypes(types: string[]): Validator {
    return (ctx) => {
        if (!types.includes(ctx.file.mimeType)) {
            throw new ValidationError("Invalid mime type", {
                received: ctx.file.mimeType,
                allowed: types,
            });
        }
    };
}
```

---

## Custom Validators

### Creating a Custom Validator

```typescript
import { Validator, PipelineContext } from 'media-pipeline';
import { ValidationError } from 'media-pipeline';

const customValidator: Validator = (ctx: PipelineContext) => {
    // Check filename extension
    const allowedExtensions = ['.jpg', '.png', '.pdf'];
    const ext = path.extname(ctx.file.filename).toLowerCase();
    
    if (!allowedExtensions.includes(ext)) {
        throw new ValidationError("Invalid file extension", {
            extension: ext,
            allowed: allowedExtensions
        });
    }
    
    // Additional checks...
};

const pipeline = createPipeline({
    storage: localStorage('./uploads'),
    validators: [customValidator]
});
```

---

## Related Modules

| Module | Relationship |
|--------|--------------|
| `types.ts` | Validator type definition |
| `errors.ts` | ValidationError class |
| `builder.ts` | Stores validators |
| `executor.ts` | Executes validators |
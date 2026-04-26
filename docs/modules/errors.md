# Errors Module

**File:** `src/utils/errors.ts`

## Overview

Defines a hierarchy of error classes for different pipeline failure scenarios.

---

## Error Hierarchy

```
Error
  │
  └── PipelineError (base class)
        │
        ├── ValidationError
        │
        ├── ProcessorError
        │
        └── StorageError
```

---

## Error Codes

```typescript
type PipelineErrorCode =
    | "VALIDATION_ERROR"
    | "PROCESSOR_ERROR"
    | "STORAGE_ERROR"
    | "UNKNOWN_ERROR";
```

---

## PipelineError

Base error class for all pipeline errors.

```typescript
class PipelineError extends Error {
    public code: PipelineErrorCode;
    public details: Record<string, unknown> | undefined;
    
    constructor(
        message: string,
        code: PipelineErrorCode = "UNKNOWN_ERROR",
        details?: Record<string, unknown>
    );
}
```

**Properties:**
- `message` - Error message
- `code` - Error code for programmatic handling
- `details` - Additional error context

---

## ValidationError

Thrown when file validation fails.

```typescript
class ValidationError extends PipelineError {
    constructor(message: string, details?: Record<string, any>);
}
// code: "VALIDATION_ERROR"
```

**Common Usage:**
```typescript
throw new ValidationError("File too large", {
    size: ctx.file.size,
    limit: 5 * 1024 * 1024
});
```

---

## ProcessorError

Thrown when a processor fails.

```typescript
class ProcessorError extends PipelineError {
    constructor(message: string, details?: Record<string, any>);
}
// code: "PROCESSOR_ERROR"
```

---

## StorageError

Thrown when storage operation fails.

```typescript
class StorageError extends PipelineError {
    constructor(message: string, details?: Record<string, any>);
}
// code: "STORAGE_ERROR"
```

---

## Code Reference

```typescript
// filepath: src/utils/errors.ts
export type PipelineErrorCode =
    | "VALIDATION_ERROR"
    | "PROCESSOR_ERROR"
    | "STORAGE_ERROR"
    | "UNKNOWN_ERROR";

export class PipelineError extends Error {
    public code: PipelineErrorCode;
    public details: Record<string, unknown> | undefined;

    constructor(
        message: string,
        code: PipelineErrorCode = "UNKNOWN_ERROR",
        details?: Record<string, unknown>
    ) {
        super(message);
        this.name = "PipelineError";
        this.code = code;
        this.details = details;
    }
}

export class ValidationError extends PipelineError {
    constructor(message: string, details?: Record<string, any>) {
        super(message, "VALIDATION_ERROR", details);
        this.name = "ValidationError";
    }
}

export class ProcessorError extends PipelineError {
    constructor(message: string, details?: Record<string, any>) {
        super(message, "PROCESSOR_ERROR", details);
        this.name = "ProcessorError";
    }
}

export class StorageError extends PipelineError {
    constructor(message: string, details?: Record<string, any>) {
        super(message, "STORAGE_ERROR", details);
        this.name = "StorageError";
    }
}
```

---

## Error Handling

### Catching Specific Errors

```typescript
import { ValidationError, ProcessorError, StorageError } from 'media-pipeline';

try {
    const result = await pipeline.process(file);
} catch (err) {
    if (err instanceof ValidationError) {
        console.log('Validation failed:', err.message);
        console.log('Details:', err.details);
    } else if (err instanceof ProcessorError) {
        console.log('Processing failed:', err.message);
    } else if (err instanceof StorageError) {
        console.log('Storage failed:', err.message);
    } else {
        console.log('Unknown error:', err);
    }
}
```

### Error Code Handling

```typescript
import { PipelineError, PipelineErrorCode } from 'media-pipeline';

switch (err.code) {
    case 'VALIDATION_ERROR':
        // Handle validation
        break;
    case 'PROCESSOR_ERROR':
        // Handle processor
        break;
    case 'STORAGE_ERROR':
        // Handle storage
        break;
    default:
        // Handle unknown
}
```

---

## Related Modules

| Module | Relationship |
|--------|--------------|
| `validators.ts` | Throws ValidationError |
| `processors/` | Throws ProcessorError |
| `storage/` | Throws StorageError |
| `executor.ts` | Catches and re-throws errors |
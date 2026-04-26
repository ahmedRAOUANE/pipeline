# Hooks Module

**File:** `src/core/hooks.ts`

## Overview

Defines lifecycle hook types that allow external code to execute at key pipeline stages.

---

## Responsibilities

1. **Hook Type Definitions** - Define the signature of each lifecycle hook
2. **Lifecycle Extension Points** - Provide places to inject custom logic

---

## Hook Types

```typescript
type PipelineHooks = {
    onStart?: (ctx: PipelineContext) => void | Promise<void>;
    afterValidate?: (ctx: PipelineContext) => void | Promise<void>;
    afterProcess?: (ctx: PipelineContext) => void | Promise<void>;
    onError?: (error: PipelineError | Error, ctx: PipelineContext) => void | Promise<void>;
    onFinish?: (result: PipelineResult, ctx: PipelineContext) => void | Promise<void>;
};
```

---

## Hook Reference

| Hook | Timing | Parameters | Common Use Cases |
|------|--------|------------|------------------|
| `onStart` | Before validation | `ctx` | Logging, metrics, request ID generation |
| `afterValidate` | After validators pass | `ctx` | Audit logging, metadata initialization |
| `afterProcess` | After processors complete | `ctx` | Additional transformations, logging |
| `onError` | On any exception | `error, ctx` | Error logging, cleanup, notifications |
| `onFinish` | After successful storage | `result, ctx` | Success logging, notifications, cleanup |

---

## Usage Examples

### Basic Hooks

```typescript
const pipeline = createPipeline({
    storage: localStorage('./uploads'),
    hooks: {
        onStart: (ctx) => {
            console.log(`Processing ${ctx.file.filename}`);
        },
        onFinish: (result, ctx) => {
            console.log(`Saved to ${result.url}`);
        },
        onError: (error, ctx) => {
            console.error(`Failed: ${error.message}`);
        }
    }
});
```

### Async Hooks

```typescript
const pipeline = createPipeline({
    storage: localStorage('./uploads'),
    hooks: {
        onFinish: async (result, ctx) => {
            await sendNotification(result.url);
            await logToAnalytics(ctx.meta);
        }
    }
});
```

---

## Hook Execution Order

When multiple plugins register hooks, they are chained in registration order:

```typescript
// Plugin A
builder.mergeHooks({
    onStart: async (ctx) => { console.log('A start'); }
});

// Plugin B  
builder.mergeHooks({
    onStart: async (ctx) => { console.log('B start'); }
});

// Execution order: A then B
await ctx.hooks.onStart(ctx); // Logs: "A start", then "B start"
```

---

## Code Reference

```typescript
// filepath: src/core/hooks.ts
import { PipelineContext, PipelineResult } from "./types";
import { PipelineError } from "../utils/errors";

export type PipelineHooks = {
    onStart?: (ctx: PipelineContext) => void | Promise<void>;
    afterValidate?: (ctx: PipelineContext) => void | Promise<void>;
    afterProcess?: (ctx: PipelineContext) => void | Promise<void>;
    onError?: (error: PipelineError | Error, ctx: PipelineContext) => void | Promise<void>;
    onFinish?: (result: PipelineResult, ctx: PipelineContext) => void | Promise<void>;
};
```

---

## Related Modules

| Module | Relationship |
|--------|--------------|
| `builder.ts` | Merges and stores hooks |
| `executor.ts` | Executes hooks at appropriate times |
| `types.ts` | PipelineContext, PipelineResult types |
| `errors.ts` | PipelineError type |
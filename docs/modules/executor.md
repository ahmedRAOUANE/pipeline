# Executor Module

**File:** `src/core/executor.ts`

## Overview

The executor is the runtime engine that orchestrates the complete pipeline flow. It executes validators, processors, and storage in sequence while managing lifecycle hooks and tracing.

---

## Responsibilities

1. **Flow Orchestration** - Execute pipeline stages in correct order
2. **Error Handling** - Catch errors and invoke onError hook
3. **Tracing** - Record execution events with timing
4. **Context Propagation** - Pass enriched context through stages

---

## Execution Flow

```
onStart
    │
    ▼
[validators] ──▶ afterValidate
    │                   │
    │                   ▼
    │              [processors] ──▶ afterProcess
    │                   │                   │
    │                   │                   ▼
    │                   │              storage.save()
    │                   │                   │
    └───────────────────┴──────────────────▶│
                                          ▼
                                      onFinish
                                          
On Error: ──▶ onError ──▶ throw
```

---

## Public API

### `executePipeline(params)`

```typescript
async function executePipeline(params: {
    ctx: PipelineContext;
    validators?: Validator[];
    processors?: Processor[];
    storage: Storage;
    hooks?: PipelineHooks;
}): Promise<PipelineResult>
```

---

## Stage Details

### 1. onStart Hook

```typescript
await hooks?.onStart?.(ctx);
trace(ctx, { plugin: "core", stage: "hook", message: "onStart executed" });
```

### 2. Validation Phase

```typescript
for (const validator of params.validators ?? []) {
    const start = Date.now();
    await validator(ctx);  // Throws on validation failure
    trace(ctx, {
        plugin: validator.name || "anonymous-validator",
        stage: "validator",
        message: "validation passed",
        duration: Date.now() - start,
    });
}
await hooks?.afterValidate?.(ctx);
```

**Behavior:**
- Sequential execution (fail-fast)
- Each validator must pass for next to run
- Duration tracked for each validator

### 3. Processing Phase

```typescript
for (const processor of params.processors ?? []) {
    const start = Date.now();
    ctx = await processor(ctx);  // Context enriched
    trace(ctx, {
        plugin: processor.name || "anonymous-processor",
        stage: "processor",
        message: "processed",
        duration: Date.now() - start,
    });
}
await hooks?.afterProcess?.(ctx);
```

**Behavior:**
- Sequential execution
- Each processor receives and returns context
- Context accumulates metadata

### 4. Storage Phase

```typescript
const start = Date.now();
const result = await params.storage.save(ctx.file);
trace(ctx, {
    plugin: "storage",
    stage: "storage",
    message: "file saved",
    duration: Date.now() - start,
});
```

### 5. onFinish Hook

```typescript
await hooks?.onFinish?.(result, ctx);
trace(ctx, { plugin: "core", stage: "hook", message: "onFinish executed" });

return { ...result, metadata: ctx.metadata, meta: ctx.meta };
```

---

## Error Handling

```typescript
try {
    // ... all stages ...
} catch (err: any) {
    const error = err instanceof Error ? err : new Error(String(err));
    
    await hooks?.onError?.(error, ctx);
    trace(ctx, {
        plugin: "core",
        stage: "hook",
        message: "onError executed",
    });

    throw err;
}
```

**Behavior:**
- All errors caught and converted to Error instances
- onError hook called before re-throwing
- Trace event recorded

---

## Code Reference

```typescript
// filepath: src/core/executor.ts
export async function executePipeline(params: {
    ctx: PipelineContext;
    validators?: Validator[];
    processors?: Processor[];
    storage: Storage;
    hooks?: PipelineHooks;
}): Promise<PipelineResult> {
    let ctx = params.ctx;
    const hooks = params.hooks;

    try {
        // 🟢 onStart
        await hooks?.onStart?.(ctx);
        trace(ctx, { plugin: "core", stage: "hook", message: "onStart executed" });
        
        // 🟡 Validation
        for (const validator of params.validators ?? []) {
            const start = Date.now();
            await validator(ctx);
            trace(ctx, { /* ... */ });
        }
        await hooks?.afterValidate?.(ctx);
        
        // 🔵 Processing
        for (const processor of params.processors ?? []) {
            const start = Date.now();
            ctx = await processor(ctx);
            trace(ctx, { /* ... */ });
        }
        await hooks?.afterProcess?.(ctx);
        
        // 💾 Storage
        const start = Date.now();
        const result = await params.storage.save(ctx.file);
        trace(ctx, { /* ... */ });
        
        // 🟣 onFinish
        await hooks?.onFinish?.(result, ctx);
        trace(ctx, { plugin: "core", stage: "hook", message: "onFinish executed" });

        return { ...result, metadata: ctx.metadata, meta: ctx.meta };

    } catch (err: any) {
        const error = err instanceof Error ? err : new Error(String(err));
        await hooks?.onError?.(error, ctx);
        trace(ctx, { plugin: "core", stage: "hook", message: "onError executed" });
        throw err;
    }
}
```

---

## Related Modules

| Module | Relationship |
|--------|--------------|
| `pipeline.ts` | Calls executor with builder state |
| `builder.ts` | Provides components to executor |
| `tracer.ts` | Records execution events |
| `hooks.ts` | Hook type definitions |
| `types.ts` | Core type definitions |
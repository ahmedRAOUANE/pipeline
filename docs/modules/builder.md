# Builder Module

**File:** `src/core/builder.ts`

## Overview

The `PipelineBuilder` class is responsible for accumulating pipeline components during the configuration phase. It provides a fluent DSL for registering validators, processors, hooks, and storage.

---

## Responsibilities

1. **Component Accumulation** - Store validators, processors, hooks
2. **Hook Merging** - Chain multiple hooks of the same type
3. **Plugin Tracking** - Maintain metadata about registered plugins
4. **Storage Management** - Hold the storage backend reference

---

## State

```typescript
class PipelineBuilder {
    validators: Validator[] = [];
    processors: Processor[] = [];
    hooks: PipelineHooks = {};
    storage: Storage;
    meta: PipelineMeta = {
        plugins: [],
        trace: []
    };
    private currentPlugin?: string;
}
```

---

## Public API

### Constructor

```typescript
constructor(config: PipelineConfig)
```

Initializes with validators, processors, hooks, and storage from config.

---

### Methods

#### `addValidator(v: Validator)`

Register a validator function.

```typescript
builder.addValidator(maxSize(5 * 1024 * 1024));
```

#### `addProcessor(p: Processor)`

Register a processor function.

```typescript
builder.addProcessor(imageTransformer);
```

#### `setStorage(storage: Storage)`

Set or replace the storage backend.

```typescript
builder.setStorage(s3Storage({ bucket: 'my-bucket' }));
```

#### `mergeHooks(hooks: PipelineHooks)`

Merge hook functions, chaining same-type hooks.

```typescript
builder.mergeHooks({
    onStart: async (ctx) => { /* ... */ }
});
```

**Hook Chaining Logic:**

| Hook | Chaining Behavior |
|------|-------------------|
| `onStart` | Sequential execution |
| `afterValidate` | Sequential execution |
| `afterProcess` | Sequential execution |
| `onError` | Sequential execution (error, ctx) |
| `onFinish` | Sequential execution (result, ctx) |

#### `registerPlugin(meta: PluginMeta)`

Track plugin metadata.

```typescript
builder.registerPlugin({ name: 'my-plugin', version: '1.0.0' });
```

---

## Hook Merging Details

The `mergeHooks` method implements sequential chaining:

```typescript
switch (k) {
    case "onStart":
    case "afterValidate":
    case "afterProcess":
        this.hooks[k] = async (ctx) => {
            await (existing as any)(ctx);
            await (incoming as any)(ctx);
        };
        break;

    case "onError":
        this.hooks[k] = async (err, ctx) => {
            await (existing as any)(err, ctx);
            await (incoming as any)(err, ctx);
        };
        break;

    case "onFinish":
        this.hooks[k] = async (result, ctx) => {
            await (existing as any)(result, ctx);
            await (incoming as any)(result, ctx);
        };
        break;
}
```

**Note:** Hooks execute in registration order (FIFO).

---

## Code Reference

```typescript
// filepath: src/core/builder.ts
export class PipelineBuilder {
    validators: Validator[] = [];
    processors: Processor[] = [];
    hooks: PipelineHooks = {};
    storage: Storage;
    meta: PipelineMeta = {
        plugins: [],
        trace: []
    };

    constructor(config: PipelineConfig) {
        this.validators = config.validators ?? [];
        this.processors = config.processors ?? [];
        this.hooks = config.hooks ?? {};
        this.storage = config.storage;
    }

    addValidator(v: Validator) {
        this.validators.push(v);
    }

    addProcessor(p: Processor) {
        this.processors.push(p);
    }

    setStorage(storage: Storage) {
        this.storage = storage;
    }

    mergeHooks(hooks: PipelineHooks) {
        // ... hook chaining logic
    }

    registerPlugin(meta: PluginMeta) {
        this.meta.plugins.push(meta);
    }
}
```

---

## Usage Example

```typescript
const builder = new PipelineBuilder({
    storage: localStorage('./uploads'),
    validators: [maxSize(5 * 1024 * 1024)]
});

// Add via builder directly
builder.addValidator(allowedMimeTypes(['image/png']));
builder.addProcessor(imageResizer);

// Merge hooks from plugin
builder.mergeHooks({
    onStart: (ctx) => console.log('Start'),
    onFinish: (result) => console.log('Done')
});

// Track plugin
builder.registerPlugin({ name: 'image-plugin', version: '1.0.0' });
```

---

## Related Modules

| Module | Relationship |
|--------|--------------|
| `pipeline.ts` | Uses builder to accumulate components |
| `executor.ts` | Reads components from builder |
| `hooks.ts` | Hook type definitions |
| `types.ts` | Validator, Processor, Storage types |
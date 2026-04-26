# Pipeline Module

**File:** `src/core/pipeline.ts`

## Overview

The pipeline module is the main entry point for creating pipeline instances. It provides the `createPipeline` factory function and manages the plugin registration flow.

---

## Responsibilities

1. **Factory Function** - Create pipeline instances with configuration
2. **Plugin Registration** - Handle both object and function plugin forms
3. **API Surface** - Expose chainable `use()` and `process()` methods

---

## Public API

### `createPipeline(config: PipelineConfig)`

Creates a new pipeline instance.

**Parameters:**
```typescript
type PipelineConfig = {
    validators?: Validator[];
    processors?: Processor[];
    storage: Storage;
    hooks?: PipelineHooks;
};
```

**Returns:**
```typescript
{
    use(plugin: PipelinePlugin | PipelinePluginSetup): this;
    process(file: PipelineFile): Promise<PipelineResult>;
}
```

---

## Internal Logic

### Plugin Normalization

The `use()` method handles two plugin forms:

```typescript
// Form 1: Object with setup method
const plugin = {
    name: 'my-plugin',
    version: '1.0.0',
    setup(builder) { /* ... */ }
};

// Form 2: Function (setup is the function itself)
const plugin = (builder) => { /* ... */ };
// or with name property
const plugin = function namedPlugin(builder) { /* ... */ };
```

**Normalization Logic:**
```typescript
if (isPipelinePlugin(plugin)) {
    setup = plugin.setup;
    name = plugin.name;
    version = plugin.version;
} else if (typeof plugin === 'function') {
    setup = plugin;
    name = plugin.name || "anonymous-plugin";
} else {
    throw new Error("Plugin must be an object with setup() or a function");
}
```

---

## Execution Flow

```
createPipeline(config)
    │
    ▼
new PipelineBuilder(config)
    │
    ▼
Return { use, process }
    │
    ├── use(plugin) ──▶ plugin.setup(builder) + registerPlugin()
    │
    └── process(file)
            │
            ▼
        executePipeline({...})
```

---

## Code Reference

```typescript
// filepath: src/core/pipeline.ts
export function createPipeline(config: PipelineConfig) {
    const builder = new PipelineBuilder(config);

    return {
        use(plugin: PipelinePlugin | PipelinePluginSetup) {
            let setup: PipelinePluginSetup;
            let name: string = "anonymous-plugin";
            let version: string | undefined;

            if (isPipelinePlugin(plugin)) {
                setup = plugin.setup;
                name = plugin.name;
                version = plugin.version;
            } else if (typeof plugin === 'function') {
                setup = plugin;
                name = plugin.name || "anonymous-plugin";
            } else {
                throw new Error("Plugin must be an object with setup() or a function");
            }

            setup(builder);
            builder.registerPlugin({ name, version } as unknown as PluginMeta);
            return this;
        },
        async process(file: PipelineFile) {
            const ctx: PipelineContext = {
                file,
                metadata: {},
                meta: builder.meta
            };
            return executePipeline({
                ctx,
                storage: builder.storage,
                validators: builder.validators,
                processors: builder.processors,
                hooks: builder.hooks,
            });
        }
    };
}
```

---

## Related Modules

| Module | Relationship |
|--------|--------------|
| `builder.ts` | Creates builder instance |
| `executor.ts` | Executes the pipeline |
| `plugin.ts` | Plugin type definitions |
| `plugin-meta.ts` | Metadata types |
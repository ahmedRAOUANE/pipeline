# Plugin Module

**File:** `src/core/plugin.ts`

## Overview

Defines the plugin system for creating reusable, composable pipeline extensions.

---

## Responsibilities

1. **Plugin Type Definitions** - Define structure for plugins
2. **Plugin Detection** - Type guard for identifying plugin objects

---

## Types

### PipelinePlugin

```typescript
type PipelinePlugin = {
    name: string;
    version?: string;
    setup: PipelinePluginSetup;
};
```

### PipelinePluginSetup

```typescript
type PipelinePluginSetup = (builder: PipelineBuilder) => void;
```

---

## Helper Functions

### `isPipelinePlugin(obj)`

Type guard to check if an object is a PipelinePlugin.

```typescript
function isPipelinePlugin(obj: any): obj is PipelinePlugin {
    return obj && typeof obj === 'object' && 'setup' in obj && typeof obj.setup === 'function';
}
```

---

## Plugin Forms

### Form 1: Object with setup method

```typescript
const myPlugin = {
    name: 'image-processor',
    version: '1.0.0',
    setup(builder: PipelineBuilder) {
        builder.addValidator(allowedMimeTypes(['image/png', 'image/jpeg']));
        builder.addProcessor(imageResizer);
        builder.mergeHooks({ onStart: logStart });
    }
};

pipeline.use(myPlugin);
```

### Form 2: Function (setup is the function itself)

```typescript
const myPlugin = (builder: PipelineBuilder) => {
    builder.addValidator(allowedMimeTypes(['image/png']));
    builder.addProcessor(imageResizer);
};

pipeline.use(myPlugin);
```

### Form 3: Named function

```typescript
function imagePlugin(builder: PipelineBuilder) {
    builder.addValidator(allowedMimeTypes(['image/png']));
}

imagePlugin.name = 'image-plugin';  // Set name property

pipeline.use(imagePlugin);
```

---

## Code Reference

```typescript
// filepath: src/core/plugin.ts
import { PipelineBuilder } from "./builder";

export type PipelinePluginSetup = (builder: PipelineBuilder) => void;

export type PipelinePlugin = {
    name: string,
    version?: string,
    setup: PipelinePluginSetup
};

export function isPipelinePlugin(obj: any): obj is PipelinePlugin {
    return obj && typeof obj === 'object' && 'setup' in obj && typeof obj.setup === 'function';
}
```

---

## Plugin Best Practices

1. **Versioning** - Always provide a version for traceability
2. **Single Responsibility** - Each plugin should handle one concern
3. **Idempotent Setup** - Plugin setup should be safe to call once
4. **Error Handling** - Let pipeline handle errors; plugins focus on logic

---

## Related Modules

| Module | Relationship |
|--------|--------------|
| `pipeline.ts` | Processes plugin registration |
| `builder.ts` | Receives plugin setup calls |
| `plugin-meta.ts` | Plugin metadata types |
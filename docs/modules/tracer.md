# Tracer Module

**File:** `src/core/tracer.ts`

## Overview

Provides execution tracing functionality to record pipeline events with timing information.

---

## Responsibilities

1. **Event Recording** - Add trace events to the pipeline context
2. **Timing Capture** - Record execution duration for each stage

---

## Public API

### `trace(ctx: PipelineContext, event: TraceEvent)`

Records a trace event in the pipeline context.

```typescript
trace(ctx, {
    plugin: "my-plugin",
    stage: "processor",
    message: "processed",
    duration: 15
});
```

---

## Trace Event Structure

```typescript
type PluginTraceEvent = {
    plugin: string;           // Source of the event
    stage: "validator" | "processor" | "hook" | "storage";
    message: string;          // Event description
    timestamp: number;        // Unix timestamp (ms)
    duration?: number;        // Execution time (ms)
};
```

---

## Usage

The tracer is used internally by the executor to record each pipeline stage:

```typescript
// In executor.ts
trace(ctx, {
    plugin: "core",
    stage: "hook",
    message: "onStart executed",
});

trace(ctx, {
    plugin: validator.name || "anonymous-validator",
    stage: "validator",
    message: "validation passed",
    duration: Date.now() - start,
});
```

---

## Code Reference

```typescript
// filepath: src/core/tracer.ts
import { PipelineContext } from "./types";

export function trace(
    ctx: PipelineContext,
    event: Omit<PipelineContext["meta"]["trace"][0], "timestamp">
) {
    ctx.meta.trace.push({
        ...event,
        timestamp: Date.now(),
    });
}
```

---

## Trace Output Example

```typescript
ctx.meta.trace = [
    {
        plugin: "core",
        stage: "hook",
        message: "onStart executed",
        timestamp: 1714060800000
    },
    {
        plugin: "maxSize",
        stage: "validator",
        message: "validation passed",
        timestamp: 1714060800001,
        duration: 0
    },
    {
        plugin: "image-processor",
        stage: "processor",
        message: "processed",
        timestamp: 1714060800010,
        duration: 9
    },
    {
        plugin: "storage",
        stage: "storage",
        message: "file saved",
        timestamp: 1714060800020,
        duration: 10
    }
];
```

---

## Related Modules

| Module | Relationship |
|--------|--------------|
| `executor.ts` | Calls trace() for each stage |
| `plugin-meta.ts` | Defines trace event types |
| `types.ts` | PipelineContext includes trace |
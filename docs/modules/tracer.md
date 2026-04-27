# Tracer Module

**File:** `src/core/tracer.ts`

## Purpose

`trace()` appends a structured event to `ctx.meta.trace`.

---

## Function Shape

```ts
function trace(
  ctx: PipelineContext,
  event: Omit<PipelineContext["meta"]["trace"][0], "timestamp">
)
```

The helper adds `timestamp: Date.now()` automatically.

---

## Event Shape

```ts
{
  plugin: string;
  stage: "validator" | "processor" | "hook" | "storage";
  message: string;
  timestamp: number;
  duration?: number;
}
```

---

## Where It Is Used

The executor records trace events after each major step:

- `onStart`
- each validator
- `afterValidate`
- each processor
- `afterProcess`
- storage save
- `onFinish`
- `onError`

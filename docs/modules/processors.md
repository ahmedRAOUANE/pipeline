# Processors Module

**File:** `src/processors/identity.processor.ts`

## Built-In Processor

### `identityProcessor`

```ts
export const identityProcessor: Processor = async (ctx) => {
  return ctx;
};
```

This processor exists as a baseline no-op implementation.

Useful when:

- you want an explicit processor stage during experimentation
- you are testing pipeline sequencing
- you need a placeholder while building a custom processor

---

## Processor Contract

Custom processors follow:

```ts
type Processor = (
  ctx: PipelineContext
) => PipelineContext | Promise<PipelineContext>;
```

Processors may:

- change `ctx.file`
- enrich `ctx.metadata`
- return a new context object
- throw their own errors, including `ProcessorError` if the caller wants typed failures

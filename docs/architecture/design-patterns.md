# Design Patterns

Media Pipeline employs several well-established design patterns to achieve extensibility, modularity, and maintainability.

---

## 1. Builder Pattern

**Location:** `src/core/builder.ts`

**Purpose:** Construct pipeline configurations through a fluent API.

**Implementation:**
```typescript
const pipeline = createPipeline({ storage: localStorage('./uploads') })
    .use(validatorPlugin())
    .use(processorPlugin());
```

**Benefits:**
- Separates construction from execution
- Enables method chaining
- Accumulates components (validators, processors, hooks)

---

## 2. Plugin/Module Pattern

**Location:** `src/core/plugin.ts`

**Purpose:** Bundle related functionality (validators, processors, hooks) into reusable units.

**Implementation:**
```typescript
const myPlugin = {
    name: 'image-processor',
    version: '1.0.0',
    setup(builder) {
        builder.addValidator(allowedMimeTypes(['image/png', 'image/jpeg']));
        builder.addProcessor(imageTransformer);
        builder.mergeHooks({ onStart: logStart });
    }
};
```

**Benefits:**
- Encapsulation of related concerns
- Version tracking
- Reusability across projects

---

## 3. Strategy Pattern

**Location:** `src/core/types.ts` (Storage interface)

**Purpose:** Swap storage implementations without changing pipeline logic.

**Implementation:**
```typescript
// Local storage
const storage = localStorage('./uploads');

// Cloud storage (hypothetical)
const storage = s3Storage({ bucket: 'my-bucket' });

// Both implement Storage interface
const pipeline = createPipeline({ storage });
```

**Benefits:**
- Runtime storage selection
- Testability (mock storage)
- Easy cloud migration

---

## 4. Chain of Responsibility

**Location:** `src/core/executor.ts`

**Purpose:** Pass context through sequential handlers.

**Implementation:**
```
Input → Validator1 → Validator2 → ... → Processor1 → Processor2 → ... → Storage
```

**Benefits:**
- Each handler focuses on single responsibility
- Handlers can be added/removed independently
- Clear execution order

---

## 5. Hook/Event Listener Pattern

**Location:** `src/core/hooks.ts`

**Purpose:** Allow external code to react to pipeline lifecycle events.

**Implementation:**
```typescript
const pipeline = createPipeline({
    hooks: {
        onStart: (ctx) => console.log('Starting'),
        onFinish: (result) => console.log('Done'),
        onError: (err, ctx) => console.error(err)
    }
});
```

**Benefits:**
- Cross-cutting concerns separated
- Logging, metrics, analytics without modifying core logic
- Error recovery mechanisms

---

## 6. Factory Pattern

**Location:** `src/core/pipeline.ts`

**Purpose:** Create pipeline instances without direct constructor calls.

**Implementation:**
```typescript
const pipeline = createPipeline(config);
// vs: new Pipeline(config)
```

**Benefits:**
- Hides implementation details
- Simplifies object creation
- Enables future implementation changes

---

## 7. Template Method Pattern

**Location:** `src/core/executor.ts`

**Purpose:** Define skeleton algorithm with customizable steps.

**Implementation:**
```
onStart → validate → afterValidate → process → afterProcess → save → onFinish
```

**Benefits:**
- Fixed execution order
- Hookable at multiple points
- Consistent behavior across uses

---

## 8. Error Hierarchy

**Location:** `src/utils/errors.ts`

**Purpose:** Categorize and handle different error types.

**Implementation:**
```
PipelineError (base)
├── ValidationError
├── ProcessorError
└── StorageError
```

**Benefits:**
- Type-safe error handling
- Context-rich error information
- Differentiated recovery strategies

---

## Pattern Interaction Diagram

```
                    ┌─────────────────┐
                    │   createPipeline │ (Factory)
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │  PipelineBuilder │ (Builder)
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
     ┌────────▼────┐  ┌──────▼─────┐  ┌────▼────────┐
     │  Validators │  │ Processors │  │    Hooks    │
     │  (Strategy) │  │   (Chain)  │  │  (Observer) │
     └─────────────┘  └────────────┘  └─────────────┘
              │              │              │
              └──────────────┼──────────────┘
                             │
                    ┌────────▼────────┐
                    │    Executor     │ (Template Method)
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │     Storage     │ (Strategy)
                    └─────────────────┘
```

---

## Summary

| Pattern | File | Purpose |
|---------|------|---------|
| Builder | builder.ts | Fluent configuration |
| Plugin | plugin.ts | Reusable extensions |
| Strategy | types.ts (Storage) | Swappable backends |
| Chain of Responsibility | executor.ts | Sequential processing |
| Hook/Observer | hooks.ts | Lifecycle events |
| Factory | pipeline.ts | Instance creation |
| Template Method | executor.ts | Fixed execution skeleton |
| Error Hierarchy | errors.ts | Typed error handling |
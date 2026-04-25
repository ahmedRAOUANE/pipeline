# Media Pipeline (MVP) — Full Documentation

## 📌 Overview

**Media Pipeline** is a lightweight, storage-agnostic file processing engine for Node.js applications.

It provides a composable system to:

- Validate files
- Transform files
- Store files
- Return structured metadata

It is designed to be:
- Framework-agnostic (Node, Next.js, Express, etc.)
- Extensible (validators, processors, storage adapters)
- Minimal in dependencies
- Portable (Docker / self-hosted environments)

---

## 🧠 Core Concept

The system is built around a single idea:

> A file passes through a controlled pipeline

```text
file → validators → processors → storage → result
```

each stage is
- Independent
- Optional
- Replaceable

## 🧱 Architecture Overview
### High-Level Flow
```
        ┌──────────────┐
        │   Input File  │
        └──────┬───────┘
               ↓
        ┌────────────────┐
        │  Validators     │
        └──────┬─────────┘
               ↓
        ┌────────────────┐
        │  Processors     │
        └──────┬─────────┘
               ↓
        ┌────────────────┐
        │  Storage Layer  │
        └──────┬─────────┘
               ↓
        ┌────────────────┐
        │ Output Metadata │
        └────────────────┘
```

## 🔌 Core Components
### 1. Pipeline Core (createPipeline)

Main orchestrator of the system.

Responsibilities:
- Accept file input
- Run validators
- Run processors
- Call storage
- Return result `pipeline.process(file)`

### 2. Execution Engine (executor.ts)

The internal brain of the system.

Execution order:
- Validators (stop on failure)
- Processors (transform file sequentially)
- Storage (final persistence)

### 3. Validators

Purpose:

Ensure file meets constraints before processing

Examples:
- File size limits
- MIME type validation

Behavior:
- Can block execution (throw error)
- Must NOT modify file `(file) => void | Promise<void>`

### 4. Processors

Purpose:

Transform file content step-by-step

Examples:
- Rename files
- Compression (future)
- Image processing (future)

Behavior:
- Input → Output transformation
- Chainable `(file) => PipelineFile | Promise<PipelineFile>`

5. Storage Adapter

Purpose:

Persist final file and return metadata

Current implementation:
- Local filesystem storage

Future:
- S3
- MinIO
- Cloud storage providers `save(file) → { url, path, size }`


## 📦 File Structure
```
media-pipline/
│
├── src/
│   ├── core/
│   │   ├── pipeline.ts        # Public API (createPipeline)
│   │   ├── executor.ts        # Pipeline execution engine
│   │   └── types.ts           # Core types
│   │
│   ├── storage/
│   │   └── local.storage.ts   # Local filesystem adapter
│   │
│   ├── validators/
│   │   ├── size.validator.ts  # File size validation
│   │   └── mime.validator.ts  # MIME validation
│   │
│   ├── processors/
│   │   └── identity.processor.ts
│   │
│   ├── utils/
│   │   ├── errors.ts          # (future) error system
│   │   └── file.ts            # helpers
│   │
│   └── index.ts               # Public exports
│
├── dist/
├── package.json
├── tsconfig.json
└── README.md
```

## 🔄 Data Flow
### Step 1 — Input
```ts
PipelineFile = {
  buffer: Buffer,
  filename: string,
  mimeType: string,
  size: number
}
```

### Step 2 — Validation
- Runs sequentially
- Any failure stops pipeline

### Step 3 — Processing `file → processor1 → processor2 → processor3`

Each processor can transform the file.

### Step 4 — Storage

File is persisted using storage adapter.

### Step 5 — Output
```ts
{
  url: string,
  path: string,
  size: number
}
```

## 🧠 Design Principles
### 1. Separation of Concerns
- Validators = rules
- Processors = transformation
- Storage = persistence

### 2. Composability

Everything is modular and replaceable.

### 3. Storage Agnosticism

No dependency on filesystem/cloud.

### 4. Minimal Core

No HTTP, no upload handling, no frameworks.

## 🚫 Non-Goals

This library does NOT provide:
- File upload handling (Multer, Next.js, etc.)
- CDN functionality
- Database integration
- UI components
- Authentication

## ⚙️ Current Limitations (MVP)
- Only local storage implemented
- No image processing yet
- No plugin system yet
- No streaming support
- No async queue system
- No HTTP upload layer

## 🔮 Future Roadmap
### Phase 1 — MVP (Current)
- Core pipeline engine
- Validators
- Processors
- Local storage

## Phase 2 — Processing Power
- Image processing (Sharp)
- File hashing
- Multiple output variants

## Phase 3 — Extensibility
- Plugin system
- Middleware-style pipeline
- Dynamic registration

## Phase 4 — Scalability
- S3 / MinIO adapters
- Background workers (BullMQ)
- Async processing

## 🧩 Key Insight

This project is NOT a file uploader.

It is:
A deterministic file transformation pipeline engine

Uploads, APIs, and UI layers belong outside this system.


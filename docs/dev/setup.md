# Setup Guide

## Prerequisites

- A current Node.js LTS release. The repo does not declare an `engines` field, but the toolchain assumes modern Node.js behavior and built-ins.
- `npm`

---

## Install And Build

### 1. Clone the repository

```bash
git clone <repository-url>
cd media-pipline
```

### 2. Install dependencies

```bash
npm install
```

### 3. Build the library

```bash
npm run build
```

This generates:

- `dist/index.js`
- `dist/index.mjs`
- `dist/index.d.ts`
- `dist/index.d.mts`

---

## What The Repo Actually Exposes

`package.json` currently defines a single npm script:

```json
{
  "scripts": {
    "build": "tsup"
  }
}
```

That means the following are not preconfigured today:

- watch mode
- npm-based test commands
- npm-based typecheck command
- linting commands

---

## Manual Smoke Testing

The `tests/` directory contains exploratory scripts, but it is not wired into `npm test`. For a simple local smoke test after building, import from `dist/` directly.

### CommonJS example

```js
const { createPipeline, localStorage } = require("./dist/index.js");

const pipeline = createPipeline({
  storage: localStorage("./uploads"),
});
```

### ESM example

```js
import { createPipeline, localStorage } from "./dist/index.mjs";

const pipeline = createPipeline({
  storage: localStorage("./uploads"),
});
```

---

## Project Structure

```text
media-pipline/
|-- docs/
|-- dist/
|-- src/
|   |-- core/
|   |-- processors/
|   |-- storage/
|   |-- types/
|   |-- utils/
|   `-- validators/
|-- tests/
|-- package.json
|-- tsconfig.json
`-- tsup.config.ts
```

---

## Troubleshooting

### Build fails

- Confirm dependencies are installed with `npm install`
- Confirm `tsup` is available through `node_modules/.bin`
- Check for TypeScript errors in `src/`

### Import shape looks wrong

- `require("media-pipeline")` resolves to `dist/index.js`
- `import "media-pipeline"` resolves to `dist/index.mjs`

### Test commands from older docs fail

Older docs referenced `npm run dev`, `npm run typecheck`, and `npm test`. Those commands are not defined in the current `package.json`.

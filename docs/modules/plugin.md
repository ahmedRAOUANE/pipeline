# Plugin Module

**Files:** `src/types/plugin.ts`, `src/utils/plugins.ts`

## Purpose

The plugin system lets callers package validators, processors, hooks, and storage changes into reusable setup units.

---

## Plugin Types

```ts
type PipelinePluginSetup = (builder: PipelineBuilder) => void;

type PipelinePluginFunction = PipelinePluginSetup & {
  displayName?: string;
};

type PipelinePlugin = {
  name: string;
  version?: string;
  setup: PipelinePluginSetup;
};
```

---

## Type Guard

`src/utils/plugins.ts` exposes:

```ts
function isPipelinePlugin(obj: any): obj is PipelinePlugin
```

It checks for an object with a callable `setup` property.

---

## Runtime Rules In `createPipeline().use()`

- object plugins must have a non-empty `name`
- function plugins may omit a formal name, but then tracing falls back to `displayName` or `"anonymous-plugin"`
- invalid plugin input throws `PluginError`
- after setup runs, plugin metadata is registered on the builder

---

## Practical Guidance

- prefer object plugins when you want explicit `name` and `version`
- use `displayName` on function plugins if the JavaScript function name is unstable or minified
- keep plugin setup side effects limited to builder mutation

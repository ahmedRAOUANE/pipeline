import { OwnedProcessor, OwnedValidator, PipelineConfig, Processor, Storage, Validator } from "../types/pipeline";
import { PipelineHooks } from "../types/hooks";
import { PipelineMeta, PluginMeta } from "../types/plugin-meta";

export class PipelineBuilder {
    // old version
    validators: Validator[] = [];
    processors: Processor[] = [];

    // validators: OwnedValidator[] = [];
    // processors: OwnedProcessor[] = [];
    hooks: PipelineHooks = {};
    storage: Storage;
    meta: PipelineMeta = {
        plugins: [],
        trace: []
    };

    private currentPlugin?: string;

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
        for (const key in hooks) {
            const k = key as keyof PipelineHooks;

            const existing = this.hooks[k];
            const incoming = hooks[k];

            if (!incoming) continue;

            if (!existing) {
                (this.hooks as Record<string, any>)[k] = incoming;
                continue;
            }

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
        }
    }

    registerPlugin(meta: PluginMeta) {
        this.meta.plugins.push(meta);
    }
}
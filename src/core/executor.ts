import { PipelineHooks } from "../types/hooks";
import { trace } from "./tracer";
import { PipelineContext, PipelineResult, Processor, Storage, Validator } from "../types/pipeline";

export async function executePipeline(params: {
    ctx: PipelineContext;
    validators?: Validator[];
    processors?: Processor[];
    storage: Storage;
    hooks?: PipelineHooks;
}): Promise<PipelineResult> {
    let ctx = params.ctx;

    const hooks = params.hooks;

    try {
        // 🟢 onStart
        await hooks?.onStart?.(ctx);
        trace(ctx, {
            plugin: "core",
            stage: "hook",
            message: "onStart executed",
        });
        
        // 🟡 onValidate
        for (const validator of params.validators ?? []) {
            const start = Date.now();
            await validator(ctx);
            trace(ctx, {
                plugin: validator.name || "anonymous-validator",
                stage: "validator",
                message: "validation passed",
                duration: Date.now() - start,
            });
        }
        
        await hooks?.afterValidate?.(ctx);
        
        // 🔵 onProcess
        for (const processor of params.processors ?? []) {
            const start = Date.now();

            ctx = await processor(ctx);

            trace(ctx, {
                plugin: processor.name || "anonymous-processor",
                stage: "processor",
                message: "processed",
                duration: Date.now() - start,
            });
        }
        
        await hooks?.afterProcess?.(ctx);
        
        // 💾 storage
        const start = Date.now();

        const result = await params.storage.save(ctx.file);

        trace(ctx, {
            plugin: "storage",
            stage: "storage",
            message: "file saved",
            duration: Date.now() - start,
        });
        
        // 🟣 onFinish
        await hooks?.onFinish?.(result, ctx);
        trace(ctx, {
            plugin: "core",
            stage: "hook",
            message: "onFinish executed",
        });

        return { ...result, metadata: { ...ctx.metadata, ...result.metadata }, meta: ctx.meta };

    } catch (err: any) {

        const error = err instanceof Error ? err : new Error(String(err));

        // 🔴 onError
        await hooks?.onError?.(error, ctx);
        trace(ctx, {
            plugin: "core",
            stage: "hook",
            message: "onError executed",
        });

        throw err;
    }
}
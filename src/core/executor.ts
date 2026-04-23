import { PipelineHooks } from "./hooks";
import { PipelineContext, PipelineResult, Processor, Storage, Validator } from "./types";

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
        
        // 🟡 onValidate
        for (const validator of params.validators ?? []) {
            await validator(ctx);
        }
        
        await hooks?.afterValidate?.(ctx);
        
        // 🔵 onProcess
        for (const processor of params.processors ?? []) {
            ctx = await processor(ctx);
        }
        
        await hooks?.afterProcess?.(ctx);
        
        // 💾 storage
        const result = await params.storage.save(ctx.file);
        
        // 🟣 onFinish
        await hooks?.onFinish?.(result, ctx);

        return result;

    } catch (err: any) {

        const error = err instanceof Error ? err : new Error(String(err));

        // 🔴 onError
        await hooks?.onError?.(error, ctx);

        throw err;
    }
}
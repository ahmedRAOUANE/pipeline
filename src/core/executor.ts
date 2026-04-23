import { PipelineFile, Processor, Validator, Storage, PipelineResult, PipelineContext } from "./types";

interface ParamsType {
    ctx: PipelineContext;
    validators?: Validator[];
    processors?: Processor[];
    storage: Storage;
}

export async function executePipeline(params: ParamsType): Promise<PipelineResult> {
    let ctx = params.ctx;

    // 1. Validators (stop pipeline if invalid)
    for (const validator of params.validators ?? []) {
        await validator(ctx);
    }

    // 2. Processors (transform file step by step)
    for (const processor of params.processors ?? []) {
        ctx = await processor(ctx);
    }

    // 3. Storage (final step)
    const result = await params.storage.save(ctx.file);

    return result;
}
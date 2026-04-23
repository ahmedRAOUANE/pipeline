import {
    PipelineContext,
    Processor,
    Validator,
    Storage,
    PipelineResult,
} from "./types";
import {
    PipelineError,
    ValidationError,
    ProcessorError,
    StorageError,
} from "../utils/errors";

export async function executePipeline(params: {
    ctx: PipelineContext;
    validators?: Validator[];
    processors?: Processor[];
    storage: Storage;
}): Promise<PipelineResult> {
    let ctx = params.ctx;

    // 1. Validators
    try {
        for (const validator of params.validators ?? []) {
            await validator(ctx);
        }
    } catch (err: any) {
        if (err instanceof PipelineError) throw err;

        throw new ValidationError(err.message || "Validation failed", {
            originalError: err,
        });
    }

    // 2. Processors
    try {
        for (const processor of params.processors ?? []) {
            ctx = await processor(ctx);
        }
    } catch (err: any) {
        if (err instanceof PipelineError) throw err;

        throw new ProcessorError(err.message || "Processing failed", {
            originalError: err,
        });
    }

    // 3. Storage
    try {
        return await params.storage.save(ctx.file);
    } catch (err: any) {
        if (err instanceof PipelineError) throw err;

        throw new StorageError(err.message || "Storage failed", {
            originalError: err,
        });
    }
}
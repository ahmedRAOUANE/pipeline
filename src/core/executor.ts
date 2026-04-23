import { PipelineFile, Processor, Validator, Storage, PipelineResult } from "./types";

export async function executePipeline(params: {
    file: PipelineFile;
    validators?: Validator[];
    processors?: Processor[];
    storage: Storage;
}): Promise<PipelineResult> {
    let file = params.file;

    // 1. Validators (stop pipeline if invalid)
    for (const validator of params.validators ?? []) {
        await validator(file);
    }

    // 2. Processors (transform file step by step)
    for (const processor of params.processors ?? []) {
        file = await processor(file);
    }

    // 3. Storage (final step)
    const result = await params.storage.save(file);

    return result;
}
import { executePipeline } from "./executor";
import { PipelineFile, Processor, Validator, Storage, PipelineResult } from "./types";

export function createPipeline(config: {
    validators?: Validator[];
    processors?: Processor[];
    storage: Storage;
}) {
    return {
        async process(file: PipelineFile): Promise<PipelineResult> {
            return executePipeline({
                file,
                ...(config.validators && { validators: config.validators }),
                ...(config.processors && { processors: config.processors }),
                storage: config.storage,
            });
        },
    };
}
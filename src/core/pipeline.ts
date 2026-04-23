import { executePipeline } from "./executor";
import { PipelineConfig } from "./types";

export function createPipeline(config: PipelineConfig) {
    return {
        async process(file: any) {
            const ctx = {
                file,
                metadata: {},
            };

            return executePipeline({
                ctx,
                storage: config.storage,
                ...(config.validators && { validators: config.validators }),
                ...(config.processors && { processors: config.processors }),
                ...(config.hooks && { hooks: config.hooks }),
            });
        },
    };
}
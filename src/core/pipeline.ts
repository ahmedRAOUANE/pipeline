import { executePipeline } from "./executor";
import { PipelineConfig } from "./types";
import { PipelinePlugin } from "./plugin";
import { PipelineBuilder } from "./builder";

export function createPipeline(config: PipelineConfig) {
    const builder = new PipelineBuilder(config);

    return {
        use(plugin: PipelinePlugin) {
            plugin(builder);
            return this;
        },

        async process(file: any) {
            const ctx = {
                file,
                metadata: {},
            };

            // console.log("processors length:", builder.processors.length);
            return executePipeline({
                ctx,
                storage: builder.storage,
                ...(builder.validators && { validators: builder.validators }),
                ...(builder.processors && { processors: builder.processors }),
                ...(builder.hooks && { hooks: builder.hooks }),
            });
        },
    };
}
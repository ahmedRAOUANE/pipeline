import { executePipeline } from "./executor";
import { PipelineConfig, PipelineContext, PipelineFile } from "./types";
import { PipelinePlugin } from "./plugin";
import { PipelineBuilder } from "./builder";

export function createPipeline(config: PipelineConfig) {
    const builder = new PipelineBuilder(config);

    return {
        use(plugin: PipelinePlugin) {
            plugin.setup(builder);
            builder.registerPlugin({
                name: plugin.name ?? "unknown",
                version: plugin.version as unknown as string,
            });
            return this;
        },

        async process(file: PipelineFile) {
            const ctx: PipelineContext = {
                file,
                metadata: {},
                meta: builder.meta
            };

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
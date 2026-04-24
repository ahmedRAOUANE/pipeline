import { executePipeline } from "./executor";
import { PipelineConfig, PipelineContext, PipelineFile } from "./types";
import { PipelinePlugin, PipelinePluginSetup, isPipelinePlugin } from "./plugin";
import { PipelineBuilder } from "./builder";
import { PluginMeta } from "./plugin-meta";

export function createPipeline(config: PipelineConfig) {
    const builder = new PipelineBuilder(config);

    return {
        use(plugin: PipelinePlugin | PipelinePluginSetup) {
            let setup: PipelinePluginSetup;
            let name: string = "anonymous-plugin";
            let version: string | undefined;

            if (isPipelinePlugin(plugin)) {
                setup = plugin.setup;
                name = plugin.name;
                version = plugin.version;
            } else if (typeof plugin === 'function') {
                setup = plugin;
                name = plugin.name || "anonymous-plugin";
            } else {
                throw new Error("Plugin must be an object with setup() or a function");
            }

            setup(builder);
            builder.registerPlugin({ name, version } as unknown as PluginMeta);
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
                validators: builder.validators,
                processors: builder.processors,
                hooks: builder.hooks,
            });
        }
    };
}
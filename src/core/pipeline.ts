import { executePipeline } from "./executor";
import { PipelineConfig, PipelineContext, PipelineFile } from "../types/pipeline";
import { PipelinePlugin, PipelinePluginFunction, PipelinePluginSetup } from "../types/plugin";
import { PipelineBuilder } from "./builder";
import { PluginMeta } from "../types/plugin-meta";
import { isPipelinePlugin } from "../utils/plugins";
import { PluginError } from "../utils/errors";

export function createPipeline(config: PipelineConfig) {
    const builder = new PipelineBuilder(config);

    return {
        use(plugin: PipelinePlugin | PipelinePluginSetup) {
            let setup: PipelinePluginSetup;
            let name: string;
            let version: string | undefined;

            if (isPipelinePlugin(plugin)) {
                if (!plugin.name || typeof plugin.name !== 'string' || plugin.name.trim() === '') {
                    throw new PluginError(
                        `Invalid plugin: object plugin must have a non-empty string 'name' property. Received: ${plugin.name}`
                    );
                }

                setup = plugin.setup;
                name = plugin.name;
                version = plugin.version;
            } else if (typeof plugin === 'function') {
                setup = plugin;
                const displayName = (setup as PipelinePluginFunction).displayName;
                name = plugin.name?.trim() || displayName|| "anonymous-plugin";

                // send warning instead of throwing error when no known name set for the plugin
                if (!plugin.name || plugin.name.trim() === '') {
                    console.warn(
                        `Function plugin has no usable name. Using "${name}" for tracing. ` +
                        `\nSet plugin.displayName or use an object plugin with explicit name.`
                    );
                }
            } else {
                throw new PluginError(
                    "Plugin must be an object with setup() method and a 'name' property, or a setup function.",
                );
            }

            setup(builder);
            builder.registerPlugin({ name, version });
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
import { PipelineBuilder } from "./builder";

export type PipelinePluginSetup = (builder: PipelineBuilder) => void;

export type PipelinePlugin = {
    name: string,
    version?: string,
    setup: PipelinePluginSetup
};

export function isPipelinePlugin(obj: any): obj is PipelinePlugin {
    return obj && typeof obj === 'object' && 'setup' in obj && typeof obj.setup === 'function';
}
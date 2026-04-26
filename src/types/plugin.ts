import { PipelineBuilder } from "../core/builder";

export type PipelinePluginSetup = (builder: PipelineBuilder) => void;

export type PipelinePlugin = {
    name: string,
    version?: string,
    setup: PipelinePluginSetup
};

export function isPipelinePlugin(obj: any): obj is PipelinePlugin {
    // if (!obj.name || typeof obj.name !== 'string') throw new Error('Plugin must have a string name');
    return obj && typeof obj === 'object' && 'setup' in obj && typeof obj.setup === 'function' && (!obj.name || typeof obj.name !== 'string');
}
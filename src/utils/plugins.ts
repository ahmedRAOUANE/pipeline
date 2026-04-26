import { PipelinePlugin } from "../types/plugin";

export function isPipelinePlugin(obj: any): obj is PipelinePlugin {
    // if (!obj.name || typeof obj.name !== 'string') throw new Error('Plugin must have a string name');
    return obj && typeof obj === 'object' && 'setup' in obj && typeof obj.setup === 'function' && (!obj.name || typeof obj.name !== 'string');
}
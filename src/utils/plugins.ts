import { PipelinePlugin } from "../types/plugin";

export function isPipelinePlugin(obj: any): obj is PipelinePlugin {
    return obj && typeof obj === 'object' && 'setup' in obj && typeof obj.setup === 'function';
}
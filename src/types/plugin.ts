import { PipelineBuilder } from "../core/builder";

export type PipelinePluginSetup = (builder: PipelineBuilder) => void;

export type PipelinePlugin = {
    name: string,
    version?: string,
    setup: PipelinePluginSetup
};